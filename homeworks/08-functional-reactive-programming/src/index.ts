import {BehaviorSubject, fromEvent, timer} from "rxjs";
import {map, scan, startWith, switchMap, tap} from "rxjs/operators";

import "./index.scss";
import {
    addRandomRoach,
    addRandomWindows, getItemHeight, getItemWidth,
    getRoachPosition, ICell, IGameField,
    imagesLoaded,
    initializeGameField,
    IRoachPosition, removeRoach
} from "./utils";
import {Add, IAction, Null, stateReducer} from "./state/state";

const $root = document.querySelector<HTMLDivElement>("#root");
const $canvas = document.querySelector<HTMLCanvasElement>("#canvas");
const $btnNewHouse = document.querySelector<HTMLButtonElement>("#btnNewHouse");
const $score = document.querySelector<HTMLSpanElement>("#score");
const context = $canvas?.getContext("2d");
const $imageWall = new Image();
$imageWall.src = require("./svg/brickwall.svg").default;
const $imageWindow = new Image();
$imageWindow.src = require("./svg/window.svg").default;
const $imageRoach = new Image();
$imageRoach.src = require("./svg/roach.svg").default;

imagesLoaded($imageWindow, $imageWall, $imageRoach).then(() => {
    if ($root && $canvas && context && $btnNewHouse && $score) {
        $canvas.style.width = "500px";
        $canvas.style.height = "500px";
        const canvasRect = $canvas.getBoundingClientRect();
        const canvasScale = window.devicePixelRatio;
        $canvas.width  = canvasRect.width  * canvasScale;
        $canvas.height = canvasRect.height * canvasScale;
        context?.scale(canvasScale, canvasScale);
        const {width, height} = $canvas.getBoundingClientRect();

        const actions$ = new BehaviorSubject<IAction>(Add());
        const state$ = actions$
            .pipe(
                startWith(0),
                scan(stateReducer)
            )
            .subscribe((value) => {
                $score.textContent = value.toString();
            })

        const subject = new BehaviorSubject<IRoachPosition>(null);
        const gameField$ = fromEvent($btnNewHouse, "click")
            .pipe(
                startWith(""),
                map(initializeGameField(10, 8)),
                map(initializeGameField(10, 8)),
                map(addRandomWindows(10)),
                map(gameField => addRandomRoach(gameField)()),
                tap(gameField => {
                    actions$.next(Null());
                    subject.next(getRoachPosition(gameField, $canvas))
                }),
                switchMap(
                    (gameField: IGameField) =>
                        timer(0, 2000)
                            .pipe(
                                map(removeRoach(gameField)),
                                map(addRandomRoach(gameField)),
                                tap(gameField => {
                                    subject.next(getRoachPosition(gameField, $canvas))
                                }),
                            )
                )
            );

        gameField$.subscribe({
            next: (gameField: IGameField) => {
                context.clearRect(0, 0, width, height);

                const itemWidth  = getItemWidth(gameField, $canvas);
                const itemHeight = getItemHeight(gameField, $canvas);

                gameField.forEach((row, rowIdx) => {
                    row.forEach((cell, columnIdx) => {
                        const $image = (cell === ICell.Wall)
                            ? $imageWall
                            : cell === ICell.Window
                                ? $imageWindow
                                : $imageRoach

                        context.drawImage($image, columnIdx * itemWidth, rowIdx * itemHeight, itemWidth, itemHeight)
                    })
                })
            }
        })

        const player$ = fromEvent<MouseEvent>($canvas, "click")
            .pipe(
                map(({offsetX, offsetY}) => ({
                    x: offsetX, y: offsetY
                }))
            )
            .subscribe((player) => {
                const roach = subject.getValue();
                if (roach && player.x >= roach.left && player.x <= roach.right && player.y >= roach.top && player.y <= roach.bottom) {
                    actions$.next(Add())
                }
            });
    }
})
