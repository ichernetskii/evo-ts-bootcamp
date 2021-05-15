export type Pizza = {
    name: string;
    price: number;
    _id: string;
}

export type State = {
    pizza: Pizza[]
    basket: Array<Pizza & { count: number;}>
};

export enum ActionTypes {
    PizzaLoaded = "PIZZA_LOADED",
    PizzaAdded = "PIZZA_ADDED_INTO_BASKET",
    PizzaRemoved = "PIZZA_REMOVED_FROM_BASKET"
}

export interface Action {
    type: ActionTypes
    payload?: any
}

export interface PizzaEvent {
    eventName: ActionTypes,
    pizzaName?: string,
    pizzaPrice?: number
}
