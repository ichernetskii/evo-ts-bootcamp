interface CompareFunction<T> {
    (a: T, b: T): number
}

function mergeSort<T>(array: T[], compareFunction: CompareFunction<T>): T[] {
    return array;
}
