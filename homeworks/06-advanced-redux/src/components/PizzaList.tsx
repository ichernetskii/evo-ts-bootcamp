import React from "react";
import { PizzaItem } from "./PizzaItem";
import {connect} from "react-redux";
import {addPizza} from "../store/actionCreators";
import {State} from "../types";

interface PizzaListProps {
    pizza: State["pizza"];
    onAdd: (_id: string) => void;
}

const PizzaList: React.FC<PizzaListProps> = ({pizza, onAdd}) => (
    <>
        {
            pizza.map(p => <PizzaItem
                key={p._id}
                _id={p._id}
                name={p.name}
                price={p.price}
                onAdd={onAdd}
            />)
        }
    </>
)

const mapStateToProps = (state: State) => ({
    pizza: state.pizza
})

const mapDispatchToProps = {
    onAdd: addPizza
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PizzaList);
