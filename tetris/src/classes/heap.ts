import {ICube} from "./cube";

interface IHeap {
    cubes: ICube[],
}

export class Heap implements IHeap {
    public cubes: ICube[];

    public constructor(cubes: ICube[]) {
        this.cubes = [...cubes];
    }

    public deleteLevel(level: number): void {
        const heap: ICube[] = [];

        this.cubes
            .forEach(heapCube => {
                if (heapCube.position[1] > level) {
                    const cube: ICube = {...heapCube, position: [...heapCube.position]};
                    cube.position[1] = cube.position[1] - 1;
                    heap.push(cube);
                }
                if (heapCube.position[1] < level) heap.push(heapCube);
            });

        this.cubes = heap;
    }
}
