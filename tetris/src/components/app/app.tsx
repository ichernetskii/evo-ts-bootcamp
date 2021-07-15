import * as React from "react";
import {useLayoutEffect} from "react";
import {observer} from "mobx-react-lite";
import FormCta from "../form-cta/form-cta";
import {useStore} from "../../store/store";
import {World3d} from "../../classes/world3d";
import {Axis} from "../../classes/math";
import {Publisher} from "../../classes/observer";
import useMobX from "../../classes/observer.MobX";
import {IGameState} from "../../classes/game-state";
import s from  "./app.module.scss";

const App: React.FC = observer(() => {
    const {storeConfig, init} = useMobX();
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<World3d | null>(null);
    const appStore = useStore("appStore");
    const publisherStore = new Publisher(storeConfig);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.focus();
            world3d.current = new World3d(canvasRef.current, publisherStore);

            init(publisherStore, world3d.current?.publisher3D);
        }
    }, []);

    return (
        <div className={s.app}>
            <FormCta />
            <div className={s.toolbox}>
                <div>State: {publisherStore.get("getState").gameState}</div>
                <div>Score: {publisherStore.get("getState").score}</div>
                <label>
                    X: <input
                        type="number"
                        min="2"
                        max="20"
                        size={100}
                        value={publisherStore.get("getState").size[0]}
                        onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.X, parseInt(e.target.value))}
                    />
                </label>
                <label>
                    Y: <input
                    type="number"
                    min="2"
                    max="20"
                    size={100}
                    value={publisherStore.get("getState").size[1]}
                    onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Y, parseInt(e.target.value))}
                />
                </label>
                <label>
                    Z: <input
                    type="number"
                    min="2"
                    max="20"
                    size={100}
                    value={publisherStore.get("getState").size[2]}
                    onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Z, parseInt(e.target.value))}
                />
                </label>
                <button onClick={publisherStore.get("getState").gameStateToggle}>
                    {publisherStore.get("getState").gameState === IGameState.Playing ? "Stop" : "Play"}
                </button>
                <button onClick={() => {
                    appStore.isPopupVisible = true;
                    publisherStore.get("getState").gameState = IGameState.Paused;
                }}>Help</button>
            </div>
            <canvas ref={canvasRef} tabIndex={0} />
        </div>
    );
});

export default App;
