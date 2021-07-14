import * as BABYLON from "babylonjs";
import {Axis, Vector, vectorPlusVector} from "./math";
import {ICube} from "./cube";
import gameStore from "./../store/game-store";
import {createPublisher} from "./observer";
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
    public publisher3D = createPublisher({
        getFigure: () => this.figure,
        setFigure: (figure: BABYLON.Mesh[]) => { this.figure = figure },
        rerenderFigure: () => this.rerenderFigure(),
        updateFigure: (idx: number, position: Vector, material: string) => { this.updateFigure(idx, position, material) },
        rerenderHeap: () => this.rerenderHeap(),
        updateHeap: (idx: number, position: Vector, material: string) => { this.updateHeap(idx, position, material) },
        rerenderGround: () => this.rerenderGround(),
        rerenderGameField: () => this.rerenderGameField()
    });

    rerenderFigure() {
        this.figure.forEach(f => f.dispose());
        this.figure = this.createFigureFromState();
    }

    rerenderHeap() {
        this.heap.forEach(f => f.dispose());
        this.heap = this.createHeapFromState();
    }

    updateFigure(idx: number, position: Vector, material: string) {
        this.figure[idx].position = new BABYLON.Vector3(...position);
        this.figure[idx].material = this.coloredMaterials[material];
    }

    updateHeap(idx: number, position: Vector, material: string) {
        this.heap[idx].position = new BABYLON.Vector3(...position);
        this.heap[idx].material = this.coloredMaterials[material]
    }

    rerenderGround() {
        this.ground.dispose();
        this.ground = this.createGround();
    }

    rerenderGameField() {
        this.gameField.dispose();
        this.gameField = this.createGameField();
    }

    public constructor(canvas: HTMLCanvasElement, store: typeof gameStore, publisherStore: ReturnType<typeof createPublisher>) {
        const engine = new BABYLON.Engine(canvas);
        this.store = store;
        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera(canvas);
        this.light = this.createLight();
        this.coloredMaterials = Object.fromEntries((publisherStore.get("getState").colors).map(color => [color, this.createMaterial(color)]));
        this.ground = this.createGround();
        this.gameField = this.createGameField();
        publisherStore.dispatch("createNewFigure");
        this.figure = this.createFigureFromState();
        this.heap = this.createHeapFromState();
        this.start = Date.now().valueOf();

        canvas.addEventListener("resize", () => {
            engine.resize();
        });

        this.scene.registerBeforeRender(() => {
            const progress = Date.now().valueOf() - this.start;
            if (progress >= this.store.delay.current && this.store.gameState === IGameState.Playing) {
                this.start = Date.now().valueOf();
                this.store.moveFigure(Axis.Y, -this.store.dy);
                this.store.deleteLevels();
            }
        });

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (store.gameState === IGameState.Playing) {
                switch (kbInfo.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:
                        // console.log("KEY DOWN: ", kbInfo.event.key);
                        switch (kbInfo.event.keyCode) {
                            // up
                            case KeyboardKeys.Up:
                                this.store.moveFigure(Axis.X, -1);
                                break;
                            // down
                            case KeyboardKeys.Down:
                                this.store.moveFigure(Axis.X, 1);
                                break;
                            // right
                            case KeyboardKeys.Right:
                                this.store.moveFigure(Axis.Z, 1);
                                break;
                            // left
                            case KeyboardKeys.Left:
                                this.store.moveFigure(Axis.Z, -1);
                                break;
                            // space
                            case KeyboardKeys.Space:
                                this.store.delay.current = this.store.delay.fast;
                                break;
                            // rotate +X
                            case KeyboardKeys.Q:
                                this.store.rotateFigure(Axis.X, 90);
                                break;
                            // rotate -X
                            case KeyboardKeys.A:
                                this.store.rotateFigure(Axis.X, -90);
                                break;
                            // rotate +Y
                            case KeyboardKeys.W:
                                this.store.rotateFigure(Axis.Y, 90);
                                break;
                            // rotate -Y
                            case KeyboardKeys.S:
                                this.store.rotateFigure(Axis.Y, -90);
                                break;
                            // rotate +Z
                            case KeyboardKeys.E:
                                this.store.rotateFigure(Axis.Z, 90);
                                break;
                            // rotate -Z
                            case KeyboardKeys.D:
                                this.store.rotateFigure(Axis.Z, -90);
                                break;
                        }
                        break;
                    case BABYLON.KeyboardEventTypes.KEYUP:
                        // console.log("KEY UP: ", kbInfo.event.keyCode);
                        switch (kbInfo.event.keyCode) {
                            case KeyboardKeys.Space:
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
            CAMERA.ALPHA,
            CAMERA.BETA,
            CAMERA.RADIUS,
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
            new BABYLON.Vector3(...LIGHT.POSITION),
            this.scene
        );
        light.intensity = LIGHT.INTENSITY;
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

        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString(GROUND_MATERIAL);
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
