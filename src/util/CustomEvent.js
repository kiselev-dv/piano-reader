export default class CEvent {
    constructor() {
        this.listeners = [];
    }

    on(listener) {
        this.listeners.push(listener);
    }

    off(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    fire(data) {
        this.listeners.forEach(l => l(data));
    }
};