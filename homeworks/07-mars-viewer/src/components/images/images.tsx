import React from "react";
import {useSelector} from "react-redux";
import {selectImagesBySol, selectIsLoading} from "../../store/store";
import Image from "../image/image";

// styles
import s from "./images.module.scss";

const Images: React.FC = () => {
	const images = useSelector(selectImagesBySol);
	const isLoading = useSelector(selectIsLoading);

	return (
		<>
			{
				isLoading
					? <div className={s.text}>Loading...</div>
					: images
						? images.length
							? images.map(image =>
								<Image
									{...image}
									key={image.id}
								/>)
							: <div className={s.text}>No fotos for this sol :(</div>
						: <div className={s.text}>Not loaded</div>
			}
		</>
	)
};

export default Images;
