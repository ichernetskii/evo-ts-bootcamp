import {applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import {initialState, reducer} from "./reducer";
import {Action, State} from "../types";
import { Store } from "redux";
import {fetcherMiddleware} from "./fetcherMiddleware";

export const store:Store<State, Action> = createStore(reducer, initialState, compose(
    applyMiddleware(thunk, fetcherMiddleware)
));
