import * as React from "react";
import {useLayoutEffect} from "react";
import {observer} from "mobx-react-lite";
import {World3d} from "../../assets/world3d";
import {useStore} from "../../store/store";
import {Axis, IGameState} from "../../assets/math";
import s from  "./app.module.scss";
import FormCta from "../form-cta/form-cta";

const App: React.FC = observer(() => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<World3d | null>(null);
    const gameStore = useStore("gameStore");
    const appStore = useStore("appStore");

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.focus();
            world3d.current = new World3d(canvasRef.current, gameStore);
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
