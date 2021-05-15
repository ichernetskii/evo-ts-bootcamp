import React, {ReactElement} from "react";
import s from "./favorites.module.scss";
import {useSelector} from "react-redux";
import {selectFavorites, selectImages} from "../../store/store";
import {IImage} from "../../store/sols";
import Image from "../image/image";

const Favorites: React.FC = () => {
	const favorites = useSelector(selectFavorites);
	const images = useSelector(selectImages);

	const result: ReactElement[] = [];

	Object.values(images).forEach((solImages: IImage[]) => {
		solImages.forEach(image => {
			if (favorites.includes(image.id)) result.push(<Image {...image} />)
		})
	})

	return (
		<>
			{
				result.length ? result : <div className={s.caption}>No favorites photos, add some!</div>
			}
		</>
	)
}

export default Favorites;
