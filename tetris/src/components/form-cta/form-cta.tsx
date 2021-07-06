import * as React from "react";

// CSS
import s from "./form-cta.module.scss";
import cn from "classnames";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {IGameState} from "../../assets/math";

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
                    <div className={s["form__line"]}>rotate X:  Num+7, Num+4</div>
                    <div className={s["form__line"]}>rotate Y:  Num+8, Num+5</div>
                    <div className={s["form__line"]}>rotate Z:  Num+9, Num+6</div>
                    <div className={s["form__line"]}>move:      ←, →, ↑, ↓</div>
                    <div className={s["form__line"]}>speed-up:  space</div>
                </div>
            </div>
        </div>
    )
});

export default FormCta;
