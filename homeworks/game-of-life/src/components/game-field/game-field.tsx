import React, {MouseEventHandler, useCallback, useLayoutEffect, useRef, WheelEventHandler} from "react";
import styled from "styled-components";
import {useCanvas} from "../../hooks";
import {useStore} from "../../store/store";
import {observer} from "mobx-react-lite";

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

const GameField: React.FC<IProps> = observer(({draw, onMouseDown, onMouseUp, onMouseMove, OnWheel}) => {
	const config = useStore("config");
	const points = useStore("points");
	const {nextGeneration} = points;

	const start = useRef<number | null>(null);

	const canvasRef = useCanvas(draw);

	const nextFrame = useCallback((timestamp: number) => {
		if (!start.current) start.current = timestamp;
		const progress = timestamp - (start.current);
		if (progress > config.delay) {
			if (!config.paused) nextGeneration();

			start.current = timestamp;
		}

		requestAnimationFrame(nextFrame);
	}, [config.delay, config.paused, nextGeneration]);

	useLayoutEffect(() => {
		requestAnimationFrame(nextFrame);
	}, [nextFrame]);



	return <Canvas
		ref={canvasRef}
		style={{ cursor: config.cursor }}
		onMouseDown={ e => {
			onMouseDown(e);
		}
		}
		onMouseUp={onMouseUp}
		onMouseMove={onMouseMove}
		onWheel={OnWheel}
		onContextMenu={e => e.preventDefault()}
	/>
});

export default GameField;
