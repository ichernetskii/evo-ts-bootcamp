import {IListeners} from "./listeners";

export class Publisher<L extends IListeners> {
    constructor(private listeners: L) {};

    dispatch<K extends keyof L>(event: K) {
        return (...eventArgs: Parameters<L[typeof event]>) => this.listeners[event](...eventArgs);
    }

    get<K extends keyof L>(event: K): ReturnType<L[typeof event]> {
        return this.listeners[event]();
    }
}

