import {Middleware} from "redux";
import {Action, ActionTypes, PizzaEvent, State} from "../types";
import {fetchServer} from "../utils/utils";

export const fetcherMiddleware: Middleware<{}, State> = ({ getState, dispatch }) => (nextDispatch) => (action: Action) => {
    const result: PizzaEvent = {
        eventName: action.type
    }

    if ([ActionTypes.PizzaAdded, ActionTypes.PizzaRemoved].includes(action.type)) {
        const payload = action.payload;
        const pizza = getState().pizza.find(p => p._id === payload);
        if (pizza) {
            result.pizzaName = pizza.name;
            result.pizzaPrice = pizza.price;
        }
    }

    // fetch
    fetchServer(result);

    return nextDispatch(action);
}
