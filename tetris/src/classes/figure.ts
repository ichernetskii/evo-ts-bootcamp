import {Axis, roundVector, Vector, vectorRotate} from "./math";
import {ICube} from "./cube";

export interface IFigure {
    position: Vector,
    cubes: ICube[]
}

export class Figure implements IFigure {
    position: Vector;
    cubes: ICube[];

    constructor(position: Vector, cubes: ICube[]) {
        this.position = roundVector(position);
        this.cubes = [...cubes];
    }

    setPosition(position: Vector) {
        this.position = roundVector(position);
    }

    move(axis: Axis, length: number) {
        this.position[axis] += length;
    }

    rotate(axis: Axis, angle: number) {
        this.cubes = this.cubes.map(cube => ({
            ...cube,
            position: roundVector(vectorRotate(cube.position, axis, angle))
        }));
    }

    getFinalFigurePosition(heap: ICube[], gameFieldSize: Vector, cubeSize: number, dy: number): Vector {
        const finalFigure = new Figure(this.position, this.cubes);
        finalFigure.position[1] -= dy;
        while (finalFigure.check.heap(heap, cubeSize) && finalFigure.check.ground(gameFieldSize, cubeSize)) {
            finalFigure.position[1] -= dy;
        }
        finalFigure.position[1] += dy;
        return finalFigure.position;
    }

    // return true if NO collision
    check = {
        gameField: (size: Vector, cubeSize: number) => {
            for(const figureCube of this.cubes) {
                if (
                    (Math.abs(this.position[0] + figureCube.position[0]) > (size[0] - cubeSize) / 2) ||
                    (Math.abs(this.position[2] + figureCube.position[2]) > (size[2] - cubeSize) / 2)
                ) return false;
            }
            return true;
        },
        heap: (heap: ICube[], cubeSize: number): boolean => {
            for(const figureCube of this.cubes) {
                for(const heapCube of heap) {
                    const collision = [0, 1, 2].reduce(
                        (acc, idx) => acc && (
                            Math.abs(
                                this.position[idx] + figureCube.position[idx] - heapCube.position[idx]
                            ) < cubeSize),
                        true
                    );

                    if (collision) return false;
                }
            }
            return true;
        },
        ground: (gameFieldSize: Vector, cubeSize: number): boolean => {
            for(const figureCube of this.cubes) {
                if (this.position[1] + figureCube.position[1] < -(gameFieldSize[1]/2) + cubeSize / 2) return false;
            }
            return true;
        }
    }
}
