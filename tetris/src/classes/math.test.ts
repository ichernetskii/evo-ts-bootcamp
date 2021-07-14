import {Axis, Matrix, matrixMultiplyVector, Vector, vectorRotate} from "./math";

describe("Types test cases", () => {
    test("multiple matrix on vector", () => {
        const matrix: Matrix = [[1, 2, 3], [1, 0, 2], [-1, 1, 2]];
        const vector: Vector = [1, 2, 1];
        const result = matrixMultiplyVector(matrix, vector);
        expect(result).toEqual([2, 3, 9]);
    })

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
    })
})
