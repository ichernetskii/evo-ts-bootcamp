import * as React from "react";
import {useLayoutEffect} from "react";
import {observer} from "mobx-react-lite";
import {useSwipeable} from "react-swipeable";
import FormCta from "../form-cta/form-cta";
import {useStore} from "../../store/store";
import {World3d} from "../../classes/world3d";
import {Publisher} from "../../classes/observer";
import useMobX from "../../classes/observer.MobX";
import {IGameState} from "../../classes/game-state";
import {Axis, signThreshold} from "../../classes/math";
import {IListenersStore} from "../../classes/listeners.store";
import cn from "classnames";
import s from  "./app.module.scss";

enum KeyboardKeys {
    Space = 32,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    A = 65,
    D = 68,
    E = 69,
    Q = 81,
    S = 83,
    W = 87
}

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

const App: React.FC = observer(() => {
    const {storeConfig, init} = useMobX();
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<World3d | null>(null);
    const appStore = useStore("appStore");
    const publisherStore = new Publisher<IListenersStore>(storeConfig);
    function getSVGFigure(type: number, color: string) {
        const SVGFigures = [
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="126.203" y="221.863" width="109.25" height="109.25" transform="rotate(-30 126.203 221.863)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="31.5901" y="276.489" width="109.25" height="109.25" transform="rotate(-30 31.5901 276.489)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="166.332" y="72.6251" width="109.25" height="109.25" transform="rotate(-30 166.332 72.6251)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="220.817" y="167.238" width="109.25" height="109.25" transform="rotate(-30 220.817 167.238)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="123.948" y="199.565" width="111.234" height="111.234" transform="rotate(-30 123.948 199.565)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="27.6169" y="255.182" width="111.234" height="111.234" transform="rotate(-30 27.6169 255.182)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="68.3315" y="103.234" width="111.234" height="111.234" transform="rotate(-30 68.3315 103.234)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="220.28" y="143.948" width="111.234" height="111.234" transform="rotate(-30 220.28 143.948)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="95.3066" y="95.3066" width="208.693" height="208.693" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="23.73" y="305.055" width="98.4398" height="98.4398" transform="rotate(-45 23.73 305.055)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="93.3374" y="235.448" width="98.4398" height="98.4398" transform="rotate(-45 93.3374 235.448)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="162.945" y="165.84" width="98.4398" height="98.4398" transform="rotate(-45 162.945 165.84)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="232.552" y="96.2329" width="98.4398" height="98.4398" transform="rotate(-45 232.552 96.2329)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="51.8604" y="253.934" width="105.143" height="105.143" transform="rotate(-20 51.8604 253.934)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="150.662" y="217.974" width="105.143" height="105.143" transform="rotate(-20 150.662 217.974)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="115.228" y="119.162" width="105.143" height="105.143" transform="rotate(-20 115.228 119.162)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="214.096" y="83.2129" width="105.143" height="105.143" transform="rotate(-20 214.096 83.2129)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30.5461" y="209.962" width="151.962" height="151.962" transform="rotate(-30 30.5461 209.962)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="162.149" y="133.981" width="151.962" height="151.962" transform="rotate(-30 162.149 133.981)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>,
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="48.5884" y="268.04" width="135.604" height="135.604" transform="rotate(-30 48.5884 268.04)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="98.3972" y="82.802" width="135.604" height="135.604" transform="rotate(-30 98.3972 82.802)" fill={color} stroke="#FFF" strokeWidth="10"/>
                <rect x="166.025" y="200.238" width="135.604" height="135.604" transform="rotate(-30 166.025 200.238)" fill={color} stroke="#FFF" strokeWidth="10"/>
            </svg>
        ];

        return SVGFigures[type];
    }

    function rotate(axis: Axis) {
        if (publisherStore.get("getGameState") === IGameState.Playing) {
            publisherStore.dispatch("rotateFigure")(axis, 90);
        }
    }
    const nextFigureColor = publisherStore.get("getNextFigure").color;
    const nextFigureType = publisherStore.get("getNextFigure").type;
    const nextFigure = getSVGFigure(nextFigureType, nextFigureColor);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.focus();
            world3d.current = new World3d(canvasRef.current, publisherStore);

            init(publisherStore, world3d.current?.publisher3D);
        }
    }, []);

    const dispatchMoveFigure = (direction: Direction): void => {
        const sin = signThreshold(publisherStore.get("getCamera").alpha, "sin");
        const cos = signThreshold(publisherStore.get("getCamera").alpha, "cos");

        switch (direction) {
            case Direction.Up:
                publisherStore.dispatch("moveFigure")(Axis.X, -cos);
                publisherStore.dispatch("moveFigure")(Axis.Z, sin);
                break;
            case Direction.Down:
                publisherStore.dispatch("moveFigure")(Axis.X, cos);
                publisherStore.dispatch("moveFigure")(Axis.Z, -sin);
                break;
            case Direction.Right:
                publisherStore.dispatch("moveFigure")(Axis.X, sin);
                publisherStore.dispatch("moveFigure")(Axis.Z, cos);
                break;
            case Direction.Left:
                publisherStore.dispatch("moveFigure")(Axis.X, -sin);
                publisherStore.dispatch("moveFigure")(Axis.Z, -cos);
                break;
        }
    }

    const onSwipeHandlers = useSwipeable({
        onSwiped: (eventData) => {
            if (publisherStore.get("getGameState") === IGameState.Playing) {
                switch (eventData.dir) {
                    case Direction.Up:
                        dispatchMoveFigure(Direction.Up);
                        break;
                    case Direction.Down:
                        dispatchMoveFigure(Direction.Down);
                        break;
                    case Direction.Right:
                        dispatchMoveFigure(Direction.Right);
                        break;
                    case Direction.Left:
                        dispatchMoveFigure(Direction.Left);
                        break;
                }
            }
        },
        delta: 30
    });

    const onKeyDownHandler = (e: React.KeyboardEvent): void => {
        if (publisherStore.get("getGameState") === IGameState.Playing) {
            switch (e.keyCode) {
                case KeyboardKeys.Up:
                    dispatchMoveFigure(Direction.Up);
                    break;
                // down
                case KeyboardKeys.Down:
                    dispatchMoveFigure(Direction.Down);
                    break;
                // right
                case KeyboardKeys.Right:
                    dispatchMoveFigure(Direction.Right);
                    break;
                // left
                case KeyboardKeys.Left:
                    dispatchMoveFigure(Direction.Left);
                    break;
                // space
                case KeyboardKeys.Space:
                    publisherStore.dispatch("setDelay")(publisherStore.get("getDelay").fast);
                    break;
                // rotate +X
                case KeyboardKeys.A:
                    publisherStore.dispatch("rotateFigure")(Axis.X, 90);
                    break;
                // rotate +Y
                case KeyboardKeys.S:
                    publisherStore.dispatch("rotateFigure")(Axis.Y, 90);
                    break;
                // rotate +Z
                case KeyboardKeys.D:
                    publisherStore.dispatch("rotateFigure")(Axis.Z, 90);
                    break;
            }
        }
    }

    const onKeyUpHandler = (e: React.KeyboardEvent) => {
        if (publisherStore.get("getGameState") === IGameState.Playing) {
            switch (e.keyCode) {
                case KeyboardKeys.Space:
                    publisherStore.dispatch("setDelay")(publisherStore.get("getDelay").normal);
                    break;
            }
        }
    }

    const onTouchStartHandler = (e: React.TouchEvent) => {
        if (e.touches.length >= 2) {
            publisherStore.dispatch("setDelay")(publisherStore.get("getDelay").fast);
        }
    }

    const onTouchEndHandler = () => {
        publisherStore.dispatch("setDelay")(publisherStore.get("getDelay").normal);
    }

    const onOptionsClick = () => {
        appStore.popupVisibleToggle();
        publisherStore.dispatch("gameStatePause")();
    }

    return (
        <div
            className={s.app}
            {...onSwipeHandlers}
            onKeyDown={onKeyDownHandler}
            onKeyUp={onKeyUpHandler}
            onTouchStart={onTouchStartHandler}
            onTouchEnd={onTouchEndHandler}
            tabIndex={-1}
        >
            <FormCta />
            <div className={s.toolbox}>
                <div className={s.toolbox__block}>
                    <div
                        className={cn(
                            s.btnPlay,
                            {[s.btnPlay_paused]: publisherStore.get("getGameState") !== IGameState.Playing}
                        )}
                        onClick={publisherStore.dispatch("gameStateToggle")}
                    >
                        <div className={s.btnPlay__left} />
                        <div className={s.btnPlay__right} />
                        <div className={s.btnPlay__triangle1} />
                        <div className={s.btnPlay__triangle2} />
                    </div>
                    <div className={s.toolbox__info}>
                        <div className={s.toolbox__score} dangerouslySetInnerHTML={{
                            __html: publisherStore.get("getGameState") === IGameState.Loose
                                ? "Loose"
                                : "Score:&nbsp;" + publisherStore.get("getScore")
                        }} />
                        <div className={s.toolbox__figure}>
                            {nextFigure}
                        </div>
                    </div>
                    <div
                        className={s.toolbox__settings}
                        onClick={onOptionsClick}
                    >
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_i)">
                                <path d="M118.762 200H81.2446C78.8939 200 76.6137 199.221 74.7821 197.792C72.9506 196.362 71.6777 194.368 71.1747 192.14L66.9798 173.3C61.3837 170.921 56.0775 167.946 51.1586 164.43L32.2248 170.28C29.9837 170.973 27.5656 170.902 25.372 170.078C23.1783 169.254 21.3412 167.727 20.1657 165.75L1.36589 134.24C0.2027 132.261 -0.233931 129.958 0.127429 127.708C0.488788 125.457 1.62674 123.392 3.35512 121.85L18.0425 108.85C17.3746 102.961 17.3746 97.0189 18.0425 91.13L3.35512 78.16C1.62429 76.6177 0.484793 74.5507 0.123374 72.2978C-0.238044 70.0449 0.200061 67.7397 1.36589 65.76L20.1245 34.23C21.3 32.2532 23.1371 30.7259 25.3307 29.9019C27.5243 29.0778 29.9425 29.0066 32.1836 29.7L51.1174 35.55C53.6323 33.75 56.2503 32.07 58.9507 30.55C61.5583 29.13 64.2381 27.84 66.9798 26.69L71.185 7.87C71.6856 5.64198 72.9561 3.64688 74.7857 2.21549C76.6153 0.784098 78.8942 0.00239966 81.2446 0H118.762C121.112 0.00239966 123.391 0.784098 125.221 2.21549C127.05 3.64688 128.321 5.64198 128.821 7.87L133.068 26.7C135.954 27.94 138.778 29.33 141.509 30.88C144.055 32.31 146.518 33.88 148.889 35.57L167.833 29.72C170.073 29.0292 172.489 29.1017 174.68 29.9256C176.871 30.7495 178.707 32.2753 179.882 34.25L198.64 65.78C201.032 69.85 200.207 75 196.651 78.17L181.964 91.17C182.632 97.0589 182.632 103.001 181.964 108.89L196.651 121.89C200.207 125.07 201.032 130.21 198.64 134.28L179.882 165.81C178.706 167.787 176.869 169.314 174.676 170.138C172.482 170.962 170.064 171.033 167.823 170.34L148.889 164.49C143.974 168.003 138.671 170.975 133.078 173.35L128.821 192.14C128.319 194.366 127.047 196.359 125.218 197.788C123.388 199.218 121.111 199.998 118.762 200V200ZM99.9619 60C89.0277 60 78.5412 64.2143 70.8095 71.7157C63.0779 79.2172 58.7342 89.3913 58.7342 100C58.7342 110.609 63.0779 120.783 70.8095 128.284C78.5412 135.786 89.0277 140 99.9619 140C110.896 140 121.383 135.786 129.114 128.284C136.846 120.783 141.19 110.609 141.19 100C141.19 89.3913 136.846 79.2172 129.114 71.7157C121.383 64.2143 110.896 60 99.9619 60V60Z" fill="white"/>
                            </g>
                            <defs>
                                <filter id="filter0_i" x="-1" y="-1" width="201" height="201" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dx="-1" dy="-1"/>
                                    <feGaussianBlur stdDeviation="2.5"/>
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.6375 0 0 0 0 0.294313 0 0 0 0 0.185938 0 0 0 0.67 0"/>
                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                                </filter>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} tabIndex={0} />
            <div className={s.buttons}>
                <button className={cn(s.button, s.button_x)} onClick={() => rotate(Axis.X)}>
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M35.6085 86C30.9925 80.5013 28.2154 73.4264 28.2154 65.7073C28.2154 48.1958 42.5078 34 60.1385 34C77.7691 34 92.0615 48.1958 92.0615 65.7073C92.0615 73.4264 89.2844 80.5013 84.6684 86M35.6085 86L44.3897 71.2033M35.6085 86L18 81.7724M84.6684 86L78.0154 71.2033M84.6684 86L101 81.7724"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button className={cn(s.button, s.button_y)} onClick={() => rotate(Axis.Y)}>
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M83.436 54.4629L99.145 50.2093L108.06 65.6498"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M36.4408 54.4629L20.7318 50.2093L11.8167 65.6498"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M98.5117 52.5C98.5117 59.4036 83.1003 77 61.7648 77C40.4293 77 21.7201 59.4036 21.7201 52.5"
                            stroke="white"
                            strokeWidth="8"
                        />
                    </svg>
                </button>
                <button className={cn(s.button, s.button_z)} onClick={() => rotate(Axis.Z)}>
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M66.5371 83.436L70.7907 99.1449L55.3502 108.06"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M66.5371 36.4407L70.7907 20.7318L55.3502 11.8167"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M68.5 98.5117C61.5964 98.5117 44 83.1003 44 61.7648C44 40.4293 61.5964 21.7201 68.5 21.7201"
                            stroke="white"
                            strokeWidth="8"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
});

export default App;
