import {action, autorun, makeAutoObservable, observable} from "mobx";
import {Axis, Figure, IFigure, Vector, vectorsAdd} from "../assets/types";



class GameField {
	size = {
		x: 5,
		y: 10,
		z: 5
	}

	figure: IFigure = {
		position: [0, 0, 0],
		data: []
	};

	ground: Vector[] = []

	constructor() {
		makeAutoObservable(this, {
			figure: observable,
			setPositionFigure: action.bound,
			moveFigure: action.bound,
			rotateFigure: action.bound,
			createNewFigure: action.bound,
			figureToGround: action.bound
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
		this.figure.data = [
			[-1, 0, 0],
			[0, 0, 0],
			[1, 0, 0],
			[1, 0, 1]
		];
	}

	figureToGround() {
		for (const cube of this.figure.data) {
			this.ground.push(vectorsAdd(cube, this.figure.position));
		}
	}
}

export default new GameField();
