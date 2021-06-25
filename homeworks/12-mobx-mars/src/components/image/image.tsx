import React from "react";
import s from "./image.module.scss";
import Heart from "../heart/heart";
import {IImage} from "../../store/sols";
import {observer} from "mobx-react-lite";

const Image: React.FC<IImage> = observer(({id, url, cameraName, roverName}) => (
	<div className={s.root}>
		<img
			className={s.img}
			src={url}
			alt={url}
		/>
		<div className={s.caption}>{`Rover: ${roverName}, Camera: ${cameraName}`}</div>
		<Heart id={id} />
	</div>
));

export default Image;
