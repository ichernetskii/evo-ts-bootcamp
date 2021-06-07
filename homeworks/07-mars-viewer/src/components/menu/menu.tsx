import React from "react";
import {Page, route} from "../../store/router";
import {useDispatch} from "react-redux";
import s from "./menu.module.scss";

export interface IMenuItem {
	label: string,
	target: Page
}

interface IProps {
	items: IMenuItem[]
}

const Menu: React.FC<IProps> = ({items}) => {
	const dispatch = useDispatch();

	return (
		<div>
			{
				items
					.map<React.ReactNode>(
						item => <span
							className={s["menu-item"]}
							onClick={ () => { dispatch(route(item.target)) } }
							key={item.label}
						>
							{item.label}
						</span>
					)
					.reduce((prev, curr) => [prev, ' | ', curr])
			}
		</div>
	)
}

export default Menu;
