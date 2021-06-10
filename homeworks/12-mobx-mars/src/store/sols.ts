import {action, computed, flow, makeAutoObservable} from "mobx";

export interface IImage {
	id: number,
	url: string,
	cameraName: string,
	roverName: string
}

export interface IImages {
	[key: number]: IImage[]
}

interface IResponse {
	photos: Array<{
		id: number,
		img_src: string,
		camera: { full_name: string },
		rover: { name: string }
	}>
}

class Sols {
	selectedSol = 1;
	isLoading = false;
	images: IImages = {};
	favorites: number[] = [];

	constructor() {
		makeAutoObservable(this, {
			selectImagesBySol: computed,
			change: action.bound,
			toggleFavorite: action.bound,
			loadImages: flow.bound
		})
	}

	change(newSelectedSol: number): void {
		this.selectedSol = newSelectedSol;
	}

	toggleFavorite(photoId: number) {
		const index = this.favorites.findIndex(item => item === photoId);
		if (index === -1) {
			this.favorites.push(photoId)
		} else {
			this.favorites.splice(index, 1);
		}
	}

	get selectImagesBySol(): IImage[] {
		return this.images[this.selectedSol];
	}

	*loadImages(sol: number) {
		this.isLoading = true;

		try {
			const response: Response = yield fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=${sol}&api_key=${process.env.REACT_APP_API_KEY}`);
			if (!response.ok) throw new Error("fetch error");
			const json: IResponse = yield response.json();
			this.images[this.selectedSol] = json.photos.map((photo) => ({
				id: photo.id,
				url: photo.img_src,
				cameraName: photo.camera.full_name ?? "",
				roverName: photo.rover.name ?? ""
			}));
		} catch (error) {
			console.error(error);
		} finally {
			this.isLoading = false;
		}
	}
}

export default new Sols();
