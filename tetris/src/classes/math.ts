export enum Axis {
    X,
    Y,
    Z
}

export type Vector = [x: number, y: number, z: number];
export type Matrix = [Vector, Vector, Vector]; // m[x][y]

/**
 * Rounds value by specific step
 * @param {number} value Value to be rounded
 * @param {number} step Step of round
 * @example
 * round(2.74, 0.1) = 2.7
 * round(2.74, 0.5) = 2.5
 * round(2.74, 1.0) = 3
 */
export function round(value: number, step: number = 0.5): number {
    let inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

/**
 * Rounds vector coordinates by specific step
 * @param vector Vector to be rounded
 * @param step Step of round
 */
export function roundVector(vector: Vector, step: number = 0.5): Vector {
    return vector.map(v => round(v)) as Vector;
}

export const randomHEXColor = (): string => "#" + Math.floor(Math.random()*16777215).toString(16);

// min and max included
export function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function matrixMultiplyVector(m: Matrix, v: Vector): Vector {
    let result: Vector = [0, 0, 0];
    for (let i = 0; i < v.length; i++) {
        let acc = 0;
        for (let j = 0; j < v.length; j++) {
            acc += m[j][i] * v[j];
        }
        result[i] = Math.round(acc);
    }
    return result;
}

export function vectorPlusVector(v1: Vector, v2: Vector): Vector {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2]
    ];
}

// export function getMinYFigure(figure: IFigure) {
//     return figure.position[1] + Math.min(...figure.cubes.map(cube => cube.position[1]));
// }

/**
 * Rotates vector
 *
 * @param {Vector} vector Vector to be rotated
 * @param {Axis} axis Axis-rotation
 * @param {number} angle Angle of rotation in degrees
 */
export function vectorRotate(vector: Vector, axis: Axis, angle: number): Vector {
    const sin = Math.sin;
    const cos = Math.cos;
    const a = Math.PI * (angle / 180);
    let rotationMatrix: Matrix;

    switch (axis) {
        case Axis.X:
            rotationMatrix = [[1, 0, 0], [0, cos(a), sin(a)], [0, -sin(a), cos(a)]];
            break;
        case Axis.Y:
            rotationMatrix = [[cos(a), 0, -sin(a)], [0, 1, 0], [sin(a), 0, cos(a)]];
            break;
        case Axis.Z:
            rotationMatrix = [[cos(a), sin(a), 0], [-sin(a), cos(a), 0], [0, 0, 1]];
            break;
    }

    return matrixMultiplyVector(rotationMatrix, vector);
}
