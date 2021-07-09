import React from 'react';
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import GameField from "../game-field/game-field";
import {useStore} from "../../store/store";
import {ICursor, IPosition} from "../../store/config";
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
	flex: 0 0 350px;
	position: relative;
`

const Header = styled.h1`
	text-align: center;
`;

const List = styled.ul`
	padding-left: 20px;
`;

const Range = styled.input`
	cursor: pointer;
`;

const App = observer(() => {
	const config = useStore("config");
	const {
		centerPosition,
		setCenterPosition,
		grid,
		paused,
		togglePaused,
		zoomGrid,
		delay,
		setDelay,
		setMouseDown,
		mouseDown,
		setCursor
	} = config;
	const points = useStore("points");
	const {data, deletePoint, addPoint} = points;

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
		for (let point of data) {
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

  	return (
		<MainWrapper>
			<GameField
				draw={draw}
				onMouseDown={e => {
					if (e.button === 0) {
						setMouseDown({ x: e.clientX, y: e.clientY });
					}
					if (e.button === 2 && paused) {
						const point = floor(screenToAxis({x: e.clientX, y: e.clientY}));
						if (pointExistInArray(points.data, point)) {
							deletePoint(point);
						} else {
							addPoint(point);
						}

					}
				}}
				onMouseUp={e => {
					setCursor(ICursor.Playback);
					if (e.button === 0) {
						if (e.clientX === mouseDown?.x && e.clientY === mouseDown?.y) {
							togglePaused();
						}
						setMouseDown(null);
					}
				}}
				onMouseMove={e => {
					if (e.buttons === 1) {
						setCursor(ICursor.Move);
						setCenterPosition({
							x: centerPosition.x + e.movementX,
							y: centerPosition.y + e.movementY
						})
					}

					if (e.buttons === 2 && config.paused) {
						setCursor(ICursor.Add);
						const point = floor(screenToAxis({x: e.clientX, y: e.clientY}));
						if (!pointExistInArray(points.data, point)) {
							addPoint(point);
						}
					}

					if (e.buttons === 3 && config.paused) {
						setCursor(ICursor.Delete);
						const point = floor(screenToAxis({x: e.clientX, y: e.clientY}));
						if (pointExistInArray(points.data, point)) {
							deletePoint(point);
						}
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
					<Range type="range" min={10} max={1000} step={10} defaultValue={delay} onChange={e => {
						setDelay(Number.parseInt(e.target.value));
					}} />
				</div>
				<p>Control:</p>
				<List>
					<li>Left mouse btn: pause/resume</li>
					<li>Left mouse btn + mouse move: move</li>
					<li>Mouse scroll: zoom</li>
				</List>
				<p>When paused:</p>
				<List>
					<li>Right mouse btn: add/delete</li>
					<li>Right mouse btn + mouse move: add many</li>
					<li>Left+right mouse btn + mouse move: delete many</li>

				</List>
			</Toolbar>
		</MainWrapper>
  	);
});

export default App;
