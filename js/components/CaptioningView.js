/**
 * Captioning View Component
 * Main view for live video captioning
 */

import { createElement } from '../utils/dom-helpers.js';
import { createDraggableContainer } from './DraggableContainer.js';
import { createPromptInput } from './PromptInput.js';
import { createLiveCaption } from './LiveCaption.js';
import { createWebcamCapture } from './WebcamCapture.js';
import vlmService from '../services/vlm-service.js';
import { TIMING, PROMPTS } from '../utils/constants.js';

export function createCaptioningView(videoElement) {
    const container = createElement('div', {
        className: 'absolute inset-0 text-white'
    });

    const innerContainer = createElement('div', {
        className: 'relative w-full h-full'
    });

    // State
    let isRunning = true;
    let currentPrompt = PROMPTS.default;
    let abortController = null;

    // Create components
    const liveCaptionComponent = createLiveCaption();
    const promptInputComponent = createPromptInput((newPrompt) => {
        currentPrompt = newPrompt;
    });

    const webcamCaptureComponent = createWebcamCapture((running) => {
        isRunning = running;

        if (!running) {
            // Stop the loop
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
        } else {
            // Restart the loop
            startCaptioningLoop();
        }
    });

    // Draggable containers
    const promptDraggable = createDraggableContainer({
        initialPosition: 'bottom-left',
        children: [promptInputComponent]
    });

    const captionDraggable = createDraggableContainer({
        initialPosition: 'bottom-right',
        children: [liveCaptionComponent]
    });

    // Captioning loop
    async function startCaptioningLoop() {
        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();
        const signal = abortController.signal;

        const captureLoop = async () => {
            while (!signal.aborted && isRunning) {
                if (videoElement && videoElement.readyState >= 2 && !videoElement.paused && videoElement.videoWidth > 0) {
                    try {
                        webcamCaptureComponent.updateStatus('Processing...');

                        const result = await vlmService.runInference(
                            videoElement,
                            currentPrompt,
                            (streamedText) => {
                                // Update caption as text streams in
                                liveCaptionComponent.updateCaption(streamedText, true);
                            }
                        );

                        if (result && !signal.aborted) {
                            liveCaptionComponent.updateCaption(result, false);
                            webcamCaptureComponent.updateStatus('Running...');
                        }
                    } catch (error) {
                        if (!signal.aborted) {
                            const message = error instanceof Error ? error.message : String(error);
                            liveCaptionComponent.showError(message);
                            webcamCaptureComponent.updateStatus('Error: ' + message, true);
                            console.error('Error processing frame:', error);
                        }
                    }
                }

                if (signal.aborted) break;
                await new Promise((resolve) => setTimeout(resolve, TIMING.FRAME_CAPTURE_DELAY));
            }
        };

        setTimeout(captureLoop, 0);
    }

    // Start the loop
    startCaptioningLoop();

    // Assemble
    innerContainer.appendChild(webcamCaptureComponent);
    innerContainer.appendChild(promptDraggable);
    innerContainer.appendChild(captionDraggable);
    container.appendChild(innerContainer);

    // Cleanup function
    container.cleanup = () => {
        if (abortController) {
            abortController.abort();
        }
        if (promptDraggable.cleanup) {
            promptDraggable.cleanup();
        }
        if (captionDraggable.cleanup) {
            captionDraggable.cleanup();
        }
    };

    return container;
}
