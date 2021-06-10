import {createContext} from "./storeUtils";
import sols from "./sols";
import router from "./router";

export const {StoreProvider, useStore} = createContext({
	sols,
	router
});
