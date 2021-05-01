type CompareFunction<T> = (a: T, b: T) => number;

export function mergeSorted<T>(array1: T[], array2: T[], compareFunction: CompareFunction<T>): T[] {
    if (!array1.length || !array2.length) return [...array1, ...array2];
    if (compareFunction(array1[0], array2[0]) < 0)
        return [array1[0], ...mergeSorted(array1.slice(1), array2, compareFunction)]
    else return [array2[0], ...mergeSorted(array1, array2.slice(1), compareFunction)]
}

export function mergeSort<T>(array: T[], compareFunction: CompareFunction<T>): T[] {
    if (array.length < 2)
        return array
    else {
        const array1: T[] = mergeSort(array.slice(0, ~~(array.length/2)), compareFunction);
        const array2: T[] = mergeSort(array.slice(~~(array.length/2), array.length), compareFunction);
        return mergeSorted(array1, array2, compareFunction);
    }
}
