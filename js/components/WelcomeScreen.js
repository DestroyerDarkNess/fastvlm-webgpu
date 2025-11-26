/**
 * Welcome Screen Component
 */

import { createElement } from '../utils/dom-helpers.js';
import { createGlassContainer } from './GlassContainer.js';
import { createGlassButton } from './GlassButton.js';
import { createHfIcon } from './HfIcon.js';
import { GLASS_EFFECTS } from '../utils/constants.js';

export function createWelcomeScreen(onStart) {
    const wrapper = createElement('div', {
        className: 'absolute inset-0 text-white flex items-center justify-center p-8'
    });

    const content = createElement('div', {
        className: 'max-w-2xl w-full space-y-8'
    });

    // Main Title Card
    const titleCard = createGlassContainer({
        className: 'rounded-3xl shadow-2xl hover-scale-105 transition-transform',
        role: 'banner',
        children: []
    });

    const titleContent = createElement('div', {
        className: 'p-8 text-center'
    });

    const title = createElement('h1', {
        className: 'text-5xl font-bold text-gray-100 mb-4',
        text: 'FastVLM WebGPU'
    });

    const subtitle = createElement('p', {
        className: 'text-xl text-gray-300',
        html: `Real-time video captioning powered by <a href="https://huggingface.co/onnx-community/FastVLM-0.5B-ONNX" class="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer" aria-label="FastVLM-0.5B model on Hugging Face">FastVLM-0.5B</a>`
    });

    titleContent.appendChild(title);
    titleContent.appendChild(subtitle);
    titleCard.appendChild(titleContent);

    // Camera Status Card
    const statusCard = createGlassContainer({
        bgColor: GLASS_EFFECTS.COLORS.SUCCESS_BG,
        className: 'rounded-2xl shadow-2xl hover-scale-105 transition-transform',
        role: 'status',
        ariaLabel: 'Camera status',
        children: []
    });

    const statusContent = createElement('div', {
        className: 'p-4'
    });

    const statusFlex = createElement('div', {
        className: 'flex items-center justify-center space-x-2'
    });

    const statusDot = createElement('div', {
        className: 'status-indicator'
    });

    const statusText = createElement('p', {
        className: 'text-green-400 font-medium',
        text: 'Camera ready'
    });

    statusFlex.appendChild(statusDot);
    statusFlex.appendChild(statusText);
    statusContent.appendChild(statusFlex);
    statusCard.appendChild(statusContent);

    // How It Works Card
    const howItWorksCard = createGlassContainer({
        className: 'rounded-2xl shadow-2xl hover-scale-105 transition-transform',
        role: 'region',
        children: []
    });

    const howItWorksContent = createElement('div', {
        className: 'p-6'
    });

    const howItWorksTitle = createElement('h2', {
        className: 'text-lg font-semibold text-gray-200 mb-4 text-center',
        text: 'How it works:',
        attributes: { id: 'how-it-works-title' }
    });

    const stepsList = createElement('div', {
        className: 'space-y-3'
    });

    // Step 1
    const step1 = createElement('div', {
        className: 'flex items-start space-x-3'
    });
    const badge1 = createElement('div', {
        className: 'numbered-badge',
        text: '1'
    });
    const step1Text = createElement('p', {
        className: 'text-gray-300',
        html: 'You are about to load <a href="https://huggingface.co/onnx-community/FastVLM-0.5B-ONNX" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">FastVLM-0.5B</a>, a powerful multimodal model optimized for in-browser inference.'
    });
    step1.appendChild(badge1);
    step1.appendChild(step1Text);

    // Step 2
    const step2 = createElement('div', {
        className: 'flex items-start space-x-3'
    });
    const badge2 = createElement('div', {
        className: 'numbered-badge',
        text: '2'
    });
    const step2Text = createElement('p', {
        className: 'text-gray-300'
    });
    const hfIcon = createHfIcon();
    step2Text.innerHTML = 'Everything runs entirely in your browser with <a href="https://github.com/huggingface/transformers.js" class="text-blue-400 underline" target="_blank" rel="noopener noreferrer">Transformers.js</a> and ONNX Runtime Web, meaning no data is sent to a server. It can even run offline!';
    step2Text.insertBefore(hfIcon, step2Text.firstChild.nextSibling);
    step2.appendChild(badge2);
    step2.appendChild(step2Text);

    // Step 3
    const step3 = createElement('div', {
        className: 'flex items-start space-x-3'
    });
    const badge3 = createElement('div', {
        className: 'numbered-badge',
        text: '3'
    });
    const step3Text = createElement('p', {
        className: 'text-gray-300',
        text: 'Get started by clicking the button below.'
    });
    step3.appendChild(badge3);
    step3.appendChild(step3Text);

    stepsList.appendChild(step1);
    stepsList.appendChild(step2);
    stepsList.appendChild(step3);
    howItWorksContent.appendChild(howItWorksTitle);
    howItWorksContent.appendChild(stepsList);
    howItWorksCard.appendChild(howItWorksContent);

    // Start Button
    const buttonContainer = createElement('div', {
        className: 'flex flex-col items-center space-y-4'
    });

    const startButton = createGlassButton({
        className: 'px-8 py-4 rounded-2xl',
        onClick: onStart,
        ariaLabel: 'Start live captioning with AI model',
        children: [
            createElement('span', {
                className: 'font-semibold text-lg',
                text: 'Start Live Captioning'
            })
        ]
    });

    const hint = createElement('p', {
        className: 'text-sm text-gray-400 opacity-80',
        text: 'AI model will load when you click start'
    });

    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(hint);

    // Assemble everything
    content.appendChild(titleCard);
    content.appendChild(statusCard);
    content.appendChild(howItWorksCard);
    content.appendChild(buttonContainer);
    wrapper.appendChild(content);

    return wrapper;
}
