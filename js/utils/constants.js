// Glass effect constants
export const GLASS_EFFECTS = {
    BASE_FREQUENCY: 0.008,
    NUM_OCTAVES: 2,
    SCALE: 77,
    COLORS: {
        DEFAULT_BG: 'rgba(0, 0, 0, 0.25)',
        SUCCESS_BG: 'rgba(0, 50, 0, 0.25)',
        ERROR_BG: 'rgba(50, 0, 0, 0.25)',
        BUTTON_BG: 'rgba(59, 130, 246, 0.25)',
        HIGHLIGHT: 'rgba(255, 255, 255, 0.15)',
        TEXT: '#ffffff'
    }
};

// Layout dimensions and margins
export const LAYOUT = {
    MARGINS: {
        DEFAULT: 20,
        BOTTOM: 20
    },
    DIMENSIONS: {
        PROMPT_WIDTH: 420,
        CAPTION_WIDTH: 150,
        CAPTION_HEIGHT: 45
    },
    TRANSITIONS: {
        SCALE_DURATION: 200,
        OPACITY_DURATION: 200,
        TRANSFORM_DURATION: 400
    }
};

// Timing constants
export const TIMING = {
    FRAME_CAPTURE_DELAY: 50,
    VIDEO_RECOVERY_INTERVAL: 1000,
    RESIZE_DEBOUNCE: 50,
    SUGGESTION_DELAY: 50
};

// Prompts
const DEFAULT_PROMPT = 'Describe what you see in one sentence.';
export const PROMPTS = {
    default: DEFAULT_PROMPT,
    placeholder: DEFAULT_PROMPT,
    suggestions: [
        DEFAULT_PROMPT,
        'What is the color of my shirt?',
        'Identify any text or written content visible.',
        'What emotions or actions are being portrayed?',
        'Name the object I am holding in my hand.'
    ],
    fallbackCaption: 'Waiting for first caption...',
    processingMessage: 'Starting analysis...'
};

// Model configuration
export const MODEL_CONFIG = {
    MODEL_ID: 'onnx-community/FastVLM-0.5B-ONNX',
    MAX_NEW_TOKENS: 512
};
