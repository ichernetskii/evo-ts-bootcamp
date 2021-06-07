import React from "react";
import {Store} from "./store";

const StoreContext = React.createContext<Store>({
	gridSize: 5
});

const StoreProvider: React.FC<{ store: Store }> = ({
													   children,
													   store,
												   }) => (
	<StoreContext.Provider value={store}>
		{children}
	</StoreContext.Provider>
)

const useStore = () => React.useContext(StoreContext);

export {StoreProvider, useStore};
