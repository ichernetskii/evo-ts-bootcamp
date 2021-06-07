import React from "react";
import {useSelector} from "react-redux";
import {selectImagesBySol, selectIsLoading} from "../../store/store";
import Image from "../image/image";

// styles
import s from "./images.module.scss";

const Images: React.FC = () => {
	const images = useSelector(selectImagesBySol);
	const isLoading = useSelector(selectIsLoading);

	if (isLoading) return <div className={s.text}>Loading...</div>;
	if (!images) return <div className={s.text}>Not loaded</div>;
	if (!images.length) return <div className={s.text}>No photos for this sol :(</div>;
	return <> { images.map(image => <Image {...image} key={image.id} />) } </>
};

export default Images;
