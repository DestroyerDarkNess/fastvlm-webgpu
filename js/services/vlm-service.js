/**
 * VLM (Vision Language Model) Service
 * Handles loading and running inference with FastVLM model
 */

import { AutoProcessor, AutoModelForImageTextToText, RawImage, TextStreamer } from '@huggingface/transformers';
import { MODEL_CONFIG } from '../utils/constants.js';

class VLMService {
    constructor() {
        this.processor = null;
        this.model = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.loadPromise = null;
        this.inferenceLock = false;
        this.canvas = null;
    }

    async loadModel(onProgress) {
        if (this.isLoaded) {
            onProgress?.('Model already loaded!');
            return;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.isLoading = true;

        this.loadPromise = (async () => {
            try {
                onProgress?.('Loading processor...');
                this.processor = await AutoProcessor.from_pretrained(MODEL_CONFIG.MODEL_ID);

                onProgress?.('Processor loaded. Loading model...');
                this.model = await AutoModelForImageTextToText.from_pretrained(MODEL_CONFIG.MODEL_ID, {
                    dtype: {
                        embed_tokens: 'fp16',
                        vision_encoder: 'q4',
                        decoder_model_merged: 'q4'
                    },
                    device: 'webgpu'
                });

                onProgress?.('Model loaded successfully!');
                this.isLoaded = true;
            } catch (error) {
                console.error('Error loading model:', error);
                throw error;
            } finally {
                this.isLoading = false;
                this.loadPromise = null;
            }
        })();

        return this.loadPromise;
    }

    async runInference(video, instruction, onTextUpdate) {
        if (this.inferenceLock) {
            console.log('Inference already running, skipping frame');
            return '';
        }

        this.inferenceLock = true;

        if (!this.processor || !this.model) {
            this.inferenceLock = false;
            throw new Error('Model/processor not loaded');
        }

        try {
            // Create canvas if it doesn't exist
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
            }

            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;

            const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Draw current video frame to canvas
            ctx.drawImage(video, 0, 0);

            // Get image data
            const frame = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const rawImg = new RawImage(frame.data, frame.width, frame.height, 4);

            // Prepare messages for the model
            const messages = [
                {
                    role: 'system',
                    content: 'You are a helpful visual AI assistant. Respond concisely and accurately to the user\'s query in one sentence.'
                },
                { role: 'user', content: `<image>${instruction}` }
            ];

            const prompt = this.processor.apply_chat_template(messages, {
                add_generation_prompt: true
            });

            const inputs = await this.processor(rawImg, prompt, {
                add_special_tokens: false
            });

            // Run inference with streaming
            let streamed = '';
            const streamer = new TextStreamer(this.processor.tokenizer, {
                skip_prompt: true,
                skip_special_tokens: true,
                callback_function: (token) => {
                    streamed += token;
                    onTextUpdate?.(streamed.trim());
                }
            });

            const outputs = await this.model.generate({
                ...inputs,
                max_new_tokens: MODEL_CONFIG.MAX_NEW_TOKENS,
                do_sample: false,
                streamer,
                repetition_penalty: 1.2
            });

            const decoded = this.processor.batch_decode(
                outputs.slice(null, [inputs.input_ids.dims.at(-1), null]),
                { skip_special_tokens: true }
            );

            this.inferenceLock = false;
            return decoded[0].trim();
        } catch (error) {
            this.inferenceLock = false;
            throw error;
        }
    }

    getLoadedState() {
        return {
            isLoaded: this.isLoaded,
            isLoading: this.isLoading
        };
    }
}

// Export singleton instance
const vlmService = new VLMService();
export default vlmService;
