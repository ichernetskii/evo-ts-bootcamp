import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {change, loadImages} from "../../store/sols";
import {selectImagesBySol, selectSelectedSol} from "../../store/store";
import s from "./changer.module.scss";

const Changer: React.FC = () => {
	const dispatch = useDispatch();
	const getSelectedSolSelector = useSelector(selectSelectedSol);
	const getImagesBySolSelector = useSelector(selectImagesBySol);

	const changeSolHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value: number = Number.parseInt(e.target.value);
		dispatch(change(value));
	}

	const loadHandler: React.MouseEventHandler = () => {
		if (!getImagesBySolSelector) {
			dispatch(loadImages(getSelectedSolSelector));
		}
	}

	return (
		<div>
			<div className={s.caption}>Select Sol and press "load"!</div>
			<input type="number" min={0} value={getSelectedSolSelector} onChange={changeSolHandler} />
			<button className={s.button} onClick={loadHandler}>load</button>
		</div>
	)
};

export default Changer;
