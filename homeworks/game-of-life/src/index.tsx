import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/app/app';
import { StoreProvider } from './store/store';

ReactDOM.render(
	<StoreProvider>
		<App />
	</StoreProvider>,
	document.getElementById('root')
);
