import * as BABYLON from "babylonjs";
import {Axis, vectorPlusVector} from "./math";
import {ICube} from "./cube";
import {IListeners, Publisher} from "./observer";
import {IGameState} from "./game-state";

enum KeyboardKeys {
    Space = 32,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    A = 65,
    D = 68,
    E = 69,
    Q = 81,
    S = 83,
    W = 87
}

const GROUND_MATERIAL = "#009900";
const GAMEFIELD_COLOR = [255, 255, 255, 0.2];
const GAMEFIELD_WIDTH = 4.0;
const LIGHT = {
    POSITION: [2, 20, 2],
    INTENSITY: 1
}
const CAMERA = {
    ALPHA: 5*Math.PI/32,
    BETA: 11*Math.PI/32,
    RADIUS: 20
}

interface IMaterials {
    [key: string]: BABYLON.StandardMaterial
}

export class World3d {
    private readonly coloredMaterials: IMaterials;
    readonly scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private ground: BABYLON.Mesh;
    private gameField: BABYLON.Mesh;
    private figure: BABYLON.Mesh[];
    private finalFigure: BABYLON.Mesh[];
    private heap: BABYLON.Mesh[];
    private start: number;
    public publisher3D = new Publisher({
        getFigure: () => this.figure,
        setFigure: (figure: BABYLON.Mesh[]) => { this.figure = figure },
        rerenderFigure: () => this.rerenderFigure(),
        updateFigure: () => this.updateFigure(),
        rerenderFinalFigure:() => this.rerenderFinalFigure(),
        updateFinalFigure: () => this.updateFinalFigure(),
        rerenderHeap: () => this.rerenderHeap(),
        updateHeap: () => this.updateHeap(),
        rerenderGround: () => this.rerenderGround(),
        rerenderGameField: () => this.rerenderGameField()
    });

    public constructor(canvas: HTMLCanvasElement, private publisherStore: Publisher<IListeners>) {
        const engine = new BABYLON.Engine(canvas);
        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera(canvas);
        this.light = this.createLight();
        this.coloredMaterials = this.createMaterials();
        this.ground = this.createGround();
        this.gameField = this.createGameField();
        this.publisherStore.dispatch("createNewFigure")();
        this.figure = this.createFigureFromState();
        this.finalFigure = this.createFinalFigureFromState();
        this.heap = this.createHeapFromState();
        this.start = Date.now().valueOf();

        canvas.addEventListener("resize", () => {
            engine.resize();
        });

        this.scene.registerBeforeRender(() => {
            const progress = Date.now().valueOf() - this.start;
            if (progress >= this.publisherStore.get("getState").delay.current && this.publisherStore.get("getState").gameState === IGameState.Playing) {
                this.start = Date.now().valueOf();
                this.publisherStore.dispatch("moveFigure")(Axis.Y, -this.publisherStore.get("getState").dy);
                this.publisherStore.dispatch("deleteLevels")();
            }
        });

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (this.publisherStore.get("getState").gameState === IGameState.Playing) {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        switch (kbInfo.event.keyCode) {
                            // up
                            case KeyboardKeys.Up:
                                this.publisherStore.dispatch("moveFigure")(Axis.X, -1);
                                break;
                            // down
                            case KeyboardKeys.Down:
                                this.publisherStore.dispatch("moveFigure")(Axis.X, 1);
                                break;
                            // right
                            case KeyboardKeys.Right:
                                this.publisherStore.dispatch("moveFigure")(Axis.Z, 1);
                                break;
                            // left
                            case KeyboardKeys.Left:
                                this.publisherStore.dispatch("moveFigure")(Axis.Z, -1);
                                break;
                            // space
                            case KeyboardKeys.Space:
                                this.publisherStore.dispatch("setDelay")(this.publisherStore.get("getState").delay.fast);
                                break;
                            // rotate +X
                            case KeyboardKeys.Q:
                                this.publisherStore.dispatch("rotateFigure")(Axis.X, 90);
                                break;
                            // rotate -X
                            case KeyboardKeys.A:
                                this.publisherStore.dispatch("rotateFigure")(Axis.X, -90);
                                break;
                            // rotate +Y
                            case KeyboardKeys.W:
                                this.publisherStore.dispatch("rotateFigure")(Axis.Y, 90);
                                break;
                            // rotate -Y
                            case KeyboardKeys.S:
                                this.publisherStore.dispatch("rotateFigure")(Axis.Y, -90);
                                break;
                            // rotate +Z
                            case KeyboardKeys.E:
                                this.publisherStore.dispatch("rotateFigure")(Axis.Z, 90);
                                break;
                            // rotate -Z
                            case KeyboardKeys.D:
                                this.publisherStore.dispatch("rotateFigure")(Axis.Z, -90);
                                break;
                        }
                        break;
                    case BABYLON.KeyboardEventTypes.KEYUP:
                        switch (kbInfo.event.keyCode) {
                            case KeyboardKeys.Space:
                                this.publisherStore.dispatch("setDelay")(this.publisherStore.get("getState").delay.normal);
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

    rerenderFigure() {
        this.figure.forEach(f => f.dispose());
        this.figure = this.createFigureFromState();
    }

    rerenderFinalFigure() {
        this.finalFigure.forEach(f => f.dispose());
        this.finalFigure = this.createFinalFigureFromState();
    }

    rerenderHeap() {
        this.heap.forEach(f => f.dispose());
        this.heap = this.createHeapFromState();
    }

    updateFigure() {
        this.figure.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...
                vectorPlusVector(
                    this.publisherStore.get("getState").figure.position,
                    this.publisherStore.get("getState").figure.cubes[idx].position
                )
            );
            cube.material = this.coloredMaterials[this.publisherStore.get("getState").figure.cubes[idx].color];
        });
    }

