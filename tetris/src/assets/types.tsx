export enum Axis {
    X,
    Y,
    Z
}

export type Vector = [x: number, y: number, z: number];
export type Matrix = [Vector, Vector, Vector]; // m[x][y]

export function matrixVectorMultiplication(m: Matrix, v: Vector): Vector {
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

export function vectorsAdd(v1: Vector, v2: Vector): Vector {
    return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2]
    ];
}

const sin = Math.sin;
const cos = Math.cos;

export interface IFigure {
    position: Vector,
    data: Vector[]
}

export class Figure {
    public position: Vector = [0, 0, 0];

    // cubes of figure
    public data: Vector[] = [
        [-1, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1]
    ];

    /**
     *
     * @param {Axis} axis Axis-rotation
     * @param {number} angle Angle of rotation in degrees
     */
    public rotate(axis: Axis, angle: number) {
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

        this.data.forEach((item, idx) => {
            this.data[idx] = matrixVectorMultiplication(rotationMatrix, item);
        });
    }
}
