/**
 * Simple state manager with event emitting
 */
class StateManager extends EventTarget {
    constructor(initialState = {}) {
        super();
        this.state = { ...initialState };
    }

    setState(updates) {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...updates };

        // Emit change event
        this.dispatchEvent(new CustomEvent('statechange', {
            detail: { state: this.state, prevState, updates }
        }));

        return this.state;
    }

    getState() {
        return { ...this.state };
    }

    subscribe(callback) {
        const listener = (event) => callback(event.detail);
        this.addEventListener('statechange', listener);

        // Return unsubscribe function
        return () => this.removeEventListener('statechange', listener);
    }
}

export default StateManager;
