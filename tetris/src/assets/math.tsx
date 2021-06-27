export enum Axis {
    X,
    Y,
    Z
}

export type Vector = [x: number, y: number, z: number];
export type Matrix = [Vector, Vector, Vector]; // m[x][y]

export interface ICube {
    position: Vector,
    color: string
}

export interface IFigure {
    position: Vector,
    cubes: ICube[]
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
        Math.round(v1[0] + v2[0]),
        v1[1] + v2[1],
        Math.round(v1[2] + v2[2])
    ];
}

export function getMinYFigure(figure: IFigure) {
    return figure.position[1] + Math.min(...figure.cubes.map(cube => cube.position[1]));
}
