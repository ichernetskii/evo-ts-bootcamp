import React from 'react';
import GameField from "../game-field/game-field";
import styled from "styled-components";
import {StoreProvider} from "../../store/storeUtils";

const MainWrapper = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
`;

const Toolbar = styled.nav`
	background: #CCC;
	flex: 0 0 300px;
`

function App() {
  return (
  	<StoreProvider store={store}>
		<MainWrapper>
			<GameField />
			<Toolbar>
			</Toolbar>
		</MainWrapper>
	</StoreProvider>
  );
}

export default App;
