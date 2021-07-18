export interface IListeners {
    [event: string]: (...rest: any[]) => any;
}

// export interface IListenersStore extends IListeners {
//     createNewFigure: () => void,
//     getState: () => typeof gameStore,
//     getFigure: () => IFigure,
//     getHeap: () => ICube[],
// }
//
// export interface IListeners3D extends IListeners {
//     getFigure: () => this.figure,
//     setFigure: (figure: BABYLON.Mesh[]) => { this.figure = figure },
//     rerenderFigure: () => this.rerenderFigure(),
//     updateFigure: (idx: number, position: Vector, material: string) => { this.updateFigure(idx, position, material) },
//     rerenderHeap: () => this.rerenderHeap(),
//     updateHeap: (idx: number, position: Vector, material: string) => { this.updateHeap(idx, position, material) },
//     rerenderGround: () => this.rerenderGround(),
//     rerenderGameField: () => this.rerenderGameField()
// });

export class Publisher<L extends IListeners> {
    constructor(private listeners: L) {};

    // subscribe<K extends keyof L>(event: K, fn: L[typeof event]): void {
    //     this.listeners[event] = fn;
    // }
    //
    // unsubscribe<K extends keyof L>(event: K): void {
    //     delete this.listeners[event]
    // }

    dispatch<K extends keyof L>(event: K) {
        return (...eventArgs: Parameters<L[typeof event]>) => this.listeners[event](...eventArgs);
    }

    get<K extends keyof L>(event: K): ReturnType<L[typeof event]> {
        return this.listeners[event]();
    }
}

// export function createPublisher<L extends IListeners>(_listeners: L) {
//     let listeners = _listeners;
//     type Type = typeof listeners;
//     type Keys = keyof Type;
//
//     return {
//         subscribe<K extends Keys>(event: K, fn: Type[K]) {
//             listeners[event] = fn;
//         },
//         unsubscribe<K extends Keys>(event: K) {
//             delete listeners[event]
//         },
//         dispatch<K extends Keys>(event: K, ...eventArgs: Parameters<Type[typeof event]>): void {
//             listeners[event](...eventArgs);
//         },
//         get<K extends Keys>(event: K): ReturnType<Type[typeof event]> {
//             return listeners[event]();
//         }
//     }
// }
