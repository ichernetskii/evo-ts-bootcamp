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

                    // if (
                    // 	(Math.abs(figure.position[0] + figureCube.position[0] - heapCube.position[0]) < this.cubeSize) &&
                    // 	(Math.abs(figure.position[1] + figureCube.position[1] - heapCube.position[1]) < this.cubeSize) &&
                    // 	(Math.abs(figure.position[2] + figureCube.position[2] - heapCube.position[2]) < this.cubeSize)
                    // ) {
                    // 	return false;
                    // }
                }
            }
            return true;
        },
        ground: (size: Vector, cubeSize: number): boolean => {
            for(const figureCube of this.cubes) {
                if (this.position[1] + figureCube.position[1] < -(size[1]/2) + cubeSize / 2) return false;
            }
            return true;
        }
    }
}
