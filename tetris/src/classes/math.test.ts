import {
    Axis,
    Matrix,
    matrixMultiplyVector,
    round,
    roundVector,
    signThreshold,
    Vector,
    vectorPlusVector,
    vectorRotate
} from "./math";

describe("Math test cases", () => {
    test("Multiply matrix on vector", () => {
        const matrix: Matrix = [[1, 2, 3], [1, 0, 2], [-1, 1, 2]];
        const vector: Vector = [1, 2, 1];
        const result = matrixMultiplyVector(matrix, vector);
        expect(result).toEqual([2, 3, 9]);
    });

    test("Vector plus vector", () => {
        let vector1: Vector = [1, 2, 3];
        let vector2: Vector = [5, 2, 0];
        let result = vectorPlusVector(vector1, vector2);
        expect(result).toEqual([6, 4, 3]);

        vector1 = [0, 0, 0];
        vector2 = [-10.4, 0, 42];
        result = vectorPlusVector(vector1, vector2);
        expect(result).toEqual([-10.4, 0, 42]);
    });

    test("Figure rotation", () => {
        let vector: Vector = [1, 2, 1];
        vector = vectorRotate(vector, Axis.X, 90)
        expect(vector).toEqual([1, -1, 2]);

        vector = [-1, 2, -2];
        vector = vectorRotate(vector, Axis.Y, 90)
        expect(vector).toEqual([-2, 2, 1]);
        vector = vectorRotate(vector, Axis.Y, -90)
        expect(vector).toEqual([-1, 2, -2]);

        vector = [0, 2, -1];
        vector = vectorRotate(vector, Axis.Z, 90)
        expect(vector).toEqual([-2, 0, -1]);
        vector = [3, 2, -1];
        vector = vectorRotate(vector, Axis.Z, -90)
        expect(vector).toEqual([2, -3, -1]);
    });

    test("Round with step", () => {
        expect(round(2.6, 1)).toEqual(3);
        expect(round(2.2, 0.5)).toEqual(2);
        expect(round(2.3, 0.5)).toEqual(2.5);
        expect(round(2.6, 0.5)).toEqual(2.5);
        expect(round(2.75, 0.5)).toEqual(3);
        expect(round(2.8, 0.5)).toEqual(3);
        expect(round(2.8234, 0.1)).toEqual(2.8);
        expect(round(-2.8234, 0.1)).toEqual(-2.8);
    });

    test("Round vector", () => {
        let vector: Vector = [3.74, 3.75, 3.76];
        expect(roundVector(vector)).toEqual([3.5, 4, 4]);
        vector = [0, -2.99, 4.01];
        expect(roundVector(vector)).toEqual([0, -3, 4]);
    });

    test("Sign threshold", () => {
        expect(signThreshold(0, "sin")).toEqual(0);
        expect(signThreshold(44, "sin")).toEqual(0);
        expect(signThreshold(45, "sin")).toEqual(0);
        expect(signThreshold(46, "sin")).toEqual(-1);
        expect(signThreshold(90, "sin")).toEqual(-1);
        expect(signThreshold(134, "sin")).toEqual(-1);
        expect(signThreshold(136, "sin")).toEqual(0);
        expect(signThreshold(180, "sin")).toEqual(0);
        expect(signThreshold(225.00001, "sin")).toEqual(1);
        expect(signThreshold(270, "sin")).toEqual(1);
        expect(signThreshold(314.999, "sin")).toEqual(1);
        expect(signThreshold(315, "sin")).toEqual(1);
        expect(signThreshold(315.0001, "sin")).toEqual(0);
        expect(signThreshold(360, "sin")).toEqual(0);
        expect(signThreshold(720, "sin")).toEqual(0);

        expect(signThreshold(0, "cos")).toEqual(1);
        expect(signThreshold(44, "cos")).toEqual(1);
        expect(signThreshold(45, "cos")).toEqual(1);
        expect(signThreshold(46, "cos")).toEqual(0);
        expect(signThreshold(90, "cos")).toEqual(0);
        expect(signThreshold(134, "cos")).toEqual(0);
        expect(signThreshold(136, "cos")).toEqual(-1);
        expect(signThreshold(180, "cos")).toEqual(-1);
        expect(signThreshold(225.00001, "cos")).toEqual(0);
        expect(signThreshold(270, "cos")).toEqual(0);
        expect(signThreshold(314.999, "cos")).toEqual(0);
        expect(signThreshold(315, "cos")).toEqual(0);
        expect(signThreshold(315.0001, "cos")).toEqual(1);
        expect(signThreshold(360, "cos")).toEqual(1);
        expect(signThreshold(720, "cos")).toEqual(1);
    });
})
