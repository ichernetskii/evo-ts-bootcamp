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

export enum Axis {
    X,
    Y,
    Z
}

export type Vector = [x: number, y: number, z: number];
export type Matrix = [Vector, Vector, Vector]; // m[x][y]

/**
 * Rounds vector coordinates by specific step
 * @param vector Vector to be rounded
 * @param step Step of round
 */
export function roundVector(vector: Vector, step: number = 0.5): Vector {
    return vector.map(v => round(v)) as Vector;
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

/**
 * Returns 1 if fn ≥ √2/2, -1 if fn ≤ -√2/2 and 0 otherwise.
 *
 * @param {number} alpha Angle in degrees
 * @param {"sin" | "cos"} fn cos or -sin
 */
export function signThreshold(alpha: number, fn: "sin" | "cos"): number {
    const fnAlpha = (fn === "sin" ? -1 : 1) * Math[fn](alpha * (Math.PI / 180));
    const sqrt = Math.sqrt(2)/2;

    if (fnAlpha >= sqrt) { return 1 }
    else {
        if (fnAlpha <= -sqrt) { return -1 } else { return 0 }
    }
}
