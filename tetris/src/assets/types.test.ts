import {Axis, Figure, Matrix, matrixVectorMultiplication, Vector} from "./types";

describe("Types test cases", () => {
    test("multiple matrix on vector", () => {
        const matrix: Matrix = [[1, 2, 3], [1, 0, 2], [-1, 1, 2]];
        const vector: Vector = [1, 2, 1];
        const result = matrixVectorMultiplication(matrix, vector);
        expect(result).toEqual([2, 3, 9]);
    })

    test("Figure rotation", () => {
        const figure = new Figure();
        figure.data = [[1, 2, 1]];
        figure.rotate(Axis.X, 90);
        expect(figure.data).toEqual([[1, -1, 2]]);

        figure.data = [[-1, 2, -2]];
        figure.rotate(Axis.Y, 90);
        expect(figure.data).toEqual([[-2, 2, 1]]);
        figure.rotate(Axis.Y, -90);
        expect(figure.data).toEqual([[-1, 2, -2]]);

        figure.data = [[0, 2, -1]];
        figure.rotate(Axis.Z, 90);
        expect(figure.data).toEqual([[-2, 0, -1]]);
        figure.data = [[3, 2, -1]];
        figure.rotate(Axis.Z, -90);
        expect(figure.data).toEqual([[2, -3, -1]]);
    })
})
