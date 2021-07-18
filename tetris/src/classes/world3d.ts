import * as BABYLON from "babylonjs";
import {Axis, vectorPlusVector} from "./math";
import {ICube} from "./cube";
import {Publisher} from "./observer";
import {IGameState} from "./game-state";
import {IListenersStore} from "./listeners.store";
import {IListeners3D} from "./listeners.3D";
import {throttle} from "../assets/utils";
import {log} from "../../../lessons/14-network/007-react-keyboard/src/services/api";

const GAMEFIELD_WIDTH = 4.0;
const GAMEFIELD_COLOR = [255, 255, 255, 0.2];
const FINAL_FIGURE_WIDTH = 2.0;
const FINAL_FIGURE_COLOR = [255, 255, 255, 0.4];
const CUBES_BORDER_WIDTH = 6.0;
const CUBES_BORDER_COLOR = [255, 255, 255, 0.2];
const GROUND_ALPHA = 0.5;

const LIGHT = {
    POSITION: [2, 20, 2],
    INTENSITY: 1
}

interface IMaterials {
    [key: string]: BABYLON.StandardMaterial
}

export class World3d {
    private readonly coloredMaterials: IMaterials;
    private canvas: HTMLCanvasElement;
    readonly scene: BABYLON.Scene;
    private camera: BABYLON.ArcRotateCamera;
    private light: BABYLON.HemisphericLight;
    private ground: BABYLON.Mesh;
    private gameField: BABYLON.Mesh;
    private figure: BABYLON.Mesh[];
    private finalFigure: BABYLON.Mesh[];
    private heap: BABYLON.Mesh[];
    private start: number;
    public publisher3D = new Publisher<IListeners3D>({
        getFigure: () => this.figure,
        getCamera: () => ({ alpha: this.camera.alpha, beta: this.camera.beta, radius: this.camera.radius }),
        rerenderFigure: () => this.rerenderFigure(),
        updateFigure: () => this.updateFigure(),
        rerenderFinalFigure: () => this.rerenderFinalFigure(),
        updateFinalFigure: () => this.updateFinalFigure(),
        rerenderHeap: () => this.rerenderHeap(),
        updateHeap: () => this.updateHeap(),
        rerenderGround: () => this.rerenderGround(),
        rerenderGameField: () => this.rerenderGameField(),
        updateGameState: () => this.updateGameState()
    });

