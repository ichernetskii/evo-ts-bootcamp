import React from "react";
import {Page} from "../../store/router"
import Changer from "../changer/changer";
import Images from "../images/images";
import Favorites from "../favorites/favorites";
import s from "./router.module.scss";
import {observer} from "mobx-react-lite";

interface IProps {
	page: Page
}

function assertNever(arg: never): never {
	throw new Error("Unexpected argument");
}

const Router: React.FC<IProps> = observer(({page}) => {
	switch (page) {
		case Page.Images:
			return (
				<>
					<Changer />
					<div className={s.root}>
						<Images />
					</div>
				</>
				)
		case Page.Favorites:
			return (
				<div className={s.root}>
					<Favorites />
				</div>
				)
		default: assertNever(page);
	}
});

export default Router;
