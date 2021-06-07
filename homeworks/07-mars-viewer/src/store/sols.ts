import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IImage {
	id: number,
	url: string,
	cameraName: string,
	roverName: string
}

export interface IImages {
	[key: number]: IImage[]
}

interface ISols {
	selectedSol: number,
	isLoading: boolean,
	images: IImages,
	favorite: number[]
}

interface IResponse {
	photos: Array<{
		id: number,
		img_src: string,
		camera: { full_name: string },
		rover: { name: string }
	}>
}

const initialState: ISols = {
	selectedSol: 1,
	isLoading: false,
	images: {},
	favorite: []
}

export const loadImages: any = createAsyncThunk<IImage[], number, {}>(
	"sols/loadImages",
	async (sol) => {
		const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?sol=${sol}&api_key=${process.env.REACT_APP_API_KEY}`);
		const json: IResponse = await response.json();
		return json?.photos.map((photo) => ({
			id: photo.id,
			url: photo.img_src,
			cameraName: photo.camera.full_name ?? "",
			roverName: photo.rover.name ?? ""
		}));
	}
)

const solsSlice = createSlice({
	name: "sols",
	initialState,
	reducers: {
		change: (state: ISols, action: PayloadAction<number>) => {
			state.selectedSol = action.payload;
		},
		toggleFavorite: (state: ISols, action: PayloadAction<number>) => {
			const photoId = action.payload;
			const index = state.favorite.findIndex(item => item === photoId);
			if (index === -1) {
				state.favorite.push(photoId)
			} else {
				state.favorite.splice(index, 1);
			}
		}
	},
	extraReducers: {
		[loadImages.pending]: (state: ISols) => {
			state.isLoading = true;
		},
		[loadImages.fulfilled]: (state: ISols, action: PayloadAction<IImage[]>) => {
			state.isLoading = false;
			state.images[state.selectedSol] = action.payload;
		}
	}
});

// Actions
export const {change, toggleFavorite} = solsSlice.actions;

export default solsSlice.reducer;
