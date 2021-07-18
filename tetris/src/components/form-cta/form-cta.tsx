import * as React from "react";
import {observer} from "mobx-react-lite";
import cn from "classnames";
import {useStore} from "../../store/store";

// CSS
import s from "./form-cta.module.scss";
import {Axis} from "../../classes/math";
import {Publisher} from "../../classes/observer";
import useMobX from "../../classes/observer.MobX";
import {mobileAndTabletCheck} from "../../assets/utils";
import {IListenersStore} from "../../classes/listeners.store";

const FormCta: React.FC<{}> = observer(() => {
    const appStore = useStore("appStore");
    const {storeConfig} = useMobX();
    const publisherStore = new Publisher<IListenersStore>(storeConfig);

    const close = () => {
        publisherStore.dispatch("gameStatePlay")();
        appStore.popupVisibleToggle();
    }

    const isMobile = mobileAndTabletCheck();

    return (
        <div className={cn(s["form-cta"], {[s["form-cta_visible"]]: appStore.isPopupVisible})} onClick={close}>
            <div className={s["form"]} onClick={e => e.stopPropagation()}>
                <div className={s["form__close"]} onClick={close}>&times;</div>
                <header className={s["form__header"]}>Options</header>
                <div className={s.toolbox}>
                    <label>
                        Depth: {publisherStore.get("getGameFieldSize")[0]}
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={publisherStore.get("getGameFieldSize")[0]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.X, parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Height: {publisherStore.get("getGameFieldSize")[1]}
                        <input
                            type="range"
                            min="4"
                            max="20"
                            value={publisherStore.get("getGameFieldSize")[1]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Y, parseInt(e.target.value))}
                        />
                    </label>
                    <label>
                        Width: {publisherStore.get("getGameFieldSize")[2]}
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={publisherStore.get("getGameFieldSize")[2]}
                            onChange={e => publisherStore.dispatch("changeGameFieldSize")(Axis.Z, parseInt(e.target.value))}
                        />
                    </label>
                </div>
                <div className={s["form__description"]}>
                    <div className={s["form__line"]}>figure rotation:  {isMobile ? "buttons" : "A, S, D"}</div>
                    <div className={s["form__line"]}>scene rotation: pause + {isMobile ? "swipe" : "mouse move"}</div>
                    <div className={s["form__line"]}>figure move: {isMobile ? "swipe" : "←, →, ↑, ↓"}</div>
                    <div className={s["form__line"]}>speed-up: {isMobile ? "two-fingers tap" : "space"}</div>
                </div>
            </div>
        </div>
    )
});

export default FormCta;
