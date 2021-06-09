import React, {MouseEventHandler, WheelEventHandler} from "react";
import styled from "styled-components";
import {useCanvas} from "../../hooks";

const Canvas = styled.canvas`
	flex: 1 1 auto;
	user-select: none;
`;

interface IProps {
	draw: Function,
	onMouseDown: MouseEventHandler,
	onMouseMove: MouseEventHandler,
	onMouseUp: MouseEventHandler,
	OnWheel: WheelEventHandler
}

const GameField: React.FC<IProps> = ({draw, onMouseDown, onMouseUp, onMouseMove, OnWheel}) => {
	const canvasRef = useCanvas(draw);
	return <Canvas
		ref={canvasRef}
		onMouseDown={onMouseDown}
		onMouseUp={onMouseUp}
		onMouseMove={onMouseMove}
		onWheel={OnWheel}
	/>
}

export default GameField;
