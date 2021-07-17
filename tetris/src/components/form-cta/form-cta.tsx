import * as React from "react";
import {observer} from "mobx-react-lite";
import cn from "classnames";
import {useStore} from "../../store/store";

// CSS
import s from "./form-cta.module.scss";
import {Axis} from "../../classes/math";
import {Publisher} from "../../classes/observer";
import useMobX from "../../classes/observer.MobX";

const FormCta: React.FC<{}> = observer(() => {
    const appStore = useStore("appStore");
    const {storeConfig} = useMobX();
    const publisherStore = new Publisher(storeConfig);

    const close = () => {
        appStore.isPopupVisible = false;
        publisherStore.dispatch("startGame")();
    }

    return (
        <div className={cn(s["form-cta"], {[s["form-cta_visible"]]: appStore.isPopupVisible})} onClick={close}>
            <div className={s["form"]} onClick={e => e.stopPropagation()}>
                <div className={s["form__close"]} onClick={close}>&times;</div>
                <header className={s["form__header"]}>Options</header>
                <div className={s.toolbox}>
                    <label>
                        Depth: {publisherStore.get("getState").size[0]}
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={publisherStore.get("getState").size[0]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.X, parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Height: {publisherStore.get("getState").size[1]}
                        <input
                            type="range"
                            min="4"
                            max="20"
                            value={publisherStore.get("getState").size[1]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Y, parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Width: {publisherStore.get("getState").size[2]}
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={publisherStore.get("getState").size[2]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Z, parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Alpha: {publisherStore.get("getState").camera.alpha}
                        <input
                            type="range"
                            min="0"
                            max="180"
                            value={publisherStore.get("getState").camera.alpha}
                            onChange={e => publisherStore.dispatch("setCameraPosition")(
                                parseInt(e.target.value), publisherStore.get("getState").camera.beta
                            )}
                        />
                    </label>
                    <label>
                        Beta: {publisherStore.get("getState").camera.beta}
                        <input
                            type="range"
                            min="0"
                            max="180"
                            value={publisherStore.get("getState").camera.beta}
                            onChange={e => publisherStore.dispatch("setCameraPosition")(
                                publisherStore.get("getState").camera.alpha, parseInt(e.target.value)
                            )}
                        />
                    </label>
                </div>
                <div className={s["form__description"]}>
                    <div className={s["form__line"]}>rotate X:  Q, A</div>
                    <div className={s["form__line"]}>rotate Y:  W, S</div>
                    <div className={s["form__line"]}>rotate Z:  E, D</div>
                    <div className={s["form__line"]}>move:      ←, →, ↑, ↓</div>
                    <div className={s["form__line"]}>speed-up:  space</div>
                </div>
            </div>
        </div>
    )
});

export default FormCta;
