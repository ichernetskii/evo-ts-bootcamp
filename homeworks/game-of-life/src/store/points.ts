import {action, makeAutoObservable, observable} from "mobx";

// coordinate of upper left corner
export interface IPoint {
	x: number,
	y: number
}

const getAllNeighbours = (point: IPoint): IPoint[] => {
	const result: IPoint[] = [];
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			result.push({ x: point.x + i, y: point.y + j });
		}
	}
	return result;
}

const pointsEqual = (point1: IPoint, point2: IPoint): boolean => {
	return point1.x === point2.x && point1.y === point2.y
}

export const pointExistInArray = (array: IPoint[], point: IPoint): boolean => {
	return array.findIndex(item => pointsEqual(item, point)) !== -1;
}

export const floor = (point: IPoint): IPoint => {
	return ({
		x: Math.floor(point.x),
		y: Math.floor(point.y)
	})
}

const getNeighboursCount = (field: IPoint[], point: IPoint): number => {
	let result = 0;
	const allNeighbours = getAllNeighbours(point);
	allNeighbours.forEach(oneNeighbour => {
		if (pointExistInArray(field, oneNeighbour) && !pointsEqual(oneNeighbour, point)) result++;
	})
	return result;
}

class Points {
	data: IPoint[] = [
		{x: 30, y: 20},
		{x: 30, y: 21},
		{x: 31, y: 21},
		{x: 30, y: 22},
		{x: 29, y: 22},
		{x: 5, y: 20},
		{x: 6, y: 20},
		{x: 7, y: 20},
		{x: 7, y: 19},
		{x: 6, y: 18}
	];

	constructor() {
		makeAutoObservable(this, {
			data: observable,
			nextGeneration: action.bound,
			deletePoint: action.bound,
			addPoint: action.bound
		})
	}

	nextGeneration() {
		const result: IPoint[] = [];
		const pointsSet: IPoint[] = [];
		this.data.forEach(point => {
			getAllNeighbours(point).forEach(p => {
				if (!pointExistInArray(pointsSet, p)) {
					pointsSet.push(p);
				}
			});
		})

		pointsSet.forEach(point => {
			if (pointExistInArray(this.data, point)) {
				// alive point
				if ([2, 3].includes(getNeighboursCount(this.data, point))) result.push(point);
			} else {
				// dead point
				if (getNeighboursCount(this.data, point) === 3) result.push(point);
			}
		})

		this.data = result;
	}

	deletePoint(point: IPoint) {
		this.data = this.data.filter(p => !pointsEqual(p, point));
	}

	addPoint(point: IPoint) {
		// this.data.push(point);
		this.data = [...this.data, point];
	}
}

export default new Points();
