/**
 * Loading Screen Component
 */

import { createElement } from '../utils/dom-helpers.js';
import { createGlassContainer } from './GlassContainer.js';
import { GLASS_EFFECTS } from '../utils/constants.js';
import vlmService from '../services/vlm-service.js';

export function createLoadingScreen(onComplete) {
    const wrapper = createElement('div', {
        className: 'absolute inset-0 text-white flex items-center justify-center p-8'
    });

    let progress = 0;
    let currentStep = 'Initializing...';
    let isError = false;

    const content = createElement('div', {
        className: 'p-8 text-center space-y-8'
    });

    const spinnerContainer = createElement('div', {
        className: 'w-16 h-16 mx-auto'
    });

    const spinner = createElement('div', {
        className: 'loading-spinner'
    });

    spinnerContainer.appendChild(spinner);

    const title = createElement('h2', {
        className: 'text-2xl font-bold text-gray-100',
        text: 'Loading AI Model'
    });

    const stepText = createElement('p', {
        className: 'text-gray-400',
        text: currentStep
    });

    const progressSection = createElement('div', {
        className: 'space-y-2'
    });

    const progressBarContainer = createElement('div', {
        className: 'progress-bar-container'
    });

    const progressBarFill = createElement('div', {
        className: 'progress-bar-fill',
        style: { width: '0%' }
    });

    progressBarContainer.appendChild(progressBarFill);

    const progressPercentText = createElement('p', {
        className: 'text-sm text-gray-500',
        text: '0% complete'
    });

    progressSection.appendChild(progressBarContainer);
    progressSection.appendChild(progressPercentText);

    content.appendChild(spinnerContainer);
    content.appendChild(title);
    content.appendChild(stepText);
    content.appendChild(progressSection);

    const container = createGlassContainer({
        className: 'max-w-md w-full rounded-3xl shadow-2xl',
        children: [content]
    });

    wrapper.appendChild(container);

    // Update UI function
    function updateUI() {
        stepText.textContent = currentStep;
        progressBarFill.style.width = progress + '%';
        progressPercentText.textContent = Math.round(progress) + '% complete';

        if (isError) {
            title.textContent = 'Loading Failed';
            stepText.className = 'text-red-400';
            container.style.background = GLASS_EFFECTS.COLORS.ERROR_BG;
        }
    }

    // Load model
    setTimeout(async () => {
        try {
            currentStep = 'Checking WebGPU support...';
            progress = 5;
            updateUI();

            if (!navigator.gpu) {
                currentStep = 'WebGPU not available in this browser';
                isError = true;
                updateUI();

                // Show error UI
                spinnerContainer.innerHTML = '';
                const errorIconContainer = createElement('div', {
                    className: 'error-icon-container'
                });
                const errorIcon = createElement('svg', {
                    className: 'error-icon',
                    attributes: { fill: 'currentColor', viewBox: '0 0 20 20' }
                });
                errorIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />`;
                errorIconContainer.appendChild(errorIcon);
                spinnerContainer.appendChild(errorIconContainer);

                progressSection.style.display = 'none';

                const reloadButton = createElement('button', {
                    className: 'px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors',
                    text: 'Reload Page'
                });
                reloadButton.addEventListener('click', () => window.location.reload());
                content.appendChild(reloadButton);
                return;
            }

            // Load the model
            await vlmService.loadModel((message) => {
                currentStep = message;

                if (message.includes('Loading processor')) {
                    progress = 10;
                } else if (message.includes('Processor loaded')) {
                    progress = 20;
                } else if (message.includes('Model loaded')) {
                    progress = 80;
                }

                updateUI();
            });

            currentStep = 'Ready to start!';
            progress = 100;
            updateUI();

            // Small delay before completing
            await new Promise(resolve => setTimeout(resolve, 300));
            onComplete();
        } catch (error) {
            console.error('Error loading model:', error);
            currentStep = `Error loading model: ${error.message}`;
            isError = true;
            updateUI();

            // Show error UI
            spinnerContainer.innerHTML = '';
            const errorIconContainer = createElement('div', {
                className: 'error-icon-container'
            });
            const errorIcon = createElement('svg', {
                className: 'error-icon',
                attributes: { fill: 'currentColor', viewBox: '0 0 20 20' }
            });
            errorIcon.innerHTML = `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />`;
            errorIconContainer.appendChild(errorIcon);
            spinnerContainer.appendChild(errorIconContainer);

            progressSection.style.display = 'none';

            const reloadButton = createElement('button', {
                className: 'px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors',
                text: 'Reload Page'
            });
            reloadButton.addEventListener('click', () => window.location.reload());
            content.appendChild(reloadButton);
        }
    }, 0);

    return wrapper;
}
