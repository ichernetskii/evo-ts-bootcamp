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

const Toolbar = styled.nav`
	background: #CCC;
	flex: 0 0 300px;
`

const App = observer(() => {
	const config = useStore("config");
	const {centerPosition, grid, togglePaused, setMouseDown, mouseDown, setCenterPosition, zoomGrid} = config;
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
		}, 1000);

		return () => {
			clearInterval(timer);
		}
	}, []);

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
				<h1>Game of life</h1>
				<p>Control:</p>
				<p>Moving/zooming by mouse</p>
				<p>Add points when paused</p>
				<button onClick={togglePaused}>{config.paused ? "Play" : "Pause"}</button>
			</Toolbar>
		</MainWrapper>
  	);
});

export default App;
