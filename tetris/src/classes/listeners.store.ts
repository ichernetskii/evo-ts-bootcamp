import {IListeners} from "./listeners";
import {Axis, Vector} from "./math";
import {IFigure} from "./figure";
import {ICube} from "./cube";
import {IGameState} from "./game-state";
import {ICamera} from "./camera";

export interface IListenersStore extends IListeners {
    createNewFigure: (_color?: string, _type?: number) => void,
    changeGameFieldSize: (axis: Axis, size: number) => void,
    moveFigure: (axis: Axis, length: number) => void,
    deleteLevels: () => void,
    rotateFigure: (axis: Axis, angle: number) => void,
    gameStateToggle: () => void,
    gameStatePause: () => void,
    gameStatePlay: () => void,
    setDelay: (delay: number) => void,
    getFigure: () => IFigure,
    getFinalFigure: () => IFigure,
    getHeap: () => ICube[],
    getDelay: () => { normal: number, fast: number, current: number },
    getGameState: () => IGameState,
    getNextFigure: () => { type: number, color: string},
    getScore: () => number,
    getGameFieldSize: () => Vector,
    getDeltaY: () => number,
    getCamera: () => ICamera,
    setCamera: (camera: ICamera) => void,
    getCubeSize: () => number,
    getColors: () => string[]
}
