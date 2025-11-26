/**
 * Prompt Input Component
 */

import { createElement } from '../utils/dom-helpers.js';
import { createGlassContainer } from './GlassContainer.js';
import { PROMPTS } from '../utils/constants.js';

export function createPromptInput(onPromptChange) {
    const container = createGlassContainer({
        className: 'prompt-input-container rounded-2xl shadow-2xl',
        children: []
    });

    const content = createElement('div', {
        className: 'p-4'
    });

    const label = createElement('label', {
        className: 'text-sm font-semibold text-gray-200 mb-2',
        text: 'Prompt:',
        style: { display: 'block' }
    });

    const textarea = createElement('textarea', {
        className: 'prompt-textarea',
        attributes: {
            placeholder: PROMPTS.placeholder,
            rows: '3'
        }
    });

    textarea.value = PROMPTS.default;

    // Handle input changes
    let debounceTimer;
    textarea.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const value = e.target.value.trim() || PROMPTS.default;
            onPromptChange?.(value);
        }, 300);
    });

    const suggestionsLabel = createElement('p', {
        className: 'text-sm text-gray-400 mt-3 mb-2',
        text: 'Suggestions:'
    });

    const suggestionsContainer = createElement('div', {
        className: 'prompt-suggestions'
    });

    PROMPTS.suggestions.forEach((suggestion) => {
        const chip = createElement('button', {
            className: 'prompt-suggestion-chip',
            text: suggestion.substring(0, 30) + (suggestion.length > 30 ? '...' : '')
        });

        chip.addEventListener('click', () => {
            textarea.value = suggestion;
            onPromptChange?.(suggestion);
        });

        suggestionsContainer.appendChild(chip);
    });

    content.appendChild(label);
    content.appendChild(textarea);
    content.appendChild(suggestionsLabel);
    content.appendChild(suggestionsContainer);
    container.appendChild(content);

    return container;
}
