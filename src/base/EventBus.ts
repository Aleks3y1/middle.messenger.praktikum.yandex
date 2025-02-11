export default class EventBus {
    private listeners: Record<string, ((...args: any[]) => void)[]> = {};

    on(event: string, callback: (...args: any[]) => void): void {
        this.listeners[event] ??= [];
        this.listeners[event].push(callback);
    }

    off(event: string, callback: (...args: any[]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }

    emit(event: string, ...args: any[]): void {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach((listener) => listener(...args));
    }
}
