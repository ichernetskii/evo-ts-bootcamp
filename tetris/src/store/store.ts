import {createContext} from "./storeUtils";
import gameField from "./game-field";

export const {StoreProvider, useStore} = createContext({
	gameField
});
