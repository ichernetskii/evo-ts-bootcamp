import {createContext} from "./storeUtils";
import config from "./config";
import points from "./points";

export const {StoreProvider, useStore} = createContext({
	config,
	points
})
