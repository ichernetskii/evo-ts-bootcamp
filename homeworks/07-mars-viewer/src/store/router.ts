import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum Page {
	Images = "Images",
	Favorites = "Favorites"
}

interface IRouter {
	route: Page
}

const initialState: IRouter = {
	route: Page.Images
}

const routerSlice = createSlice({
	name: "router",
	initialState,
	reducers: {
		route: (state, action: PayloadAction<Page>) => {
			state.route = action.payload;
		}
	}
});

// Actions
export const {route} = routerSlice.actions;

export default routerSlice.reducer;
