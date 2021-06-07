import styled from "styled-components";
import {useStore} from "../../store/store";

const Canvas = styled.canvas`

`;

const GameField = () => {
	console.log(useStore());
	return <Canvas />
}

export default GameField;
