import React from "react";

// CSS
import CSSModules from "react-css-modules";
import s from "./hexagon.module.scss";
import cn from "classnames";

const Hexagon = ({x, y, width, height, data, appeared = false, added = false}) => {
    const strokeWidth = 2;

    return (
        <svg
            styleName={cn("hexagon",

                {
                    "hexagon_appeared": appeared,
                    "hexagon_added": added
                })
            }
            viewBox={`-100 ${-87-strokeWidth} 200 ${174+2*strokeWidth}`}
            style={{
                left: x,
                top: y,
                width,
                height
            }}
             data-x={data.x}
             data-y={data.y}
             data-z={data.z}
             data-value={data.value || 0}
        >
            <polygon
                styleName="hexagon-polygon"
                points="100,0 50,-87 -50,-87 -100,-0 -50,87 50,87"
                style={{ strokeWidth: strokeWidth, strokeLinejoin: "round" }}
            />
            <text styleName="hexagon-text" dy="0.4em">
                <tspan>{data.value || ""}</tspan>
            </text>
        </svg>
    )
}

export default CSSModules(Hexagon, s, {
    allowMultiple: true
});
