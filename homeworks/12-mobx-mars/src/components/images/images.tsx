import React from "react";
import {useStore} from "../../store/store";
import Image from "../image/image";
import s from "./images.module.scss";
import {observer} from "mobx-react-lite";

const Images: React.FC = observer(() => {
	const {selectImagesBySol: images, isLoading} = useStore("sols");

	if (isLoading) return <div className={s.text}>Loading...</div>;
	if (!images) return <div className={s.text}>Not loaded</div>;
	if (!images.length) return <div className={s.text}>No photos for this sol :(</div>;
	return <> { images.map(image => <Image {...image} key={image.id} />) } </>
});

export default Images;
