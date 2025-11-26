/**
 * Webcam Capture Component (Play/Pause controls)
 */

import { createElement, addClass, removeClass } from '../utils/dom-helpers.js';

export function createWebcamCapture(onToggle) {
    const container = createElement('div', {
        className: 'webcam-controls'
    });

    // Toggle button
    const toggleButton = createElement('button', {
        className: 'webcam-toggle-btn',
        attributes: {
            'aria-label': 'Toggle video captioning'
        }
    });

    // Play icon (default state)
    const playIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
    `;

    // Pause icon
    const pauseIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
    `;

    let isRunning = true;
    toggleButton.innerHTML = pauseIcon;

    toggleButton.addEventListener('click', () => {
        isRunning = !isRunning;
        toggleButton.innerHTML = isRunning ? pauseIcon : playIcon;

        if (isRunning) {
            removeClass(toggleButton, 'paused');
        } else {
            addClass(toggleButton, 'paused');
        }

        onToggle?.(isRunning);
    });

    // Status text
    const statusText = createElement('div', {
        className: 'webcam-status',
        text: 'Running...'
    });

    container.appendChild(toggleButton);
    container.appendChild(statusText);

    // Public methods
    container.updateStatus = (status, isError = false) => {
        statusText.textContent = status;
        if (isError) {
            addClass(statusText, 'error');
        } else {
            removeClass(statusText, 'error');
        }
    };

    container.setRunning = (running) => {
        isRunning = running;
        toggleButton.innerHTML = isRunning ? pauseIcon : playIcon;

        if (isRunning) {
            removeClass(toggleButton, 'paused');
            statusText.textContent = 'Running...';
        } else {
            addClass(toggleButton, 'paused');
            statusText.textContent = 'Paused';
        }
    };

    return container;
}
