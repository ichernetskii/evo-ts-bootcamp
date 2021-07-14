export type IListeners = {
    [event in string]: (...rest: any[]) => any;
}

export function createPublisher<L extends IListeners>(_listeners: L) {
    let listeners = _listeners;
    type Type = typeof listeners;
    type Keys = keyof Type;

    return {
        subscribe<K extends Keys>(event: K, fn: Type[K]) {
            listeners[event] = fn;
        },
        unsubscribe<K extends Keys>(event: K) {
            delete listeners[event]
        },
        dispatch<K extends Keys>(event: K, ...eventArgs: Parameters<Type[typeof event]>): void {
            listeners[event](...eventArgs);
        },
        get<K extends Keys>(event: K): ReturnType<Type[typeof event]> {
            return listeners[event]();
        }
    }
}
