import {ThunkAction} from "redux-thunk";
import {Action, ActionTypes, State} from "../types";
import {getPizza} from "../services/api";
import {Dispatch} from "react";

export function loadPizzas(): ThunkAction<Promise<void>, State, {}, Action> {
    return function (dispatch, getState) {
        return new Promise((resolve) => {
            getPizza()
                .then(pizza => {
                    dispatch({
                        type: ActionTypes.PizzaLoaded,
                        payload: pizza.items
                    })
                });
            resolve();
        })
    }
}

export function addPizza(_id: string) {
    return function (dispatch: Dispatch<Action>, getState: () => State) {
        dispatch({
            type: ActionTypes.PizzaAdded,
            payload: _id
        });
    }
}

export function removePizza(_id: string) {
    return function (dispatch: Dispatch<Action>, getState: () => State) {
        dispatch({
            type: ActionTypes.PizzaRemoved,
            payload: _id
        });
    }
}
