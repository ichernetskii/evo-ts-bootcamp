function randomIntFromInterval(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export enum ICell {
    Wall = "Wall",
    Window = "Window",
    Roach = "Roach"
}
export type IGameField = ICell[][];
export type IRoachPosition = DOMRect | null;

export const getItemWidth  = (gameField: IGameField, $canvas: HTMLCanvasElement): number => $canvas.getBoundingClientRect().width  / gameField[0].length;
export const getItemHeight = (gameField: IGameField, $canvas: HTMLCanvasElement): number => $canvas.getBoundingClientRect().height / gameField.length;

export const initializeGameField = (width: number, height: number) => (): IGameField => {
    const row: ICell[] = Array
        .from<ICell>({length: width})
        .fill(ICell.Wall);

    return Array
        .from<ICell[]>({length: height})
        .map(() => [...row]);
}

const addRandomWindow = (gameField: IGameField): IGameField => {
    const randomRow = randomIntFromInterval(0, gameField.length - 1);
    const randomColumn  = randomIntFromInterval(0, gameField[0].length - 1);
    if (gameField[randomRow][randomColumn] === ICell.Window) return addRandomWindow(gameField);
    gameField[randomRow][randomColumn] = ICell.Window;
    return gameField;
}

export const addRandomWindows = (count: number) => (gameField: IGameField): IGameField => {
    for (let i = 0; i < count; i++) {
        gameField = addRandomWindow(gameField);
    }
    return gameField;
}

export const removeRoach = (gameField: IGameField) => (): IGameField => {
    gameField.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === ICell.Roach) gameField[rowIdx][cellIdx] = ICell.Window;
        })
    })
    return gameField;
}

export const addRandomRoach = (gameField: IGameField) => (): IGameField => {
    let windowsCount = 0;
    gameField.forEach(row => {
        windowsCount += row.reduce((itemsAcc, item) => item === ICell.Window ? itemsAcc + 1 : itemsAcc, 0);
    })

    const roachPosition = randomIntFromInterval(0, windowsCount - 1);

    let roachNumber = -1;
    gameField.forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === ICell.Window) roachNumber++;
            if (roachNumber === roachPosition && cell === ICell.Window) {
                gameField[rowIdx][cellIdx] = ICell.Roach;
            }
        })
    })

    return gameField;
}

export const getRoachPosition = (gameField: IGameField, $canvas: HTMLCanvasElement): IRoachPosition => {
    let result = null;

    gameField.forEach((row, rowIdx) => {
        row.forEach((cell, columnIdx) => {
            if (cell === ICell.Roach) {
                const itemWidth  = getItemWidth(gameField, $canvas);
                const itemHeight = getItemHeight(gameField, $canvas);

                result = new DOMRect(columnIdx * itemWidth, rowIdx * itemHeight, itemWidth, itemHeight);
            }
        })
    })

    return result;
}

export const imagesLoaded = (...images: HTMLImageElement[]) => {
    const imagePromises = images.map(
        image => new Promise<void>(resolve => {
            image.onload = () => resolve()
        })
    );

    return Promise.all(imagePromises);
}
