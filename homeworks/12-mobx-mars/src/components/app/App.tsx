import React from 'react';
import {observer} from "mobx-react-lite";
import Router from '../router/router';
import Menu, {IMenuItem} from "../menu/menu";
import {Page} from "../../store/router";
import s from './App.module.scss';
import {useStore} from "../../store/store";

const App = observer(() => {
	const {route} = useStore("router");

	const menuItems: IMenuItem[] = [
		{label: "Photos", target: Page.Images},
		{label: "Favorites", target: Page.Favorites}
	]

    return (
        <div className={s.App}>
			<Menu items={menuItems} />
			<Router page={route} />
        </div>
    );
});

export default App;
