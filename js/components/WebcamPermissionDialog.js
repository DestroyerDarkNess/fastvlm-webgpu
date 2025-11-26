/**
 * Webcam Permission Dialog Component
 */

import { createElement } from '../utils/dom-helpers.js';
import { createGlassContainer } from './GlassContainer.js';
import { requestWebcamPermission } from '../services/webcam-service.js';
import { GLASS_EFFECTS } from '../utils/constants.js';

export function createWebcamPermissionDialog(onPermissionGranted) {
    const wrapper = createElement('div', {
        className: 'absolute inset-0 text-white flex items-center justify-center p-8 fade-in'
    });

    // Create loading state
    const loadingContent = createElement('div', {
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
        text: 'Requesting Camera Access'
    });

    const description = createElement('p', {
        className: 'text-gray-400',
        text: 'Please allow camera access to continue'
    });

    loadingContent.appendChild(spinnerContainer);
    loadingContent.appendChild(title);
    loadingContent.appendChild(description);

    const container = createGlassContainer({
        className: 'max-w-md w-full rounded-3xl shadow-2xl',
        children: [loadingContent]
    });

    wrapper.appendChild(container);

    // Request permission on mount
    setTimeout(async () => {
        try {
            const stream = await requestWebcamPermission();

            // Success - notify parent
            if (onPermissionGranted) {
                onPermissionGranted(stream);
            }
        } catch (error) {
            // Show error
            loadingContent.innerHTML = '';

            const errorIconContainer = createElement('div', {
                className: 'error-icon-container mx-auto'
            });

            const errorIcon = createElement('svg', {
                className: 'error-icon',
                attributes: {
                    fill: 'currentColor',
                    viewBox: '0 0 20 20'
                }
            });

            errorIcon.innerHTML = `
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            `;

            errorIconContainer.appendChild(errorIcon);

            const errorTitle = createElement('h2', {
                className: 'text-2xl font-bold text-gray-100 mt-4',
                text: 'Camera Access Denied'
            });

            const errorMessage = createElement('p', {
                className: 'text-red-400',
                text: error.message
            });

            const retryButton = createElement('button', {
                className: 'px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors mt-4',
                text: 'Reload Page'
            });

            retryButton.addEventListener('click', () => window.location.reload());

            loadingContent.appendChild(errorIconContainer);
            loadingContent.appendChild(errorTitle);
            loadingContent.appendChild(errorMessage);
            loadingContent.appendChild(retryButton);

            // Update container to error style
            container.style.background = GLASS_EFFECTS.COLORS.ERROR_BG;
        }
    }, 100);

    return wrapper;
}
