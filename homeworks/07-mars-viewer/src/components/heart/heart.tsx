import React from "react";
import s from "./heart.module.scss";
import cn from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {toggleFavorite} from "../../store/sols";
import {selectFavorites} from "../../store/store";

interface IProps {
	id: number
}

const Heart: React.FC<IProps> = ({id}) => {
	const dispatch = useDispatch();
	const favorites = useSelector(selectFavorites);

	return (
		<svg
			className={s.root}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			onClick={ () => dispatch(toggleFavorite(id)) }
		>
			<path
				className={cn(s.heart, { [s.heart_favorite]: favorites.includes(id) })}
				d="M92.71,7.27L92.71,7.27c-9.71-9.69-25.46-9.69-35.18,0L50,14.79l-7.54-7.52C32.75-2.42,17-2.42,7.29,7.27v0 c-9.71,9.69-9.71,25.41,0,35.1L50,85l42.71-42.63C102.43,32.68,102.43,16.96,92.71,7.27z"
			/>
		</svg>
	)
}

export default Heart;
