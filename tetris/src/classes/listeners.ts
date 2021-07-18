export interface IListeners {
    [event: string]: (...rest: any[]) => any;
}
