import React from "react";
import s from "./favorites.module.scss";
import {IImage} from "../../store/sols";
import Image from "../image/image";
import {useStore} from "../../store/store";
import {observer} from "mobx-react-lite";

const Favorites: React.FC = observer(() => {
	const {getFavoriteImages} = useStore("sols");

	const favoriteImages = getFavoriteImages.map((image: IImage) => <Image key={image.id} {...image} />)

	return (
		<>
			{
				favoriteImages.length ? favoriteImages : <div className={s.caption}>No favorites photos, add some!</div>
			}
		</>
	)
});

export default Favorites;
