import {reaction, toJS} from "mobx";
import {useStore} from "../store/store";
import {Publisher} from "./observer";
import {IListeners3D} from "./listeners.3D";
import {IListenersStore} from "./listeners.store";
import {ICamera} from "./camera";

const useMobX = () => {
    const gameStore = useStore("gameStore");
    return {
        storeConfig: {
            createNewFigure: gameStore.createNewFigure,
            changeGameFieldSize: gameStore.changeGameFieldSize,
            moveFigure: gameStore.moveFigure,
            deleteLevels: gameStore.deleteLevels,
            rotateFigure: gameStore.rotateFigure,
            gameStateToggle: gameStore.gameStateToggle,
            gameStatePause: gameStore.gameStatePause,
            gameStatePlay: gameStore.gameStatePlay,
            setDelay: (delay: typeof gameStore.delay.current) => gameStore.delay.current = delay,
            getFigure: () => gameStore.figure,
            getFinalFigure: () => gameStore.finalFigure,
            getHeap: () => gameStore.heap,
            getDelay: () => gameStore.delay,
            getGameState: () => gameStore.gameState,
            getNextFigure: () => gameStore.nextFigure,
            getScore: () => gameStore.score,
            getGameFieldSize: () => gameStore.size,
            getDeltaY: () => gameStore.dy,
            getCamera: () => gameStore.camera,
            setCamera: (camera: ICamera) => gameStore.camera = {...camera},
            getCubeSize: () => gameStore.cubeSize,
            getColors: () => gameStore.colors
        },
        init: (publisherStore: Publisher<IListenersStore>, publisher3D: Publisher<IListeners3D>) => {
            // update figure (store → scene)
            reaction(
                () => toJS(publisherStore.get("getFigure")),
                (figure, prevFigure) => {
                    if (figure.cubes.length !== prevFigure.cubes.length) {
                        publisher3D.dispatch("rerenderFigure")();
                    }
                    publisher3D.dispatch("updateFigure")();
                }
            );

            // update final position of figure (store → scene)
            reaction(
                () => toJS(publisherStore.get("getFinalFigure")),
                (finalFigure, prevFinalFigure) => {
                    if (finalFigure.cubes.length !== prevFinalFigure.cubes.length) {
                        publisher3D.dispatch("rerenderFinalFigure")();
                    }
                    publisher3D.dispatch("updateFinalFigure")();
                }
            );

            // update heap (store → scene)
            reaction(
                () => toJS(publisherStore.get("getHeap")),
                (heap, prevHeap) => {
                    if (heap.length !== prevHeap.length) {
                        publisher3D.dispatch("rerenderHeap")();
                    }
                    publisher3D.dispatch("updateHeap")();
                }
            );

            // update gameField & ground (store → gameField, ground)
            reaction(
                () => toJS(publisherStore.get("getGameFieldSize")),
                () => {
                    publisher3D.dispatch("rerenderGround")();
                    publisher3D.dispatch("rerenderGameField")();
                }
            )

            reaction(
                () => toJS(publisherStore.get("getGameState")),
                () => {
                    publisher3D.dispatch("updateGameState")();
                    publisherStore.dispatch("setCamera")({
                        alpha: publisher3D.get("getCamera").alpha * (180 / Math.PI),
                        beta: publisher3D.get("getCamera").beta  * (180 / Math.PI),
                        radius: publisher3D.get("getCamera").radius
                    });
                }
            )
        }
    }
}

export default useMobX;
