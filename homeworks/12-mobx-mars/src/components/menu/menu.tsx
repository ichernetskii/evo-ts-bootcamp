import React from "react";
import {Page} from "../../store/router";
import s from "./menu.module.scss";
import {useStore} from "../../store/store";
import {observer} from "mobx-react-lite";

export interface IMenuItem {
	label: string,
	target: Page
}

interface IProps {
	items: IMenuItem[]
}

const Menu: React.FC<IProps> = observer(({items}) => {
	const {setRoute} = useStore("router");

	return (
		<div>
			{
				items
					.map<React.ReactNode>(
						item => <span
							className={s["menu-item"]}
							onClick={ () => { setRoute(item.target) } }
							key={item.label}
						>
							{item.label}
						</span>
					)
					.reduce((prev, curr) => [prev, ' | ', curr])
			}
		</div>
	)
});

export default Menu;
