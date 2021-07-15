import {reaction, toJS} from "mobx";
import {useStore} from "../store/store";
import {IListeners, Publisher} from "./observer";
import {ICube} from "./cube";
import {vectorPlusVector} from "./math";

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
            getState: () => gameStore,
            getFigure: () => gameStore.figure,
            getHeap: () => gameStore.heap,
        },
        init: (publisherStore: Publisher<IListeners>, publisher3D: Publisher<IListeners>) => {
            reaction(
                () => toJS(publisherStore.get("getFigure")),
                (figure, prevFigure) => {
                    if (figure.cubes.length !== prevFigure.cubes.length) {
                        publisher3D.dispatch("rerenderFigure")();
                    }
                    figure.cubes.forEach((cubeStore: ICube, idx: number) => {
                        publisher3D.dispatch("updateFigure")(
                            idx,
                            vectorPlusVector(figure.position, cubeStore.position),
                            cubeStore.color
                        );
                    });
                }
            );

            // update heap (store → scene)
            reaction(
                () => toJS(publisherStore.get("getHeap")),
                (heap, prevHeap) => {
                    if (heap.length !== prevHeap.length) {
                        publisher3D.dispatch("rerenderHeap")();
                    }
                    heap.forEach((cubeStore: ICube, idx: number) => {
                        publisher3D.dispatch("updateHeap")(
                            idx,
                            cubeStore.position,
                            cubeStore.color
                        );
                    });
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
