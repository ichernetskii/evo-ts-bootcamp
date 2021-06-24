import {action, autorun, makeAutoObservable, observable} from "mobx";
import {Axis, Figure, Vector} from "../assets/types";

class GameField {
	size = {
		x: 5,
		y: 10,
		z: 5
	}

	figure = {
		position: [0, 0, 0] as Vector,
		data: [-
			[-1, 0, 0],
			[0, 0, 0],
			[1, 0, 0],
			[1, 0, 1]
		] as Vector[]
	};

	ground: Vector[] = []

	constructor() {
		makeAutoObservable(this, {
			figure: observable,
			setPositionFigure: action.bound,
			moveFigure: action.bound,
			rotateFigure: action.bound,
			createNewFigure: action.bound
		})
	}

	setPositionFigure(position: Vector) {
		this.figure.position = position;
	}

	moveFigure(axis: Axis, length: number) {
		this.figure.position[axis] += length;
	}

	rotateFigure(axis: Axis, angle: number) {
		// this.figure.rotate(axis, angle);
	}

	createNewFigure() {

	}
}

export default new GameField();
