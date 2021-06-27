import {createContext} from "./storeUtils";
import gameStore from "./game-store";

export const {StoreProvider, useStore} = createContext({
	gameStore
});
