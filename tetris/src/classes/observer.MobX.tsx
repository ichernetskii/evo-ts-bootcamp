import {reaction, toJS} from "mobx";
import {useStore} from "../store/store";
import {IListeners, Publisher} from "./observer";
import {IGameState} from "./game-state";

const useMobX = () => {
    const gameStore = useStore("gameStore");
    return {
        storeConfig: {
            createNewFigure: gameStore.createNewFigure,
            changeGameFieldSize: gameStore.changeGameFieldSize,
            moveFigure: gameStore.moveFigure,
            deleteLevels: gameStore.deleteLevels,
            rotateFigure: gameStore.rotateFigure,
            setDelay: (delay: typeof gameStore.delay.current) => gameStore.delay.current = delay,
            startGame: () => gameStore.gameState = IGameState.Playing,
            getState: () => gameStore,
            getFigure: () => gameStore.figure,
            getFinalFigure: () => gameStore.finalFigure,
            getHeap: () => gameStore.heap,
        },
        init: (publisherStore: Publisher<IListeners>, publisher3D: Publisher<IListeners>) => {
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
                () => toJS(publisherStore.get("getState").size),
                () => {
                    publisher3D.dispatch("rerenderGround")();
                    publisher3D.dispatch("rerenderGameField")();
                }
            )
        }
    }
}

export default useMobX;
