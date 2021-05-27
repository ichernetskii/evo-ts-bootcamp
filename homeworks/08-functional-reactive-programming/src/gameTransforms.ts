import {randomIntFromInterval} from "./utils";
import {getItemHeight, getItemWidth} from "./render";

export enum ICell {
    Wall = "Wall",
    Window = "Window",
    Roach = "Roach"
}
export type IGameField = ICell[][];
export type IRoachPosition = DOMRect | null;
export type IPlayerPosition = {
    x: number,
    y: number
}

const copyGameField = (gameField: IGameField): IGameField => {
    return gameField.reduce<IGameField>((acc: IGameField, row: ICell[]) => [...acc, [...row]], [])
}

export const isShootSuccessful = (player: IPlayerPosition, roach: IRoachPosition) =>
    roach && player.x >= roach.left && player.x <= roach.right && player.y >= roach.top && player.y <= roach.bottom;

export const initializeGameField = (width: number, height: number) => (): IGameField => {
    const row: ICell[] = Array
        .from<ICell>({length: width})
        .fill(ICell.Wall);

    return Array
        .from<ICell[]>({length: height})
        .map(() => [...row]);
}

const addRandomWindow = (gameField: IGameField): IGameField => {
    const gf = copyGameField(gameField);
    const randomRow = randomIntFromInterval(0, gf.length - 1);
    const randomColumn  = randomIntFromInterval(0, gf[0].length - 1);
    if (gf[randomRow][randomColumn] === ICell.Window) return addRandomWindow(gf);
    gf[randomRow][randomColumn] = ICell.Window;
    return gf;
}

export const addRandomWindows = (count: number) => (gameField: IGameField): IGameField => {
    let gf = copyGameField(gameField);

    for (let i = 0; i < count; i++) {
        gf = addRandomWindow(gf);
    }
    return gf;
}

export const removeRoach = (gameField: IGameField): IGameField => {
    let gf = copyGameField(gameField);

    gf.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === ICell.Roach) gf[rowIdx][cellIdx] = ICell.Window;
        })
    })
    return gf;
}

export const addRandomRoach = (gameField: IGameField): IGameField => {
    let gf = copyGameField(gameField);
    let windowsCount = 0;

    gf.forEach(row => {
        windowsCount += row.reduce((itemsAcc, item) => item === ICell.Window ? itemsAcc + 1 : itemsAcc, 0);
    })

    const roachPosition = randomIntFromInterval(0, windowsCount - 1);

    let roachNumber = -1;
    gf.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === ICell.Window) roachNumber++;
            if (roachNumber === roachPosition && cell === ICell.Window) {
                gf[rowIdx][cellIdx] = ICell.Roach;
            }
        })
    })

    return gf;
}

export const getRoachPosition = (gameField: IGameField): IRoachPosition => {
    let result = null;

    gameField.forEach((row, rowIdx) => {
        row.forEach((cell, columnIdx) => {
            if (cell === ICell.Roach) {
                const itemWidth  = getItemWidth(gameField);
                const itemHeight = getItemHeight(gameField);

                result = new DOMRect(columnIdx * itemWidth, rowIdx * itemHeight, itemWidth, itemHeight);
            }
        })
    })

    return result;
}
