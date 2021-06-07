import {makeAutoObservable} from "mobx";

export class Store {
	gridSize?: number = 5;

	constructor() {
		makeAutoObservable(this);
	}
}

export default new Store();
