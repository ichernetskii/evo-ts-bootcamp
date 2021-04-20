import {mergeSort, mergeSorted} from "./merge-sort";

const compareFunctionNumber = (a: number, b: number): number => a - b;
const compareFunctionString = (a: string, b: string): number => a > b ? 1 : (a === b ? 0 : -1);

describe("All tests", () => {
    describe("mergeSort", () => {
        it("sort array of numbers", () => {
            const arr = [4, 3, 6, 2, 1, 42, 5, 0, 1, -1];
            expect(mergeSort<number>(arr, compareFunctionNumber)).toEqual([-1, 0, 1, 1, 2, 3, 4, 5, 6, 42])
        })

        it("sort array with equal values", () => {
            const arr = [42, 42, 42];
            expect(mergeSort<number>(arr, compareFunctionNumber)).toEqual([42, 42, 42])
        })

        it("sort array of strings", () => {
            const arr = ["99", "a", "abc", "1", "01", "2", "9"];
            expect(mergeSort<string>(arr, compareFunctionString)).toEqual(["01", "1", "2", "9", "99", "a", "abc"])
        })
    });

    describe("mergeSorted", () => {
        it("merge sorted numbers", () => {
            const arr1 = [1, 3, 5];
            const arr2 = [2, 4, 6];
            expect(mergeSorted(arr1, arr2, compareFunctionNumber)).toEqual([1, 2, 3, 4, 5, 6])
        })

        it("merge sorted numbers with empty array", () => {
            const arr1: number[] = [];
            const arr2 = [2, 4, 6];
            expect(mergeSorted(arr1, arr2, compareFunctionNumber)).toEqual([2, 4, 6])
        })

        it("merge sorted strings", () => {
            const arr1 = ["05", "1", "3", "5"];
            const arr2 = ["04", "2", "6"];
            expect(mergeSorted(arr1, arr2, compareFunctionString)).toEqual(["04", "05", "1", "2", "3", "5", "6"])
        })
    });
});
