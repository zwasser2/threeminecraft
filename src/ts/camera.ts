import {BoxGeometry, Mesh, PerspectiveCamera} from "three";
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls";
import {
    Scene,
    WebGLRenderer,
    Raycaster,
    Vector3,
    MeshBasicMaterial,
    TextureLoader,
    ImageUtils
} from "three"

export class userCamera {
    public camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    public controls = new PointerLockControls( this.camera, document.body );
    public defaultTexture = new TextureLoader().load("src/ts/res/blocks/dirt.png")
    public defaultMaterial = new MeshBasicMaterial({map: this.defaultTexture})
    public buildTexture = this.defaultTexture
    public buildMaterial = this.defaultMaterial
    private selectedDirectTexture =  new TextureLoader().load("src/ts/res/blocks/dirtSelected.png")
    private selectedMaterial = new MeshBasicMaterial({map: this.selectedDirectTexture})
    private renderer: WebGLRenderer
    private oldBlock = new Mesh()
    private initialCameraPosition = {
        x: 10,
        y: 100,
        z: 10
    }
    public scene: Scene
    private userSize = {
        x: 2,
        y: 4,
        z: 2
    }

    public initializeCamera(scene: Scene, renderer: WebGLRenderer) {
        this.renderer = renderer
        this.scene = scene
        this.controls = new PointerLockControls(this.camera, this.renderer.domElement)
        this.camera.position.set(this.initialCameraPosition.x, this.initialCameraPosition.y, this.initialCameraPosition.z)
        this.camera.lookAt(this.scene.position)
        this.camera['mesh'] = new Mesh(new BoxGeometry(this.userSize.x, this.userSize.y, this.userSize.z))
        window.addEventListener('resize', this.onViewResize.bind(this), false)
    }

    private onViewResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public highlightBlockLookingAt() {
        const blockInView = this.getBlockInView()
        if (blockInView && this.oldBlock.uuid !== blockInView.uuid) {
            blockInView.material = this.selectedMaterial
            if (this.oldBlock) this.oldBlock.material = this.defaultMaterial
            this.oldBlock = blockInView
            // blockInView.material.needsUpdate = true;
        }
    }

    public getBlockInView() {
        const newPoint = this.camera.position.clone();
        newPoint.y -= 2
        for (var vertexIndex = 0; vertexIndex < 1; vertexIndex++) {
            const ray = new Raycaster()
            ray.setFromCamera(new Vector3(), this.camera)
            var collisionResults = ray.intersectObjects( this.scene.children[0].children );
            if ( collisionResults.length > 0)  {
                console.log(collisionResults);
                return  collisionResults[collisionResults.length - 1].object
            }
        }
        return undefined
    }
}