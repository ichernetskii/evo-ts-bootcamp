import React, {useRef} from 'react';
import {createStore, Reducer, Store} from "redux";
import './App.css';

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

enum ActionTypes {
    UPDATE_BALANCE = "UPDATE_BALANCE",
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
    GET_BALANCE_WITH_TAX = "GET_BALANCE_WITH_TAX"
}

interface IAction {
    type: keyof typeof ActionTypes
    payload?: number
}

interface IState{
    balance: number
}

const initialState: IState = { balance: 0 }

const reducer: Reducer<IState, IAction> = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_BALANCE:
            return {...state, balance: action.payload ?? 0};
        case ActionTypes.CREDIT:
            return {...state, balance: state.balance + (action.payload ?? 0)};
        case ActionTypes.DEBIT:
            return {...state, balance: state.balance - (action.payload ?? 0)};
        case ActionTypes.GET_BALANCE_WITH_TAX:
            return {...state, balance: state.balance * (100 - (action.payload ?? 13)) / 100};
        default:
            return state;
    }
}

function App() {
    const ref = useRef<HTMLDivElement>(null);

    const store: Store<IState, IAction> = createStore(reducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
    store.subscribe(() => {
        ref.current!.textContent = store.getState().balance.toString();
    });

    const onStartClick = async () => {
        const array: IAction[] = [
            { type: "UPDATE_BALANCE", payload: 1000.0 },
            { type: "CREDIT", payload: 200.0 },
            { type: "CREDIT", payload: 100.0 },
            { type: "GET_BALANCE_WITH_TAX" },
            { type: "DEBIT", payload: 250.0 },
            { type: "UPDATE_BALANCE", payload: 1000.0 },
        ];

        for (const action of array) {
            store.dispatch(action);
            console.log(store.getState());
            await delay(1000);
        }
    }

    return (
        <div className="App">
            Balance: <div ref={ref}>{ store.getState().balance }</div>
            <button onClick={onStartClick}>Start</button>
        </div>
    );
}

export default App;
