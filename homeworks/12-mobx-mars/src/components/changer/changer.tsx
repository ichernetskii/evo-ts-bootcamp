import React from "react";
import {observer} from "mobx-react-lite";
import s from "./changer.module.scss";
import {useStore} from "../../store/store";

const Changer: React.FC = observer(() => {
	const {isLoading, selectImagesBySol: images, selectedSol, change, loadImages} = useStore("sols");

	const changeSolHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value: number = Number.parseInt(e.target.value);
		change(value);
	}

	const loadHandler: React.MouseEventHandler = () => {
		if (!images) {
			loadImages(selectedSol);
		}
	}

	return (
		<div>
			<div className={s.caption}>Select Sol and press "load"!</div>
			<input type="number" min={0} value={selectedSol} onChange={changeSolHandler} />
			<button className={s.button} onClick={loadHandler} disabled={isLoading}>load</button>
		</div>
	)
});

export default Changer;
