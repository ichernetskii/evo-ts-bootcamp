import * as React from "react";
import {useLayoutEffect} from "react";
import {reaction, toJS} from "mobx";
import {observer} from "mobx-react-lite";
import FormCta from "../form-cta/form-cta";
import {World3d} from "../../classes/world3d";
import {Axis, vectorPlusVector} from "../../classes/math";
import {useStore} from "../../store/store";
import {createPublisher} from "../../classes/observer";
import {IFigure} from "../../classes/figure";
import {ICube} from "../../classes/cube";
import s from  "./app.module.scss";
import {IGameState} from "../../classes/game-state";

const App: React.FC = observer(() => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<World3d | null>(null);
    const gameStore = useStore("gameStore");
    const appStore = useStore("appStore");

    const publisherStore = createPublisher({
        createNewFigure: gameStore.createNewFigure,
        getState: () => gameStore,
        getFigure: () => gameStore.figure,
        getHeap: () => gameStore.heap,
    });

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.focus();
            world3d.current = new World3d(canvasRef.current, gameStore, publisherStore);

            // update figure (store → scene)
            reaction(
                () => toJS(publisherStore.get("getFigure")),
                (figure, prevFigure) => {
                    if (figure.cubes.length !== prevFigure.cubes.length) {
                        world3d.current?.publisher3D.dispatch("rerenderFigure");
                    }
                    figure.cubes.forEach((cubeStore, idx) => {
                        world3d.current?.publisher3D.dispatch(
                            "updateFigure",
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
                        world3d.current?.publisher3D.dispatch("rerenderHeap");
                    }
                    heap.forEach((cubeStore, idx) => {
                        world3d.current?.publisher3D.dispatch(
                            "updateHeap",
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
                    world3d.current?.publisher3D.dispatch("rerenderGround");
                    world3d.current?.publisher3D.dispatch("rerenderGameField");
                }
            )
        }
    }, []);

    return (
        <div className={s.app}>
            <FormCta />
            <div className={s.toolbox}>
                <div>State: {gameStore.gameState}</div>
                <div>Score: {gameStore.score}</div>
                <label>
                    X: <input
                        type="number"
                        min="2"
                        max="20"
                        size={100}
                        value={gameStore.size[0]}
                        onChange={e => gameStore.changeGameFieldSize(Axis.X, parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Y: <input
                    type="number"
                    min="2"
                    max="20"
                    size={100}
                    value={gameStore.size[1]}
                    onChange={e => gameStore.changeGameFieldSize(Axis.Y, parseInt(e.target.value))}
                />
                </label>
                <label>
                    Z: <input
                    type="number"
                    min="2"
                    max="20"
                    size={100}
                    value={gameStore.size[2]}
                    onChange={e => gameStore.changeGameFieldSize(Axis.Z, parseInt(e.target.value))}
                />
                </label>
                <button onClick={gameStore.gameStateToggle}>
                    {gameStore.gameState === IGameState.Playing ? "Stop" : "Play"}
                </button>
                <button onClick={() => {
                    appStore.isPopupVisible = true;
                    gameStore.gameState = IGameState.Paused;
                }}>Help</button>
            </div>
            <canvas ref={canvasRef} tabIndex={0} />
        </div>
    );
});

export default App;
