import {ICell, IGameField} from "./gameTransforms";

export const $canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
export const $btnNewHouse = document.querySelector<HTMLButtonElement>("#btnNewHouse");
export const $score = document.querySelector<HTMLSpanElement>("#score");
export const context = $canvas?.getContext("2d");
export const $imageWall = new Image();
$imageWall.src = require("./svg/brickwall.svg").default;
export const $imageWindow = new Image();
$imageWindow.src = require("./svg/window.svg").default;
export const $imageRoach = new Image();
$imageRoach.src = require("./svg/roach.svg").default;

$canvas.style.width = "500px";
$canvas.style.height = "500px";
const canvasRect = $canvas.getBoundingClientRect();
const canvasScale = window.devicePixelRatio;
$canvas.width  = canvasRect.width  * canvasScale;
$canvas.height = canvasRect.height * canvasScale;
context?.scale(canvasScale, canvasScale);

export const getItemWidth  = (gameField: IGameField): number => $canvas.getBoundingClientRect().width  / gameField[0].length;
export const getItemHeight = (gameField: IGameField): number => $canvas.getBoundingClientRect().height / gameField.length;

export const renderGameField = (gameField: IGameField) => {
    if ($canvas) {
        const {width, height} = $canvas.getBoundingClientRect();
        const context = $canvas.getContext("2d");
        context?.clearRect(0, 0, width, height);

        const itemWidth  = getItemWidth(gameField);
        const itemHeight = getItemHeight(gameField);

        gameField.forEach((row, rowIdx) => {
            row.forEach((cell, columnIdx) => {
                const $image = (cell === ICell.Wall)
                    ? $imageWall
                    : cell === ICell.Window
                        ? $imageWindow
                        : $imageRoach

                context?.drawImage($image, columnIdx * itemWidth, rowIdx * itemHeight, itemWidth, itemHeight)
            })
        })
    }
}