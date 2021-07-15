import {action, makeAutoObservable, observable} from "mobx";
import {
	Axis,
	Vector,
	randomIntFromInterval,
	roundVector,
	vectorPlusVector
} from "../classes/math";
import {IFigure, Figure} from "../classes/figure";
import {ICube} from "../classes/cube";
import {figures, colors} from "./figures";
import {IGameState} from "../classes/game-state";

class GameStore {
	readonly colors: string[] = colors;
	readonly figures: Vector[][] = figures;
	readonly dy = 1;
	readonly cubeSize = 1;

	size: Vector = [5, 10, 5];
	figure: IFigure = {
		position: [0, 0, 0],
		cubes: []
	};
	finalFigure: IFigure = {
		position: [0, 0, 0],
		cubes: []
	}
	heap: ICube[] = [];
	delay = {
		normal: 2000,
		fast: 50,
		current: 2000
	};
	score = 0;
	gameState: IGameState = IGameState.Playing;

	constructor() {
		makeAutoObservable(this, {
			size: observable,
			figure: observable,
			finalFigure: observable,
			heap: observable,
			delay: observable,
			score: observable,
			gameState: observable,
			changeGameFieldSize: action.bound,
			gameStateToggle: action.bound,
			setPositionFigure: action.bound,
			moveFigure: action.bound,
			rotateFigure: action.bound,
			createNewFigure: action.bound,
			figureToHeap: action.bound,
			deleteLevels: action.bound
		});
	}

	changeGameFieldSize(axis: Axis, size: number) {
		this.size[axis] = size;
		this.createNewFigure(this.figure.cubes[0].color);
		this.heap = [];
		this.gameState = IGameState.Paused;
	}

	gameStateToggle() {
		switch (this.gameState) {
			case IGameState.Paused:
				this.gameState = IGameState.Playing
				break;
			case IGameState.Playing:
				this.gameState = IGameState.Paused
				break;
			case IGameState.Loose:
				this.delay.current = this.delay.normal;
				this.score = 0;
				this.heap = [];
				this.createNewFigure();
				this.gameState = IGameState.Playing
				break;
		}
	}

	setPositionFigure(position: Vector): void {
		const figure = new Figure(this.figure.position, this.figure.cubes);
		figure.setPosition(position);
		this.figure.position = figure.position;
	}

	setFinalFigure(): void {
		const figure = new Figure(this.figure.position, this.figure.cubes);

		this.finalFigure = {
			cubes: this.figure.cubes,
			position: figure.getFinalFigurePosition(this.heap, this.size, this.cubeSize, this.dy)
		};
	}

	moveFigure(axis: Axis, length: number): void {
		const figure = new Figure(this.figure.position, this.figure.cubes);
		figure.move(axis, length);

		if (
			figure.check.heap(this.heap, this.cubeSize) &&
			figure.check.ground(this.size, this.cubeSize) &&
			figure.check.gameField(this.size, this.cubeSize)
		) {
			this.figure.position = figure.position;
		} else {
			if (axis === Axis.Y) {
				this.figure.position = roundVector(this.figure.position);
				this.figureToHeap();
				this.createNewFigure();
			}
		}

		this.setFinalFigure();
	}

	/**
	 * Rotates figure
	 *
	 * @param {Axis} axis Axis-rotation
	 * @param {number} angle Angle of rotation in degrees
	 */
	rotateFigure(axis: Axis, angle: number): void {
		const figure = new Figure(this.figure.position, this.figure.cubes);
		figure.rotate(axis, angle);

		if (
			figure.check.heap(this.heap, this.cubeSize) &&
			figure.check.ground(this.size, this.cubeSize) &&
			figure.check.gameField(this.size, this.cubeSize)
		) {
			this.figure.cubes = figure.cubes;

			this.setFinalFigure();
		}
	}

	/**
	 * Randomly creates new figure
	 */
	createNewFigure(_color?: string): void {
		const color = _color ?? this.colors[randomIntFromInterval(0, this.colors.length - 1)];
		const figure = this.figures[randomIntFromInterval(0, this.figures.length - 1)];

		const newFigure = new Figure(
			[(1 - this.size[0] % 2) / 2, (this.size[1] - this.cubeSize)/2, (1 - this.size[2] % 2) / 2],
			figure.map(position => ({ position, color }))
		);
		newFigure.rotate(Axis.Y, randomIntFromInterval(0, 3)*90);

		if (newFigure.check.heap(this.heap, this.cubeSize)) {
			this.figure = {
				position: newFigure.position,
				cubes: newFigure.cubes
			};

			this.setFinalFigure();
		} else {
			this.gameState = IGameState.Loose;
		}
	}

	/**
	 * Adds cubes from figure to heap
	 */
	figureToHeap(): void {
		this.heap.push(...this.figure.cubes.map(cube => ({
			position: vectorPlusVector(cube.position, this.figure.position),
			color: cube.color
		})))
	}

	deleteLevel(level: number) {
		const heap: ICube[] = [];

		this.heap
			.forEach(heapCube => {
				if (heapCube.position[1] > level) {
					const cube: ICube = {...heapCube, position: [...heapCube.position]};
					cube.position[1] = cube.position[1] - 1;
					heap.push(cube);
				}
				if (heapCube.position[1] < level) heap.push(heapCube);
			});

		this.heap = heap;
	}

	deleteLevels(): void {
		let levelsToDelete: number[] = [];
		for (let y = (this.size[1] - 1) / 2; y >= -(this.size[1] - 1) / 2; y--) {
			if (this.heap.filter(cube => cube.position[1] === y).length === this.size[0] * this.size[2]) {
				levelsToDelete.push(y);
			}
		}

		this.score += this.size[0] * this.size[2] * levelsToDelete.length;
		levelsToDelete.sort((a, b) => a - b);
		levelsToDelete.forEach((level, idx) => {
			this.deleteLevel(level - idx);
		})
		this.setFinalFigure();
	}
}

export default new GameStore();
