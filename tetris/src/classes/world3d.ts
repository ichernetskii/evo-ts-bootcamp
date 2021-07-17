import * as BABYLON from "babylonjs";
import {Axis, vectorPlusVector} from "./math";
import {ICube} from "./cube";
import {IListeners, Publisher} from "./observer";
import {IGameState} from "./game-state";

// enum KeyboardKeys {
//     Space = 32,
//     Left = 37,
//     Up = 38,
//     Right = 39,
//     Down = 40,
//     A = 65,
//     D = 68,
//     E = 69,
//     Q = 81,
//     S = 83,
//     W = 87
// }

const GROUND_MATERIAL = "#ff7700";
const GAMEFIELD_WIDTH = 4.0;
const GAMEFIELD_COLOR = [255, 255, 255, 0.2];
const CUBES_BORDER_WIDTH = 6.0;
const CUBES_BORDER_COLOR = [255, 255, 255, 0.2];
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
    public publisher3D = new Publisher({
        getFigure: () => this.figure,
        setFigure: (figure: BABYLON.Mesh[]) => this.figure = figure,
        rerenderFigure: () => this.rerenderFigure(),
        updateFigure: () => this.updateFigure(),
        rerenderFinalFigure: () => this.rerenderFinalFigure(),
        updateFinalFigure: () => this.updateFinalFigure(),
        rerenderHeap: () => this.rerenderHeap(),
        updateHeap: () => this.updateHeap(),
        rerenderGround: () => this.rerenderGround(),
        rerenderGameField: () => this.rerenderGameField(),
        // moveCamera: () => this.moveCamera(),
        updateGameState: () => this.updateGameState()
    });

    public constructor(canvas: HTMLCanvasElement, private publisherStore: Publisher<IListeners>) {
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
            this.publisherStore.get("getState").camera.alpha * (Math.PI/180),
            this.publisherStore.get("getState").camera.beta * (Math.PI/180),
            this.publisherStore.get("getState").camera.radius,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        camera.attachControl(canvas, true);
        camera.inputs.remove(camera.inputs.attached.pointers);
        camera.inputs.remove(camera.inputs.attached.keyboard);
        camera.inputs.remove(camera.inputs.attached.mousewheel);
        return camera;
    }

    // moveCamera() {
    //     this.camera.alpha = this.publisherStore.get("getState").camera.alpha * (Math.PI/180);
    //     this.camera.beta = this.publisherStore.get("getState").camera.beta * (Math.PI/180);
    // }

    updateGameState() {
        if (this.publisherStore.get("getState").gameState === IGameState.Playing) {
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

        const groundTexture = new BABYLON.Texture("./src/images/logo.jpg", this.scene);
        groundTexture.uScale = this.publisherStore.get("getState").size[0];
        groundTexture.vScale = this.publisherStore.get("getState").size[2];
        const groundMaterial = new BABYLON.StandardMaterial(
            "groundMaterial",
            this.scene
        );
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#FFFFFF");
        groundMaterial.alpha = 0.5;
        groundMaterial.backFaceCulling = false;
        ground.material = groundMaterial;

        return ground;
    }

    private createCube = (cube: ICube, transparent = false): BABYLON.Mesh => {
        const cubeScene = BABYLON.MeshBuilder.CreateBox("cube", { size: this.publisherStore.get("getState").cubeSize });
        cubeScene.position = new BABYLON.Vector3(...cube.position);
        cubeScene.material = this.coloredMaterials[(transparent ? "T" : "") + cube.color];
        return cubeScene;
    }

    private createFigureFromState(): BABYLON.Mesh[] {
        const figureScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getState").figure.cubes) {
            const cube3D = this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getState").figure.position),
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
        for(const cube of this.publisherStore.get("getState").finalFigure.cubes) {
            const cube3D = this.createCube({
                position: vectorPlusVector(cube.position, this.publisherStore.get("getState").finalFigure.position),
                color: cube.color
            }, true);
            cube3D.enableEdgesRendering();
            cube3D.edgesWidth = 2;
            cube3D.edgesColor = new BABYLON.Color4(...[255, 255, 255, 0.4]);
            finalFigureScene.push(cube3D);
        }
        return finalFigureScene;
    }

    private createHeapFromState(): BABYLON.Mesh[] {
        const heapScene: BABYLON.Mesh[] = [];
        for(const cube of this.publisherStore.get("getState").heap) {
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
        this.publisherStore.get("getState").colors.forEach((color: string) => {
            materials[color] = this.createMaterial(color);
            materials["T" + color] = this.createMaterial(color, true);
        })
        return materials;
    }
}
