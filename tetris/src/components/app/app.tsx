import * as React from "react";
import {useLayoutEffect} from "react";
import {observer} from "mobx-react-lite";
import FormCta from "../form-cta/form-cta";
import {useStore} from "../../store/store";
import {World3d} from "../../classes/world3d";
import {Publisher} from "../../classes/observer";
import useMobX from "../../classes/observer.MobX";
import {IGameState} from "../../classes/game-state";
import {Axis} from "../../classes/math";
import {useSwipeable} from "react-swipeable";
import {colors} from "../../store/figures";
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

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            enum Directions {
                Up = "Up",
                Down = "Down",
                Left = "Left",
                Right = "Right"
            }

            switch (eventData.dir) {
                case Directions.Up:
                    publisherStore.dispatch("moveFigure")(Axis.X, -1);
                    break;
                case Directions.Down:
                    publisherStore.dispatch("moveFigure")(Axis.X, 1);
                    break;
                case Directions.Left:
                    publisherStore.dispatch("moveFigure")(Axis.Z, -1);
                    break;
                case Directions.Right:
                    publisherStore.dispatch("moveFigure")(Axis.Z, 1);
                    break;
            }
        },
        delta: 30
    });

    function rotate(axis: Axis) {
        if (publisherStore.get("getState").gameState === IGameState.Playing) {
            publisherStore.dispatch("rotateFigure")(axis, 90);
        }
    }
    const nextFigureColor = colors[publisherStore.get("getState").nextFigure.color];
    const nextFigure = <svg viewBox="0 0 372 272" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7.61523" y="187.029" width="90" height="90" transform="rotate(-30 7.61523 187.029)" stroke={nextFigureColor} strokeWidth="10"/>
        <rect x="85.5576" y="142.029" width="90" height="90" transform="rotate(-30 85.5576 142.029)" stroke={nextFigureColor} strokeWidth="10"/>
        <rect x="163.5" y="97.0289" width="90" height="90" transform="rotate(-30 163.5 97.0289)" stroke={nextFigureColor} strokeWidth="10"/>
        <rect x="241.442" y="52.0289" width="90" height="90" transform="rotate(-30 241.442 52.0289)" stroke={nextFigureColor} strokeWidth="10"/>
    </svg>

    return (
        <div className={s.app} {...handlers}>
            <FormCta />
            <div className={s.toolbox}>
                <div className={s.toolbox__block}>
                    <button onClick={publisherStore.get("getState").gameStateToggle}>
                        {publisherStore.get("getState").gameState === IGameState.Playing ? "Stop" : "Play"}
                    </button>
                    <div>
                        {
                            publisherStore.get("getState").gameState === IGameState.Loose
                                ? "Loose"
                                : "Score: " + 100 * publisherStore.get("getState").score
                        }
                        <div style={{ color: colors[publisherStore.get("getState").nextFigure.color] }}>
                            {nextFigure}
                        </div>
                    </div>
                    <button onClick={() => {
                        appStore.isPopupVisible = true;
                        publisherStore.get("getState").gameState = IGameState.Paused;
                    }}>Options</button>
                </div>
            </div>
            <canvas ref={canvasRef} tabIndex={0} />
            <div className={s.buttons}>
                <button  onClick={() => rotate(Axis.X)}>
                    <svg viewBox="0 0 508 354" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M344.088 340.176C345.191 348.387 352.741 354.149 360.952 353.046L494.75 335.075C502.961 333.972 508.723 326.422 507.62 318.212C506.517 310.001 498.967 304.239 490.756 305.342L371.824 321.316L355.85 202.384C354.747 194.174 347.197 188.412 338.987 189.514C330.776 190.617 325.014 198.167 326.117 206.378L344.088 340.176ZM424.408 138.664L438.681 134.051L438.681 134.051L424.408 138.664ZM359.739 49.6922L368.533 37.5403L368.533 37.5403L359.739 49.6922ZM254.802 15.9258L254.762 0.925824L254.762 0.925824L254.802 15.9258ZM149.68 50.262L140.866 38.1249L149.68 50.262ZM84.5263 139.585L98.7789 144.261L98.7789 144.261L84.5263 139.585ZM84.2266 249.778L98.4997 245.165L98.4997 245.165L84.2266 249.778ZM146.856 353.61C155.064 354.736 162.63 348.996 163.757 340.789L182.114 207.043C183.24 198.836 177.5 191.269 169.293 190.142C161.086 189.016 153.519 194.756 152.393 202.963L136.075 321.849L17.1896 305.531C8.98226 304.405 1.41571 310.145 0.28921 318.352C-0.837287 326.559 4.90286 334.126 13.1102 335.253L146.856 353.61ZM370.879 347.28C374.572 342.44 379.553 336.844 385.582 330.183C391.465 323.684 398.21 316.317 404.8 308.49C417.841 293.005 431.552 274.287 438.361 253.532L409.856 244.18C404.907 259.265 394.314 274.37 381.853 289.166C375.693 296.481 369.389 303.369 363.341 310.051C357.439 316.57 351.61 323.079 347.031 329.079L370.879 347.28ZM438.361 253.532C451.106 214.685 451.224 172.859 438.681 134.051L410.135 143.277C420.719 176.024 420.628 211.345 409.856 244.18L438.361 253.532ZM438.681 134.051C426.138 95.241 401.581 61.4559 368.533 37.5403L350.945 61.8441C378.833 82.0257 399.552 110.531 410.135 143.277L438.681 134.051ZM368.533 37.5403C335.486 13.6255 295.657 0.814898 254.762 0.925824L254.843 30.9257C289.417 30.8319 323.056 41.6617 350.945 61.8441L368.533 37.5403ZM254.762 0.925824C213.868 1.03675 174 14.0617 140.866 38.1249L158.495 62.399C186.537 42.0338 220.267 31.0195 254.843 30.9257L254.762 0.925824ZM140.866 38.1249C107.732 62.1882 83.0173 96.0646 70.2736 134.91L98.7789 144.261C109.551 111.424 130.452 82.7642 158.495 62.399L140.866 38.1249ZM70.2736 134.91C57.5295 173.756 57.4107 215.582 69.9536 254.391L98.4997 245.165C87.9159 212.418 88.0069 177.097 98.7789 144.261L70.2736 134.91ZM69.9536 254.391C76.6522 275.117 89.7635 293.106 102.529 308.253C108.947 315.868 115.608 323.136 121.513 329.69C127.55 336.389 132.775 342.317 136.946 347.815L160.846 329.683C155.819 323.056 149.806 316.273 143.8 309.607C137.662 302.795 131.473 296.045 125.469 288.92C113.39 274.588 103.364 260.217 98.4997 245.165L69.9536 254.391Z" fill="black"/>
                    </svg>
                </button>
                <button onClick={() => rotate(Axis.Y)}>
                    <svg viewBox="0 0 499 177" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M487.509 26.2321C486.852 17.9739 479.625 11.8118 471.367 12.4685L336.792 23.1716C328.534 23.8283 322.372 31.0554 323.028 39.3136C323.685 47.5718 330.912 53.7339 339.17 53.0771L458.793 43.5633L468.306 163.186C468.963 171.444 476.19 177.606 484.448 176.949C492.707 176.292 498.869 169.065 498.212 160.807L487.509 26.2321ZM382.588 109.928L389.202 123.39L389.862 123.067L390.486 122.68L382.588 109.928ZM246.597 147.444L246.597 162.444L246.597 147.444ZM113.606 102.691L105.262 115.156L105.262 115.156L113.606 102.691ZM33.372 0.666311C25.1486 -0.336535 17.6693 5.51684 16.6665 13.7402L0.324145 147.747C-0.678701 155.971 5.17467 163.45 13.398 164.453C21.6214 165.456 29.1007 159.602 30.1035 151.379L44.63 32.2615L163.748 46.788C171.971 47.7909 179.45 41.9375 180.453 33.7141C181.456 25.4908 175.603 18.0115 167.379 17.0086L33.372 0.666311ZM461.142 17.689C426.18 58.6928 403.336 79.4323 374.689 97.1757L390.486 122.68C422.776 102.68 447.932 79.4192 483.97 37.1536L461.142 17.689ZM375.973 96.465C336.008 116.101 298.469 132.444 246.597 132.444L246.597 162.444C305.644 162.444 348.342 143.467 389.202 123.39L375.973 96.465ZM246.597 132.444C192.274 132.444 157.613 114.097 121.95 90.2254L105.262 115.156C143.222 140.565 183.796 162.444 246.597 162.444L246.597 132.444ZM121.95 90.2254C86.9399 66.791 62.2722 30.4658 43.3687 6.31137L19.7436 24.8006C36.8401 46.6462 65.1724 88.321 105.262 115.156L121.95 90.2254Z" fill="black"/>
                    </svg>
                </button>
                <button onClick={() => rotate(Axis.Z)}>
                    <svg viewBox="0 0 178 499" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M151.324 487.953C159.582 487.296 165.744 480.069 165.088 471.811L154.385 337.236C153.728 328.978 146.501 322.815 138.243 323.472C129.984 324.129 123.822 331.356 124.479 339.614L133.993 459.236L14.3706 468.75C6.11241 469.407 -0.0497494 476.634 0.607041 484.892C1.26383 493.15 8.49085 499.313 16.749 498.656L151.324 487.953ZM67.6285 383.032L54.1658 389.646L54.4897 390.306L54.8764 390.93L67.6285 383.032ZM30.1122 247.041L15.1122 247.041L30.1122 247.041ZM74.8656 114.05L62.4004 105.706L62.4004 105.706L74.8656 114.05ZM176.89 33.8158C177.893 25.5925 172.039 18.1132 163.816 17.1103L29.8088 0.767992C21.5855 -0.234854 14.1062 5.61852 13.1033 13.8419C12.1005 22.0652 17.9539 29.5445 26.1772 30.5474L145.295 45.0739L130.768 164.191C129.765 172.415 135.619 179.894 143.842 180.897C152.065 181.9 159.545 176.046 160.548 167.823L176.89 33.8158ZM159.867 461.586C118.863 426.624 98.1239 403.78 80.3805 375.133L54.8764 390.93C74.8765 423.22 98.1371 448.376 140.403 484.414L159.867 461.586ZM81.0912 376.417C61.4549 336.452 45.1121 298.913 45.1122 247.041L15.1122 247.041C15.1121 306.087 34.0892 348.785 54.1658 389.646L81.0912 376.417ZM45.1122 247.041C45.1122 192.717 63.4589 158.057 87.3308 122.394L62.4004 105.706C36.9915 143.666 15.1122 184.24 15.1122 247.041L45.1122 247.041ZM87.3308 122.394C110.765 87.3837 147.09 62.7161 171.245 43.8126L152.756 20.1874C130.91 37.2839 89.2352 65.6163 62.4004 105.706L87.3308 122.394Z" fill="black"/>
                    </svg>
                </button>
            </div>
        </div>
    );
});

export default App;
