import {
    AxesHelper, BoxGeometry,
    DirectionalLight, Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import THREE = require("three");
import { world } from "./world";
import { light } from "../light";
import { userCamera } from "./camera";
import {gamePhysics} from "./physics";
import { inventory } from "./inventory"


export class BaseScene {
    public scene = new Scene()
    public renderer = new WebGLRenderer()
    private userCamera: userCamera = new userCamera()
    private light: light = new light()
    private world: world = new world()
    private gamePhysics: gamePhysics = new gamePhysics()
    private inventory: inventory = new inventory()


    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        this.world.buildWorld(this.scene)
        this.gamePhysics.initializePhysics(this.userCamera, this.scene, this.inventory)
        this.light.initializeLighting(this.scene)
        this.userCamera.initializeCamera(this.scene, this.renderer)
        this.render()
    }


    public render() {
        requestAnimationFrame(this.render.bind(this))
        this.userCamera.highlightBlockLookingAt()
        this.renderer.render(this.scene, this.userCamera.camera)
        this.gamePhysics.doPhysics()
    }
}



