import React from "react";
import {State} from "../types";
import {useDispatch, useSelector} from "react-redux";
import {loadPizzas} from "../store/actionCreators";

export function useApp() {
    const dispatch = useDispatch();
    const pizza = useSelector((state: State) => state.pizza);
    const basket = useSelector((state: State) => state.basket);

    React.useEffect(() => {
        // loadPizzas - thunkActionCreator
        dispatch(loadPizzas());
    }, [dispatch]);

    return {
        totalPrice: basket.reduce(
            (acc, pizza) => acc + pizza.price*pizza.count, 0
        ),
        isPizzasEmpty: pizza.length === 0,
        isBasketEmpty: basket.length === 0,
    };
}