    updateFinalFigure() {
        this.finalFigure.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...
                vectorPlusVector(
                    this.publisherStore.get("getState").finalFigure.position,
                    this.publisherStore.get("getState").finalFigure.cubes[idx].position
                )
            );
            cube.material = this.coloredMaterials["T" + this.publisherStore.get("getState").finalFigure.cubes[idx].color];
        })
    }

    updateHeap() {
        this.heap.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...this.publisherStore.get("getState").heap[idx].position);
        });
    }

    rerenderGround() {
        this.ground.dispose();
        this.ground = this.createGround();
    }

    rerenderGameField() {
        this.gameField.dispose();
        this.gameField = this.createGameField();
    }

    private createCamera(canvas: HTMLCanvasElement): BABYLON.ArcRotateCamera {
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            CAMERA.ALPHA,
            CAMERA.BETA,
            CAMERA.RADIUS,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        camera.attachControl(canvas, true);
        camera.inputs.remove(camera.inputs.attached.pointers);
        camera.inputs.remove(camera.inputs.attached.keyboard);
        camera.inputs.remove(camera.inputs.attached.mousewheel);
        return camera;
    }

    private createLight(): BABYLON.HemisphericLight {
        const light = new BABYLON.HemisphericLight(
            "HemiLight",
            new BABYLON.Vector3(...LIGHT.POSITION),
            this.scene
        );
        light.intensity = LIGHT.INTENSITY;
        return light;
    }

    private createGameField() {
        const box = BABYLON.MeshBuilder.CreateBox("gameField", {
            width: this.publisherStore.get("getState").size[0],
            height: this.publisherStore.get("getState").size[1],
            depth: this.publisherStore.get("getState").size[2]
        });
        box.position = BABYLON.Vector3.Zero();
        box.enableEdgesRendering();
        box.edgesWidth = GAMEFIELD_WIDTH;
        box.edgesColor = new BABYLON.Color4(...GAMEFIELD_COLOR);

        const glassMaterial = new BABYLON.StandardMaterial("Glass", this.scene);
        glassMaterial.alpha = 0;
        box.material = glassMaterial;

        return box;
    }

    private createGround() {
        const ground = BABYLON.GroundBuilder.CreateGround(
            "ground",
            {
                width: this.publisherStore.get("getState").size[0],
                height: this.publisherStore.get("getState").size[2]
            },
            this.scene
        );
        ground.position.y = -this.publisherStore.get("getState").size[1] / 2;

        const groundMaterial = new BABYLON.StandardMaterial(
            "groundMaterial",
            this.scene
        );

        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString(GROUND_MATERIAL);
        groundMaterial.backFaceCulling = false;
        ground.material = groundMaterial;

        return ground;
    }

    private createCube = (cube: ICube, transparent = false): BABYLON.Mesh => {
        const cubeScene = BABYLON.MeshBuilder.CreateBox("cube", { size: this.publisherStore.get("getState").cubeSize });
        cubeScene.position = new BABYLON.Vector3(...cube.position);
        cubeScene.material = this.coloredMaterials[(transparent ? "T" : "") + cube.color];
        // cubeScene.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        return cubeScene;
    }

    private createFigureFromState(): BABYLON.Mesh[] {
        const figureScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getState").figure.cubes) {
            figureScene.push(this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getState").figure.position),
                color: cube.color
            }));
        }
        return figureScene;
    }

    private createFinalFigureFromState(): BABYLON.Mesh[] {
        const finalFigureScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getState").finalFigure.cubes) {
            finalFigureScene.push(this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getState").finalFigure.position),
                color: cube.color
            }, true));
        }
        return finalFigureScene;
    }

    private createHeapFromState(): BABYLON.Mesh[] {
        const heapScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getState").heap) {
            heapScene.push(this.createCube(cube));
        }
        return heapScene;
    }

    private createMaterial(hex: string, transparent = false) {
        const material = new BABYLON.StandardMaterial(`coloredMaterial:${hex}`, this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        if (transparent) material.alpha = 0.4;
        return material;
    }

    private createMaterials(): IMaterials {
        const materials: IMaterials = {};
        this.publisherStore.get("getState").colors.forEach((color: string) => {
            materials[color] = this.createMaterial(color);
            materials["T" + color] = this.createMaterial(color, true);
        })
        return materials;
    }
}
