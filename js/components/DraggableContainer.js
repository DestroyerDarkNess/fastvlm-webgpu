/**
 * Draggable Container Component
 */

import { createElement, addClass, removeClass } from '../utils/dom-helpers.js';

export function createDraggableContainer(config = {}) {
    const {
        initialPosition = 'bottom-left',
        children = []
    } = config;

    const container = createElement('div', {
        className: 'draggable-container',
        children
    });

    // Set initial position
    const margin = 20;
    if (initialPosition === 'bottom-left') {
        container.style.left = margin + 'px';
        container.style.bottom = margin + 'px';
    } else if (initialPosition === 'bottom-right') {
        container.style.right = margin + 'px';
        container.style.bottom = margin + 'px';
    }

    // Dragging state
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    function dragStart(e) {
        const event = e.type === 'touchstart' ? e.touches[0] : e;

        initialX = event.clientX - currentX;
        initialY = event.clientY - currentY;

        isDragging = true;
        addClass(container, 'dragging');
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const event = e.type === 'touchmove' ? e.touches[0] : e;

        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;

        // Get container dimensions
        const rect = container.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        // Constrain to viewport
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));

        container.style.left = currentX + 'px';
        container.style.top = currentY + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    }

    function dragEnd() {
        isDragging = false;
        removeClass(container, 'dragging');
    }

    // Mouse events
    container.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events
    container.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    // Cleanup function
    container.cleanup = () => {
        container.removeEventListener('mousedown', dragStart);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
        container.removeEventListener('touchstart', dragStart);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', dragEnd);
    };

    return container;
}
