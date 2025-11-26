/**
 * Main Application Entry Point
 * FastVLM WebGPU - Vanilla JS Version
 */

import StateManager from './utils/state-manager.js';
import { clearChildren, createElement } from './utils/dom-helpers.js';
import { createWebcamPermissionDialog } from './components/WebcamPermissionDialog.js';
import { createWelcomeScreen } from './components/WelcomeScreen.js';
import { createLoadingScreen } from './components/LoadingScreen.js';
import { createCaptioningView } from './components/CaptioningView.js';
import { getStream } from './services/webcam-service.js';

// Application state manager
const stateManager = new StateManager({
    appState: 'requesting-permission',
    webcamStream: null,
    isVideoReady: false
});

// Root element
const root = document.getElementById('root');

// Video element (background)
let videoElement = null;
let currentComponent = null;

/**
 * Create and setup video element
 */
function createVideoElement() {
    if (!videoElement) {
        videoElement = createElement('video', {
            className: 'video-background',
            attributes: {
                autoplay: '',
                muted: '',
                playsinline: ''
            }
        });

        videoElement.addEventListener('canplay', () => {
            stateManager.setState({ isVideoReady: true });
            videoElement.play().catch(err => console.error('Failed to play video:', err));
        }, { once: true });
    }

    return videoElement;
}

/**
 * Get video blur filter based on state
 */
function getVideoBlur(appState) {
    const blurStates = {
        'requesting-permission': 'blur(20px) brightness(0.2) saturate(0.5)',
        'welcome': 'blur(12px) brightness(0.3) saturate(0.7)',
        'loading': 'blur(8px) brightness(0.4) saturate(0.8)',
        'captioning': 'none'
    };

    return blurStates[appState] || blurStates['requesting-permission'];
}

/**
 * Render the application based on current state
 */
function render(state) {
    const { appState, webcamStream, isVideoReady } = state;

    // Clear current component
    if (currentComponent && currentComponent.cleanup) {
        currentComponent.cleanup();
    }
    clearChildren(root);

    // Create background layer
    const bgLayer = createElement('div', {
        className: 'absolute inset-0 bg-gray-900'
    });
    root.appendChild(bgLayer);

    // Add video if stream exists
    if (webcamStream) {
        const video = createVideoElement();
        video.srcObject = webcamStream;
        video.style.filter = getVideoBlur(appState);
        video.style.opacity = isVideoReady ? '1' : '0';
        root.appendChild(video);
    }

    // Add overlay for non-captioning states
    if (appState !== 'captioning') {
        const overlay = createElement('div', {
            className: 'absolute inset-0 bg-overlay'
        });
        root.appendChild(overlay);
    }

    // Render appropriate component
    switch (appState) {
        case 'requesting-permission':
            currentComponent = createWebcamPermissionDialog((stream) => {
                stateManager.setState({
                    webcamStream: stream,
                    appState: 'welcome'
                });
            });
            root.appendChild(currentComponent);
            break;

        case 'welcome':
            currentComponent = createWelcomeScreen(() => {
                stateManager.setState({ appState: 'loading' });
            });
            root.appendChild(currentComponent);
            break;

        case 'loading':
            currentComponent = createLoadingScreen(() => {
                stateManager.setState({ appState: 'captioning' });
            });
            root.appendChild(currentComponent);
            break;

        case 'captioning':
            currentComponent = createCaptioningView(videoElement);
            root.appendChild(currentComponent);
            break;
    }
}

// Subscribe to state changes
stateManager.subscribe(({ state }) => {
    render(state);
});

// Initial render
render(stateManager.getState());
