import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {change, loadImages} from "../../store/sols";
import {selectImagesBySol, selectIsLoading, selectSelectedSol} from "../../store/store";
import s from "./changer.module.scss";

const Changer: React.FC = () => {
	const dispatch = useDispatch();
	const selectedSol = useSelector(selectSelectedSol);
	const isLoading = useSelector(selectIsLoading);
	const images = useSelector(selectImagesBySol);

	const changeSolHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value: number = Number.parseInt(e.target.value);
		dispatch(change(value));
	}

	const loadHandler: React.MouseEventHandler = () => {
		if (!images) {
			dispatch(loadImages(selectedSol));
		}
	}

	return (
		<div>
			<div className={s.caption}>Select Sol and press "load"!</div>
			<input type="number" min={0} value={selectedSol} onChange={changeSolHandler} />
			<button className={s.button} onClick={loadHandler} disabled={isLoading}>load</button>
		</div>
	)
};

export default Changer;
