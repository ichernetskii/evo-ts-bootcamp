import * as React from "react";
import {observer} from "mobx-react-lite";
import cn from "classnames";
import {useStore} from "../../store/store";
import {IGameState} from "../../classes/game-state";

// CSS
import s from "./form-cta.module.scss";

const FormCta: React.FC<{}> = observer(() => {
    const appStore = useStore("appStore");
    const gameStore = useStore("gameStore");

    const close = () => {
        appStore.isPopupVisible = false;
        gameStore.gameState = IGameState.Playing;
    }

    return (
        <div className={cn(s["form-cta"], {[s["form-cta_visible"]]: appStore.isPopupVisible})} onClick={close}>
            <div className={s["form"]} onClick={e => e.stopPropagation()}>
                <div className={s["form__close"]} onClick={close}>&times;</div>
                <header className={s["form__header"]}>Управление</header>
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
