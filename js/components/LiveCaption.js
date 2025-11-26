/**
 * Live Caption Component
 */

import { createElement, addClass, removeClass } from '../utils/dom-helpers.js';
import { createGlassContainer } from './GlassContainer.js';
import { PROMPTS } from '../utils/constants.js';

export function createLiveCaption() {
    const container = createGlassContainer({
        className: 'live-caption-container rounded-2xl shadow-2xl',
        children: []
    });

    const content = createElement('div', {
        className: 'p-4'
    });

    const label = createElement('p', {
        className: 'text-sm font-semibold text-gray-200 mb-2',
        text: 'Live Caption:'
    });

    const captionText = createElement('p', {
        className: 'live-caption-text',
        text: PROMPTS.fallbackCaption
    });

    content.appendChild(label);
    content.appendChild(captionText);
    container.appendChild(content);

    // Public methods
    container.updateCaption = (caption, isStreaming = false) => {
        captionText.textContent = caption || PROMPTS.fallbackCaption;

        if (isStreaming) {
            addClass(captionText, 'live-caption-streaming');
        } else {
            removeClass(captionText, 'live-caption-streaming');
        }

        removeClass(captionText, 'live-caption-error');
    };

    container.showError = (errorMessage) => {
        captionText.textContent = 'Error: ' + errorMessage;
        addClass(captionText, 'live-caption-error');
        removeClass(captionText, 'live-caption-streaming');
    };

    return container;
}
