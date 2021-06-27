import {action, makeAutoObservable, observable} from "mobx";
import {
	Axis,
	getMinYFigure,
	ICube,
	IFigure,
	Matrix,
	matrixMultiplyVector,
	Vector,
	vectorPlusVector
} from "../assets/math";

const randomHEXColor = (): string => "#" + Math.floor(Math.random()*16777215).toString(16);

function randomIntFromInterval(min: number, max: number): number { // min and max included
	return Math.floor(Math.random() * (max - min + 1) + min)
}

class GameStore {
	readonly colors: string[] = ["#FF0000", "#00FF00", "#0000FF"];
	readonly figures: Vector[][] = [
		[[-1, 0, 0], [0, 0, 0], [1, 0, 0], [1, 0, 1]],
		[[0, 0, 0]]
	];
	readonly dy = 0.06;

	size = {
		x: 5,
		y: 10,
		z: 5
	}

	figure: IFigure = {
		position: [0, 0, 0],
		cubes: []
	};

	heap: ICube[] = [];

	constructor() {
		makeAutoObservable(this, {
			size: observable,
			figure: observable,
			heap: observable,
			setPositionFigure: action.bound,
			moveFigure: action.bound,
			rotateFigure: action.bound,
			createNewFigure: action.bound,
			figureToHeap: action.bound,
			roundPosition: action.bound,
			checkCollision: action.bound
		});
	}

	setPositionFigure(position: Vector) {
		this.figure.position = position;
	}

	moveFigure(axis: Axis, length: number) {
		this.figure.position[axis] += length;
	}

	/**
	 * Rotates figure
	 *
	 * @param {Axis} axis Axis-rotation
	 * @param {number} angle Angle of rotation in degrees
	 */
	rotateFigure(axis: Axis, angle: number) {
		const sin = Math.sin;
		const cos = Math.cos;
		const a = Math.PI * (angle / 180);
		let rotationMatrix: Matrix;

		switch (axis) {
			case Axis.X:
				rotationMatrix = [[1, 0, 0], [0, cos(a), sin(a)], [0, -sin(a), cos(a)]];
				break;
			case Axis.Y:
				rotationMatrix = [[cos(a), 0, -sin(a)], [0, 1, 0], [sin(a), 0, cos(a)]];
				break;
			case Axis.Z:
				rotationMatrix = [[cos(a), sin(a), 0], [-sin(a), cos(a), 0], [0, 0, 1]];
				break;
		}

		this.figure.cubes.forEach((item, idx) => {
			this.figure.cubes[idx].position = matrixMultiplyVector(rotationMatrix, item.position);
		});
	}

	/**
	 * Randomly creates new figure
	 */
	createNewFigure() {
		const color = this.colors[randomIntFromInterval(0, this.colors.length - 1)];
		const figure = this.figures[randomIntFromInterval(0, this.figures.length - 1)];

		this.figure = {
			position: [0, this.size.y/2 - 0.5, 0],
			cubes: figure.map(position => ({ position, color }))
		};
	}

	/**
	 * Adds cubes from figure to heap
	 */
	figureToHeap() {
		this.heap.push(...this.figure.cubes.map(cube => ({
			position: vectorPlusVector(cube.position, this.figure.position),
			color: cube.color
		})))
	}

	roundPosition() {
		// this.figure.position = this.figure.position.map(n => Math.round(n)) as Vector;
		this.figure.position = [
			Math.round(this.figure.position[0]),
			this.figure.position[1],
			Math.round(this.figure.position[2]),
		]
	}

	checkCollision(): boolean {
		for(const figureCube of this.figure.cubes) {
			for(const heapCube of this.heap) {
				if (
					(this.figure.position[1] + figureCube.position[1] - 1 - this.dy  <= heapCube.position[1]) &&
					(this.figure.position[0] + figureCube.position[0] === heapCube.position[0]) &&
					(this.figure.position[2] + figureCube.position[2] === heapCube.position[2])
				) {
					return true;
				}
			}
		}
		return false;
	}
}

export default new GameStore();