    public constructor(canvas: HTMLCanvasElement, private publisherStore: Publisher<IListenersStore>) {
        this.canvas = canvas;
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

        window.addEventListener("resize", () => {
            engine.resize();
        });

        this.scene.registerBeforeRender(() => {
            const progress = Date.now().valueOf() - this.start;
            if (progress >= this.publisherStore.get("getDelay").current && this.publisherStore.get("getGameState") === IGameState.Playing) {
                this.start = Date.now().valueOf();
                this.publisherStore.dispatch("moveFigure")(Axis.Y, -this.publisherStore.get("getDeltaY"));
                this.publisherStore.dispatch("deleteLevels")();
            }
        });

        this.scene.onPointerObservable.add(throttle(
            (pointerInfo: BABYLON.PointerInfo) => {
                if (
                    pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE &&
                    pointerInfo.event.buttons === 1 &&
                    this.publisherStore.get("getGameState") !== IGameState.Playing
                ) {
                    this.publisherStore.dispatch("setCamera")({
                        alpha: this.camera.alpha * (180 / Math.PI),
                        beta: this.camera.beta  * (180 / Math.PI),
                        radius: this.camera.radius
                    });
                }
            },
            200,
            true
        ));

        engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private rerenderFigure() {
        this.figure.forEach(f => f.dispose());
        this.figure = this.createFigureFromState();
    }

    private rerenderFinalFigure() {
        this.finalFigure.forEach(f => f.dispose());
        this.finalFigure = this.createFinalFigureFromState();
    }

    private rerenderHeap() {
        this.heap.forEach(f => f.dispose());
        this.heap = this.createHeapFromState();
    }

    private updateFigure() {
        this.figure.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...
                vectorPlusVector(
                    this.publisherStore.get("getFigure").position,
                    this.publisherStore.get("getFigure").cubes[idx].position
                )
            );
            cube.material = this.coloredMaterials[this.publisherStore.get("getFigure").cubes[idx].color];
        });
    }

    private updateFinalFigure() {
        this.finalFigure.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...
                vectorPlusVector(
                    this.publisherStore.get("getFinalFigure").position,
                    this.publisherStore.get("getFinalFigure").cubes[idx].position
                )
            );
            cube.material = this.coloredMaterials["T" + this.publisherStore.get("getFinalFigure").cubes[idx].color];
        })
    }

    private updateHeap() {
        this.heap.forEach((cube, idx) => {
            cube.position = new BABYLON.Vector3(...this.publisherStore.get("getHeap")[idx].position);
        });
    }

    private rerenderGround() {
        this.ground.dispose();
        this.ground = this.createGround();
    }

    private rerenderGameField() {
        this.gameField.dispose();
        this.gameField = this.createGameField();
    }

    private createCamera(canvas: HTMLCanvasElement): BABYLON.ArcRotateCamera {
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            this.publisherStore.get("getCamera").alpha * (Math.PI/180),
            this.publisherStore.get("getCamera").beta * (Math.PI/180),
            this.publisherStore.get("getCamera").radius,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        camera.attachControl(canvas, true);
        camera.inputs.remove(camera.inputs.attached.pointers);
        camera.inputs.remove(camera.inputs.attached.keyboard);
        camera.inputs.remove(camera.inputs.attached.mousewheel);
        return camera;
    }

    private updateGameState() {
        if (this.publisherStore.get("getGameState") === IGameState.Playing) {
            this.camera.inputs.remove(this.camera.inputs.attached.pointers);
            this.camera.inputs.remove(this.camera.inputs.attached.mousewheel);
        } else {
            this.camera.inputs.addPointers();
            this.camera.inputs.addMouseWheel();
        }

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
            width: this.publisherStore.get("getGameFieldSize")[0],
            height: this.publisherStore.get("getGameFieldSize")[1],
            depth: this.publisherStore.get("getGameFieldSize")[2]
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
                width: this.publisherStore.get("getGameFieldSize")[0],
                height: this.publisherStore.get("getGameFieldSize")[2]
            },
            this.scene
        );

        // to disable z-fighting
        ground.position.y = (-this.publisherStore.get("getGameFieldSize")[1] / 2) - 0.0001;

        const groundTexture = new BABYLON.Texture(require("@/images/logo.jpg"), this.scene);
        groundTexture.uScale = this.publisherStore.get("getGameFieldSize")[0];
        groundTexture.vScale = this.publisherStore.get("getGameFieldSize")[2];
        const groundMaterial = new BABYLON.StandardMaterial(
            "groundMaterial",
            this.scene
        );
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.alpha = GROUND_ALPHA;
        groundMaterial.backFaceCulling = false;
        ground.material = groundMaterial;

        return ground;
    }

    private createCube = (cube: ICube, transparent = false): BABYLON.Mesh => {
        const cubeScene = BABYLON.MeshBuilder.CreateBox("cube", { size: this.publisherStore.get("getCubeSize") });
        cubeScene.position = new BABYLON.Vector3(...cube.position);
        cubeScene.material = this.coloredMaterials[(transparent ? "T" : "") + cube.color];
        return cubeScene;
    }

    private createFigureFromState(): BABYLON.Mesh[] {
        const figureScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getFigure").cubes) {
            const cube3D = this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getFigure").position),
                color: cube.color
            });
            cube3D.enableEdgesRendering();
            cube3D.edgesWidth = CUBES_BORDER_WIDTH;
            cube3D.edgesColor = new BABYLON.Color4(...CUBES_BORDER_COLOR);
            figureScene.push(cube3D);
        }
        return figureScene;
    }

    private createFinalFigureFromState(): BABYLON.Mesh[] {
        const finalFigureScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getFinalFigure").cubes) {
            const cube3D = this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getFinalFigure").position),
                color: cube.color
            }, true);
            cube3D.enableEdgesRendering();
            cube3D.edgesWidth = FINAL_FIGURE_WIDTH;
            cube3D.edgesColor = new BABYLON.Color4(...FINAL_FIGURE_COLOR);
            finalFigureScene.push(cube3D);
        }
        return finalFigureScene;
    }

    private createHeapFromState(): BABYLON.Mesh[] {
        const heapScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getHeap")) {
            const cube3D = this.createCube(cube);
            cube3D.enableEdgesRendering();
            cube3D.edgesWidth = CUBES_BORDER_WIDTH;
            cube3D.edgesColor = new BABYLON.Color4(...CUBES_BORDER_COLOR);
            heapScene.push(cube3D);
        }
        return heapScene;
    }

    private createMaterial(hex: string, transparent = false) {
        const material = new BABYLON.StandardMaterial(`coloredMaterial:${hex}`, this.scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        if (transparent) material.alpha = 0.3;
        return material;
    }

    private createMaterials(): IMaterials {
        const materials: IMaterials = {};
        this.publisherStore.get("getColors").forEach((color: string) => {
            materials[color] = this.createMaterial(color);
            materials["T" + color] = this.createMaterial(color, true);
        })
        return materials;
    }
}
