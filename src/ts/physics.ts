import {userCamera} from "./camera";
import {Raycaster, Vector3, Euler, Mesh, BoxGeometry, TextureLoader, MeshBasicMaterial} from "three";
import {inventory} from './inventory'
export class gamePhysics {
    private userCamera: userCamera
    private inventory
    private scene
    public playerMovement = {
        forward: false,
        left: false,
        backwards: false,
        right: false
    }
    public canJump = false
    public prevTime = performance.now();
    public velocity = new Vector3();
    public direction = new Vector3();
    public vertex = new Vector3();

    public initializePhysics(camera, scene, inventory) {
        this.userCamera = camera
        this.userCamera.camera.rotation.x = 0
        this.userCamera.camera.rotation.y = 0
        this.userCamera.camera.rotation.z = 0
        this.scene = scene
        this.inventory = inventory
        window.addEventListener('keydown', this.keyDown.bind(this), false)
        window.addEventListener('keyup', this.keyUp.bind(this), false)
        window.addEventListener( 'click', (e) => {
            if (e.shiftKey) {
                this.placeBlock()
            } else if (this.userCamera.controls.isLocked) {
                this.hitBlock()
            }  else {
                this.userCamera.controls.lock();
            }
        }, false );
    }

    public doPhysics() {
        if ( true ) {
            var intersections = this.isCollisionDetectionGround()
            var time = performance.now();
            var delta = ( time - this.prevTime ) / 1000;
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 100.0 * delta * .1; // 100.0 = mass, .1 for adjusting gravity
            this.direction.z = Number( this.playerMovement.forward ) - Number( this.playerMovement.backwards );
            this.direction.x = Number( this.playerMovement.right ) - Number( this.playerMovement.left );
            this.direction.normalize(); // this ensures consistent movements in all directions
            if ( this.playerMovement.forward || this.playerMovement.backwards ) this.velocity.z -= this.direction.z * 400.0 * delta;
            if ( this.playerMovement.left || this.playerMovement.right ) this.velocity.x -= this.direction.x * 400.0 * delta;
            if ( intersections === true ) {
                this.velocity.y = Math.max( 0, this.velocity.y );
                this.canJump = true;
            }
            this.userCamera.controls.moveRight( - this.velocity.x * delta );
            this.userCamera.controls.moveForward( - this.velocity.z * delta );
            this.userCamera.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior
            if ( this.isCollisionDetectionGround() ) {
                this.velocity.y = 0;
                //this.userCamera.controls.getObject().position.y = 2;
                this.canJump = true;
            }
            this.prevTime = time;
        }
    }


    private keyDown(e) {
        switch(e.keyCode) {
            case 49:
                this.userCamera.buildTexture = new TextureLoader().load("/src/ts/res/blocks/dirt.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 0
                console.log(this.inventory)
                break
            case 50:
                this.userCamera.buildTexture = new TextureLoader().load("/src/ts/res/blocks/bricks/time-1.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 1
                break
            case 51:
                this.userCamera.buildTexture = new TextureLoader().load("src/ts/res/blocks/planks/time-1-1.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 2
                break
            case 52:
                this.userCamera.buildTexture = new TextureLoader().load("src/ts/res/blocks/stone/time-1.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 3
                break
            case 53:
                this.userCamera.buildTexture = new TextureLoader().load("src/ts/res/blocks/tiles/time-1.png",() => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 4
                break
            case 54:
                this.userCamera.buildTexture = new TextureLoader().load("src/ts/res/blocks/tiles-detail/time-3-1.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 5
                break
            case 55:
                this.userCamera.buildTexture = new TextureLoader().load("src/ts/res/blocks/tiles-large/time-1-1.png", () => {this.userCamera.buildMaterial =  new MeshBasicMaterial({map: this.userCamera.buildTexture})})
                this.inventory.playerSelectedSlot = 6
                break
            case 32:
                if ( this.canJump === true ) this.velocity.y += 40;
                this.canJump = false;
                break
            case 38: // up
            case 87: // w
                this.playerMovement.forward = true;
                break;
            case 37: // left
            case 65: // a
                this.playerMovement.left = true;
                break;
            case 40: // down
            case 83: // s
                this.playerMovement.backwards = true;
                break;
            case 39: // right
            case 68: // d
                this.playerMovement.right = true;
                break;
            default:
        }
    }

    private keyUp(e) {
        switch(e.keyCode) {
            case 38: // up
            case 87: // w
                this.playerMovement.forward = false;
                break;
            case 37: // left
            case 65: // a
                this.playerMovement.left = false;
                break;
            case 40: // down
            case 83: // s
                this.playerMovement.backwards = false;
                break;
            case 39: // right
            case 68: // d
                this.playerMovement.right = false;
                break;
            default:
        }
    }

    private gravityOnUser() {
        this.userCamera.camera.position.y -= .1
    }

    private isCollisionDetectionGround() {
        const newPoint = this.userCamera.camera.position.clone();
        newPoint.y -= 2
        for (var vertexIndex = 0; vertexIndex < 1; vertexIndex++) {
            var ray = new Raycaster( newPoint, new Vector3(0,-1,0), 0, 3 );
            var collisionResults = ray.intersectObjects( this.scene.children[0].children );
            if ( collisionResults.length > 0)  {
                return true
            }
        }
        return false
    }

    private hitBlock() {
        const blockInView = this.userCamera.getBlockInView().object
        if (blockInView) {
            this.removeBlock(blockInView)
            // this.inventory.addToInventory(blockInView.material.map.uuid, 20)
        }
    }


    private removeBlock(mesh) {
        this.scene.children[0].remove(mesh)
        mesh.geometry.dispose()
        mesh.material.dispose()
        mesh = undefined
    }

    private placeBlock() {
        const blockInView = this.userCamera.getBlockInView()
        if (blockInView) {
            const blockObject = blockInView.object
            const box = new Mesh(new BoxGeometry(2, 2, 2), this.userCamera.buildMaterial)
            box.position.set(blockObject.position.x, blockObject.position.y + 2, blockObject.position.z)
            this.scene.children[0].add(box)
        }
    }
}
