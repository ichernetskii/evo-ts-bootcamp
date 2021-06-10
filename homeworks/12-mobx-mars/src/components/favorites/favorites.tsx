import React from "react";
import s from "./favorites.module.scss";
import {IImage} from "../../store/sols";
import Image from "../image/image";
import {useStore} from "../../store/store";
import {observer} from "mobx-react-lite";

const Favorites: React.FC = observer(() => {
	const {images, favorites} = useStore("sols");

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
});

export default Favorites;
