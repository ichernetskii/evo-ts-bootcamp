import React from "react";
import "./field.scss";

interface FieldProps {
    data: number[]
}

interface FieldState {

}

class Field extends React.Component<FieldProps, FieldState> {
    render() {
        const maxValue: number = Math.max(...this.props.data);

        return (
            <div className="field">
                {
                    this.props.data.map((value, idx) => (
                        <div
                            className="field__item"
                            style={{
                                height: `${100 * value / maxValue}%`
                            }}
                            key={`${idx.toString()}:${value.toString()}`}
                        />
                    ))
                }
            </div>
        )
    }
}

export default Field;
