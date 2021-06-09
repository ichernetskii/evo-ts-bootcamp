import {action, makeAutoObservable} from "mobx";

export interface IPosition {
	x: number,
	y: number
}

class Config {
	centerPosition: IPosition = { x: 0, y: 0 }; // screen coords
	grid: number = 15; // px
	delay: number = 50; // ms
	paused: boolean = false;
	mouseDown: IPosition | null = null;

	constructor() {
		makeAutoObservable(this, {
			togglePaused: action.bound,
			setMouseDown: action.bound,
			setCenterPosition: action.bound,
			zoomGrid: action.bound,
			setDelay: action.bound,
		})
	}

	togglePaused() {
		this.paused = !this.paused;
	}

	setMouseDown(position: IPosition | null) {
		this.mouseDown = position;
	}

	setCenterPosition(position: IPosition) {
		this.centerPosition = position;
	}

	zoomGrid(zoom: number) {
		this.grid *= zoom;
	}

	setDelay(delay: number) {
		this.delay = delay;
	}
}

export default new Config();
