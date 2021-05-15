import React from 'react';
import s from './App.module.scss';
import Router from '../router/router';
import {useSelector} from "react-redux";
import {selectRoute} from "../../store/store";
import Menu, {IMenuItem} from "../menu/menu";
import {Page} from "../../store/router";

function App() {
	const page = useSelector(selectRoute);
	const menuItems: IMenuItem[] = [
		{label: "Photos", target: Page.Images},
		{label: "Favorites", target: Page.Favorites}
	]

    return (
        <div className={s.App}>
			<Menu items={menuItems} />
			<Router page={page} />
        </div>
    );
}

export default App;
