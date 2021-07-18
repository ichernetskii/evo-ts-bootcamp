import {IListeners} from "./listeners";
import BABYLON from "babylonjs";
import {ICamera} from "./camera";

export interface IListeners3D extends IListeners {
    getFigure: () => BABYLON.Mesh[];
    getCamera: () => ICamera,
    rerenderFigure: () => void,
    updateFigure: () => void,
    rerenderFinalFigure: () => void,
    updateFinalFigure: () => void,
    rerenderHeap: () => void,
    updateHeap: () => void,
    rerenderGround: () => void,
    rerenderGameField: () => void,
    updateGameState: () => void
}
