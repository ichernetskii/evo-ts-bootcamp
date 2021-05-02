import React from 'react';
import './App.css';
import {
    Loading,
    Missing,
    PizzaList,
    PizzaBasket,
    TotalPrice
} from "./components";
import { useApp } from "./hooks";


function App() {
    const { totalPrice, isBasketEmpty, isPizzasEmpty } = useApp();

    const pizzaList = isPizzasEmpty ? <Loading /> : <PizzaList />;
    const pizzaBasket = isBasketEmpty ? <Missing /> : <PizzaBasket />

    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-2 p-8">
                <div className="grid grid-cols-4 gap-4">
                    { pizzaList}
                </div>
            </div>
            <div className="col-span-1 bg-white overflow-y-auto h-full">
                <div className="flex flex-col p-8">
                    <TotalPrice price={totalPrice} />
                    {pizzaBasket}
                    <div className="flex flex-col">
                        <button
                            className="bg-yellow-400 rounded-xl pt-2 pb-2"
                        >Make Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;


