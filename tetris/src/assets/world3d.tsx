import * as BABYLON from "babylonjs";
import {Axis, ICube, IGameState, vectorPlusVector} from "./math";
import {reaction, toJS} from "mobx";
import gameStore from "./../store/game-store";

export class World3d {
    private readonly coloredMaterials: {
        [key: string]: BABYLON.StandardMaterial
    };
    readonly scene: BABYLON.Scene;
    private store: typeof gameStore;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private ground: BABYLON.Mesh;
    private gameField: BABYLON.Mesh;
    private figure: BABYLON.Mesh[];
    private heap: BABYLON.Mesh[];
    private start: number;

    public constructor(canvas: HTMLCanvasElement, store: typeof gameStore) {
        const engine = new BABYLON.Engine(canvas);
        this.store = store;
        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera(canvas);
        this.light = this.createLight();
        this.coloredMaterials = Object.fromEntries(this.store.colors.map(color => [color, this.createMaterial(color)]));
        this.ground = this.createGround();
        this.gameField = this.createGameField();
        this.store.createNewFigure();
        this.figure = this.createFigureFromState();
        this.heap = this.createHeapFromState();
        this.start = Date.now().valueOf();

        this.scene.registerBeforeRender(() => {
            const progress = Date.now().valueOf() - this.start;
            if (progress >= this.store.delay.current && this.store.gameState === IGameState.Playing) {
                this.start = Date.now().valueOf();
                this.store.moveFigure(Axis.Y, -this.store.dy);
                this.store.deleteLevels();
            }
        });

        // update figure (store → scene)
        reaction(() => toJS(this.store.figure),
            (figure, prevFigure) => {
                if (figure.cubes.length !== prevFigure.cubes.length) {
                    this.figure.forEach(f => f.dispose());
                    this.figure = this.createFigureFromState();
                }

                figure.cubes.forEach((cubeStore, idx) => {
                    this.figure[idx].position = new BABYLON.Vector3(
                        ...vectorPlusVector(figure.position, figure.cubes[idx].position)
                    );
                    this.figure[idx].material = this.coloredMaterials[figure.cubes[idx].color]
                });
            }
        );

        // update heap (store → scene)
        reaction(() => toJS(this.store.heap),
            (heap, prevHeap) => {
            if (heap.length !== prevHeap.length) {
                this.heap.forEach(f => f.dispose());
                this.heap = this.createHeapFromState();
            }
                heap.forEach((cubeStore, idx) => {
                    this.heap[idx].position = new BABYLON.Vector3(...heap[idx].position);
                    this.heap[idx].material = this.coloredMaterials[heap[idx].color]
                })
            }
        );

        // update gameField & ground (store → gameField, ground)
        reaction(() => toJS(this.store.size), () => {
            this.ground.dispose();
            this.ground = this.createGround();
            this.gameField.dispose();
            this.gameField = this.createGameField();
        })

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (store.gameState === IGameState.Playing) {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        // console.log("KEY DOWN: ", kbInfo.event.key);
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
                            // space
                            case 32:
                                this.store.delay.current = this.store.delay.fast;
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
                        // console.log("KEY UP: ", kbInfo.event.keyCode);
                        switch (kbInfo.event.keyCode) {
                            case 32:
                                this.store.delay.current = this.store.delay.normal;
                                break;
                        }

                        break;
                }
            }
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
        const box = BABYLON.MeshBuilder.CreateBox("gameField", {
            width: this.store.size[0],
            height: this.store.size[1],
            depth: this.store.size[2]
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
                width: this.store.size[0],
                height: this.store.size[2]
            },
            this.scene
        );
        ground.position.y = -this.store.size[1] / 2;

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
        const cubeScene = BABYLON.MeshBuilder.CreateBox("cube", { size: this.store.cubeSize });
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
