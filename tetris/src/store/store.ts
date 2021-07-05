import {createContext} from "./storeUtils";
import gameStore from "./game-store";
import appStore from "./app-store";

export const {StoreProvider, useStore} = createContext({
	gameStore,
	appStore
});
