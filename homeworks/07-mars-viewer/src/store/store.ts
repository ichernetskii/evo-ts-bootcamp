import {configureStore, createSelector} from "@reduxjs/toolkit";
import sols, {IImage, IImages} from "./sols";
import {Selector} from "react-redux";
import router, {Page} from "./router";

const store = configureStore({
    reducer: {
		sols,
		router
    }
});

export type IState = ReturnType<typeof store.getState>

// Selectors
export const selectRoute: Selector<IState, Page> = state => state.router.route;
export const selectSelectedSol: Selector<IState, number> = state => state.sols.selectedSol;
export const selectIsLoading: Selector<IState, boolean> = state => state.sols.isLoading;
export const selectImages: Selector<IState, IImages> = state => state.sols.images;
export const selectFavorites: Selector<IState, number[]> = state => state.sols.favorite;
export const selectImagesBySol = createSelector<IState, IImages, number, IImage[]>(
	selectImages,
	selectSelectedSol,
	(images, selectedSol) => images[selectedSol]
);

// Export store
export default store;
