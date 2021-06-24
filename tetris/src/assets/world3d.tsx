import * as BABYLON from "babylonjs";
import {Axis, Vector, vectorsAdd} from "./types";
import {useStore} from "../store/store";
import {autorun, comparer, reaction} from "mobx";

const logoURL =
    "https://media-exp1.licdn.com/dms/image/C4D0BAQFQAzVVyH8uag/company-logo_200_200/0/1601538871335?e=2159024400&v=beta&t=7tQFAN-0QZkE4YFDcynWFTZX6EzRWrC7X7XZtJmH6v4";
export interface IWorld3d {

}

export class World3d implements IWorld3d {
    private box: BABYLON.Mesh;
    private figure: BABYLON.Mesh[];
    private ground: BABYLON.Mesh[];
    private material: BABYLON.StandardMaterial;
    // private material2: BABYLON.StandardMaterial;
    private scene: BABYLON.Scene;
    private animation?: BABYLON.AnimationGroup;
    private camera: BABYLON.ArcRotateCamera;
    private store: ReturnType<typeof useStore>;

    public constructor(canvas: HTMLCanvasElement, store: ReturnType<typeof useStore>) {
        this.store = store;
        const engine = new BABYLON.Engine(canvas);

        // create scene
        this.scene = new BABYLON.Scene(engine);
        // create camera
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI/8,
            7*Math.PI/16,
            20,
            BABYLON.Vector3.Zero(),
            this.scene
        );
        this.camera.attachControl(canvas, true);
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        // // create light
        const light = new BABYLON.HemisphericLight(
            "HemiLight",
            new BABYLON.Vector3(0, 2, 2),
            this.scene
        );
        light.intensity = 0.8;
        // // create ground
        const ground = BABYLON.GroundBuilder.CreateGround(
            "ground",
            {
                width: 5,
                height: 5
            },
            this.scene
        );
        ground.position.y = -5;

        // create material
        const groundMaterial = new BABYLON.StandardMaterial(
            "groundMat",
            this.scene
        );

        groundMaterial.diffuseColor = BABYLON.Color3.FromHexString("#cccccc");
        // get texture for ground
        const groundTexture = new BABYLON.Texture(logoURL, this.scene);
        groundMaterial.diffuseTexture = groundTexture;
        ground.material = groundMaterial;

        this.box = this.createBox();
        this.figure = this.createFigure();
        // this.material = this.createMaterial("#ff0000");
        // this.material2 = this.createMaterial("#0000ff");
        this.material = new BABYLON.StandardMaterial("NoMaterial", this.scene);
        this.material.alpha = 0;
        this.box.material = this.material;
        // this.sphere.material = this.material2;

        this.scene.registerBeforeRender(() => {
            // if (this.figure.position.y >= -4.5) {
            //     this.figure.position.y -= 0.02;
            // } else {
            //     this.createFigure()
            // }
            // if (store.figure.position[1] >= -4.5) {
            //     store.moveFigure(Axis.Y, -0.02);
            // } else {
            //     // store.figure.
            //     // this.createFigure()
            // }

            this.store.moveFigure(Axis.Y, -0.02);

            // render
            // this.figure.position = new BABYLON.Vector3(...store.figure.position);
            // this.figure.rotation = new BABYLON.Vector3(...store.figure.rotation);
            // for(const cube of store.figure.data) {
            //
            // }
        });

        // reaction(() => {
        //     console.log("reaction");
        //     return this.store.figure
        // }, (figure) => {
        //     console.log("reaction2");
        //     if (this.figure.length !== this.store.figure.data.length) {
        //         this.figure = this.createFigure();
        //     }
        //     this.figure.forEach((cubeScene, idx) => {
        //         cubeScene.position = new BABYLON.Vector3(
        //             ...vectorsAdd(
        //                 this.store.figure.position,
        //                 this.store.figure.data[idx]
        //             )
        //         );
        //     })
        // }, {
        //     equals: comparer.structural
        // });

        autorun(() => {
            if (this.figure.length !== this.store.figure.data.length) {
                this.figure = this.createFigure();
            }
            this.figure.forEach((cubeScene, idx) => {
                cubeScene.position = new BABYLON.Vector3(
                    ...vectorsAdd(
                        this.store.figure.position,
                        this.store.figure.data[idx]
                    )
                );
            })
        });

        this.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case BABYLON.KeyboardEventTypes.KEYDOWN:
                    console.log("KEY DOWN: ", kbInfo.event.key);
                    switch (kbInfo.event.keyCode) {
                        // up
                        case 38:
                            store.moveFigure(Axis.X, -1);
                            break;
                        // down
                        case 40:
                            store.moveFigure(Axis.X, 1);
                            break;
                        // right
                        case 39:
                            store.moveFigure(Axis.Z, 1);
                            break;
                        // left
                        case 37:
                            store.moveFigure(Axis.Z, -1);
                            break;
                    }
                    break;
                case BABYLON.KeyboardEventTypes.KEYUP:
                    console.log("KEY UP: ", kbInfo.event.keyCode);
                    break;
            }
        });

        // this.camera.setTarget(this.box.position);
        engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private createBox() {
        const box = BABYLON.MeshBuilder.CreateBox("box", {
            width: 5,
            height: 10,
            depth: 5
        });
        box.position = BABYLON.Vector3.Zero();
        box.enableEdgesRendering();
        box.edgesWidth = 4.0;
        box.edgesColor = new BABYLON.Color4(255, 255, 255, 0.2);

        return box;
    }

    private createFigure(): BABYLON.Mesh[] {
        const createCube = (position: Vector): BABYLON.Mesh => {
            const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 });
            cube.position = new BABYLON.Vector3(...position);
            return cube;
        }
        const figure: BABYLON.Mesh[] = [];
        for(const cube of this.store.figure.data) {
            figure.push(createCube(vectorsAdd(cube, this.store.figure.position)));
        }
        // figure.push(createCube([-1, 0, 0]));
        // figure.push(createCube([0, 0, 0]));
        // figure.push(createCube([1, 0, 0]));
        // figure.push(createCube([1, 0, 1]));

        // return BABYLON.Mesh.MergeMeshes(figure) ?? figure[0];
        return figure;
    }

    private createMaterial(hex: string) {
        this.material = new BABYLON.StandardMaterial("box_mat", this.scene);
        this.material.diffuseColor = BABYLON.Color3.FromHexString(hex);
        return this.material;
    }
}
