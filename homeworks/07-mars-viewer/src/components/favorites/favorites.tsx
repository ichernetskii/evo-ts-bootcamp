import React from "react";
import s from "./favorites.module.scss";
import {useSelector} from "react-redux";
import {selectFavorites, selectImages} from "../../store/store";
import {IImage} from "../../store/sols";
import Image from "../image/image";

const Favorites: React.FC = () => {
	const favorites = useSelector(selectFavorites);
	const images = useSelector(selectImages);

	const favoriteImages = Object
		.values(images)
		.reduce((acc, solImages) =>
			acc.concat(solImages.filter((image: IImage) => favorites.includes(image.id))), []
		)
		.map((image: IImage) => <Image key={image.id} {...image} />)

	return (
		<>
			{
				favoriteImages.length ? favoriteImages : <div className={s.caption}>No favorites photos, add some!</div>
			}
		</>
	)
}

export default Favorites;
