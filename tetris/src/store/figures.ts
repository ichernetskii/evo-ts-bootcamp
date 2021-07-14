import {Vector} from "../classes/math";

const figures: Vector[][] = [
    [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [1, 0, 1]],
    [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [0, 0, 1]],
    [[0, 0, 0]],
    [[-1, 0, 0], [0, 0, 0], [1, 0, 0], [2, 0, 0]],
    [[-1, 0, 0], [0, 0, 0], [0, 0, 1], [1, 0, 1]]
];

const colors: string[] = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

export {figures, colors};
