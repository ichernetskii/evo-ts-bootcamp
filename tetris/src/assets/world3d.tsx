import * as BABYLON from "babylonjs";
import {Axis, ICube, Vector, vectorPlusVector} from "./math";
import {useStore} from "../store/store";
import {reaction, toJS} from "mobx";

export class World3d {
    private readonly coloredMaterials: {
        [key: string]: BABYLON.StandardMaterial
    };
    private readonly scene: BABYLON.Scene;
    private store: ReturnType<typeof useStore>;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private ground: BABYLON.Mesh;
    private box: BABYLON.Mesh;
    private figure: BABYLON.Mesh[];
    private heap: BABYLON.Mesh[];

    public constructor(canvas: HTMLCanvasElement, store: ReturnType<typeof useStore>) {
        const engine = new BABYLON.Engine(canvas);
        this.store = store;
        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera(canvas);
        this.light = this.createLight();
        this.coloredMaterials = Object.fromEntries(this.store.colors.map(color => [color, this.createMaterial(color)]));
        this.ground = this.createGround();
        this.box = this.createGameField();
        this.figure = this.createFigureFromState();
        this.heap = this.createHeapFromState();
        this.store.createNewFigure();

        this.scene.registerBeforeRender(() => {
            if (
                (this.store.figure.position[1] >= -(this.store.size.y/2) + 0.5) &&
                (!this.store.checkCollision())
            ) {
                this.store.moveFigure(Axis.Y, -this.store.dy);
            } else {
                // this.store.roundPosition();
                this.store.figureToHeap();
                this.store.createNewFigure();
            }
        });

        // update figure (store → scene )
        reaction(() => toJS(this.store.figure),
            (figure) => {
                this.figure.forEach(f => f.dispose());
                this.figure = this.createFigureFromState();

                figure.cubes.forEach((cubeStore, idx) => {
                    this.figure[idx].position = new BABYLON.Vector3(
                        ...vectorPlusVector(figure.position, figure.cubes[idx].position)
                    );
                });
            }
        );

        // update heap (store → scene )
        reaction(() => toJS(this.store.heap),
            (heap) => {
                this.heap.forEach(f => f.dispose());
                this.heap = this.createHeapFromState();

                heap.forEach((cubeStore, idx) => {
                    this.heap[idx].position = new BABYLON.Vector3(...heap[idx].position);
                    this.heap[idx].material = this.coloredMaterials[heap[idx].color]
                })
            }
        );

        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    console.log("KEY DOWN: ", kbInfo.event.key);
                    switch (kbInfo.event.keyCode) {
                        // up
                        case 38:
                            this.store.moveFigure(Axis.X, -1);
                            break;
                        // down
                        case 40:
                            this.store.moveFigure(Axis.X, 1);
                            break;
                        // right
                        case 39:
                            this.store.moveFigure(Axis.Z, 1);
                            break;
                        // left
                        case 37:
                            this.store.moveFigure(Axis.Z, -1);
                            break;
                        // Num 7: rotate +X
                        case 103:
                            this.store.rotateFigure(Axis.X, 90);
                            break;
                        // Num 4: rotate -X
                        case 100:
                            this.store.rotateFigure(Axis.X, -90);
                            break;
                        // Num 8: rotate +Y
                        case 104:
                            this.store.rotateFigure(Axis.Y, 90);
                            break;
                        // Num 5: rotate -Y
                        case 101:
                            this.store.rotateFigure(Axis.Y, -90);
                            break;
                        // Num 9: rotate +Z
                        case 105:
                            this.store.rotateFigure(Axis.Z, 90);
                            break;
                        // Num 6: rotate -Z
                        case 102:
                            this.store.rotateFigure(Axis.Z, -90);
                            break;
                    }
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    console.log("KEY UP: ", kbInfo.event.keyCode);
                    break;
            }
            // this.store.roundPosition();
        });

        engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private createCamera(canvas: HTMLCanvasElement): BABYLON.ArcRotateCamera {
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI/8,
            7*Math.PI/16,
            20,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        camera.attachControl(canvas, true);
        camera.inputs.remove(camera.inputs.attached.keyboard);
        return camera;
    }

    private createLight(): BABYLON.HemisphericLight {
        const light = new BABYLON.HemisphericLight(
            "HemiLight",
            new BABYLON.Vector3(2, 20, 2),
            this.scene
        );
        light.intensity = 1;
        return light;
    }

    private createGameField() {
        const box = BABYLON.MeshBuilder.CreateBox("box", {
            width: 5,
            height: 10,
            depth: 5
        });
        box.position = BABYLON.Vector3.Zero();
        box.enableEdgesRendering();
        box.edgesWidth = 4.0;
        box.edgesColor = new BABYLON.Color4(255, 255, 255, 0.2);

        const glassMaterial = new BABYLON.StandardMaterial("Glass", this.scene);
        glassMaterial.alpha = 0;
        box.material = glassMaterial;

        return box;
    }

    private createGround() {
        const ground = BABYLON.GroundBuilder.CreateGround(
            "ground",
            {
                width: 5,
                height: 5
            },
            this.scene
        );
        ground.position.y = -5;

        const groundMaterial = new BABYLON.StandardMaterial(
            "groundMaterial",
            this.scene
        );

        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#009900");
        groundMaterial.backFaceCulling = false;
        ground.material = groundMaterial;

        return ground;
    }

    private createCube = (cube: ICube): BABYLON.Mesh => {
        const cubeScene = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 });
        cubeScene.position = new BABYLON.Vector3(...cube.position);
        cubeScene.material = this.coloredMaterials[cube.color];
        return cubeScene;
    }

    private createFigureFromState(): BABYLON.Mesh[] {
        const figureScene: BABYLON.Mesh[] = [];
        for(const cube of this.store.figure.cubes) {
            figureScene.push(this.createCube({
                position: vectorPlusVector(cube.position, this.store.figure.position),
                color: cube.color
            }));
        }
        return figureScene;
    }

    private createHeapFromState(): BABYLON.Mesh[] {
        const heapScene: BABYLON.Mesh[] = [];
        for(const cube of this.store.heap) {
            heapScene.push(this.createCube(cube));
        }
        return heapScene;
    }

    private createMaterial(hex: string) {
        const material = new BABYLON.StandardMaterial(`coloredMaterial:${hex}`, this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        return material;
    }
}
