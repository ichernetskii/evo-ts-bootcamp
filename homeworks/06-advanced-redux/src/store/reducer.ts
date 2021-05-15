import {Reducer} from "redux";
import {Action, ActionTypes, Pizza, State} from "../types";

export const initialState: State = {
    pizza: [],
    basket: []
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.PizzaLoaded:
            return {
                ...state,
                pizza: [...action.payload]
            };
        case ActionTypes.PizzaAdded: {
            let basketCopy = [...state.basket];
            const pizzaPosition: number = basketCopy.findIndex(pizza => pizza._id === action.payload);
            const pizza: Pizza = state.pizza.filter(x => x._id === action.payload)[0];

            if (pizzaPosition === -1) {
                return {
                    ...state,
                    basket: [...state.basket, {...pizza, count: 1}]
                }
            } else {
                basketCopy[pizzaPosition].count++;
                return {
                    ...state,
                    basket: basketCopy
                }
            }
        }
        case ActionTypes.PizzaRemoved: {
            const pizzaPosition: number = state.basket.findIndex(pizza => pizza._id === action.payload);
            let basketCopy = [...state.basket];
            basketCopy[pizzaPosition].count--;
            if (basketCopy[pizzaPosition].count === 0) {
                basketCopy = basketCopy.filter(pizza => pizza._id !== action.payload);
            }
            return {
                ...state,
                basket: basketCopy
            };
        }
        default: return state;
    }
}
