import React from "react";
import {State} from "../types";
import {PizzaBasketItem} from "./PizzaBasketItem";
import {connect} from "react-redux";
import {removePizza} from "../store/actionCreators";

interface PizzaBasketProps {
    basket: State["basket"],
    onMinus: (_id: string) => void;
}

const PizzaBasket: React.FC<PizzaBasketProps> = ({basket, onMinus}: PizzaBasketProps) => {
    return (
        <>
            {
                basket.map((p => <PizzaBasketItem
                    _id={p._id}
                    onMinus={onMinus}
                    key={p._id}
                    price={p.price}
                    name={p.name}
                    count={p.count}
                />))
            }
        </>
    )
}

const mapStateToProps = (state: State) => ({
    basket: state.basket
})

const mapDispatchToProps = {
    onMinus: removePizza
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PizzaBasket);
