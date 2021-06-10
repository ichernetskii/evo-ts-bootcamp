import {action, makeAutoObservable} from "mobx";

export enum Page {
	Images = "Images",
	Favorites = "Favorites"
}

class Router {
	route: Page = Page.Images;

	constructor() {
		makeAutoObservable(this, {
			setRoute: action.bound
		});
	}

	setRoute(route: Page) {
		this.route = route;
	}
}

export default new Router();
