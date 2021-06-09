import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import GameField from "../game-field/game-field";
import {useStore} from "../../store/store";
import {IPosition} from "../../store/config";
import {IPoint, pointExistInArray, floor} from "../../store/points";

const MainWrapper = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
`;

const Toolbar = styled.aside`
	padding: 2em;
	box-sizing: border-box;
	background: #CCC;
	flex: 0 0 300px;
	position: relative;
`

const Header = styled.h1`
	text-align: center;
`;

const List = styled.ul`
	padding-left: 20px;
`;

const Button = styled.button`
	margin: 20px 0;
	padding: 10px 30px;
	border: 1px solid #999;
	cursor: pointer;
	width: 100px;

	&:hover {
		background-color: #DDD;
	}
`;

const App = observer(() => {
	const config = useStore("config");
	const {centerPosition, grid, togglePaused, setMouseDown,
		mouseDown, setCenterPosition, zoomGrid, setDelay, delay} = config;
	const {points, nextGeneration, deletePoint, addPoint} = useStore("points");

	const screenToAxis = (position: IPosition): IPoint => ({
		x: (position.x - config.centerPosition.x) / config.grid,
		y: (position.y - config.centerPosition.y) / config.grid
	})

	const draw = (ctx: CanvasRenderingContext2D) => {
		const $canvas = ctx.canvas;

		// clear before draw
		ctx.clearRect(0, 0, $canvas.width, $canvas.height);

		// axis
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
		ctx.beginPath();
		for (let y = centerPosition.y; y > 0; y-= grid) {
			ctx.moveTo(0, y);
			ctx.lineTo($canvas.width, y);
		}
		for (let y = centerPosition.y; y < $canvas.height; y+= grid) {
			ctx.moveTo(0, y);
			ctx.lineTo($canvas.width, y);
		}
		for (let x = centerPosition.x; x > 0; x-= grid) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, $canvas.height);
		}
		for (let x = centerPosition.x; x < $canvas.width; x+= grid) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, $canvas.height);
		}
		ctx.stroke();

		// points
		ctx.beginPath();
		ctx.fillStyle = "#000";
		for (let point of points) {
			ctx.fillRect(
				centerPosition.x + point.x*grid + 1,
				centerPosition.y + point.y*grid + 1,
				grid-2,
				grid-2
			);
		}
		ctx.fill();

		// origin
		ctx.beginPath();
		ctx.moveTo(centerPosition.x, centerPosition.y);
		ctx.fillStyle = "#999";
		ctx.arc(centerPosition.x, centerPosition.y, grid/3, 0, 2*Math.PI);
		ctx.fill();
	}

	useEffect(() => {
		const timer = setInterval(function () {
			if (!config.paused) nextGeneration();
		}, delay);

		return () => {
			clearInterval(timer);
		}
	}, [delay, config.paused, nextGeneration]);

  	return (
		<MainWrapper>
			<GameField
				draw={draw}
				onMouseDown={e => {
					setMouseDown({x: e.clientX, y: e.clientY});

					if (config.paused) {
						const point = floor(screenToAxis({x: e.clientX, y: e.clientY}));
						if (pointExistInArray(points, point)) {
							deletePoint(point);
						} else {
							addPoint(point);
						}

					}
				}}
				onMouseUp={() => {
					setMouseDown(null);
				}}
				onMouseMove={e => {
					if (mouseDown) {
						setCenterPosition({
							x: centerPosition.x + e.movementX,
							y: centerPosition.y + e.movementY
						})
					}
				}}
				OnWheel={e => {
					const oldAxisCoords = screenToAxis({x: e.clientX, y: e.clientY});
					zoomGrid(Math.sign(e.deltaY) > 0 ? 1/1.15 : 1.15);
					const newAxisCoords = screenToAxis({x: e.clientX, y: e.clientY});
					setCenterPosition({
						x: centerPosition.x + (newAxisCoords.x - oldAxisCoords.x)*config.grid,
						y: centerPosition.y + (newAxisCoords.y - oldAxisCoords.y)*config.grid,
					})
				}}
			/>
			<Toolbar>
				<Header>Game of life</Header>
				<div>
					<p>Delay animation: {delay.toString()}</p>
					<input type="range" min={10} max={1000} step={10} defaultValue={delay} onChange={e => {
						setDelay(Number.parseInt(e.target.value));
					}} />
				</div>
				<Button onClick={togglePaused}>{config.paused ? "Play" : "Pause"}</Button>
				<p>Control:</p>
				<List>
					<li>Drag & move/scroll by mouse</li>
					<li>Add points when paused</li>
				</List>
			</Toolbar>
		</MainWrapper>
  	);
});

export default App;
