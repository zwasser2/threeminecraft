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
const maxStackSize = 64
export class inventory {
    public userInventory = new Array(64).fill([undefined, undefined])
    public playerSelectedSlot: number = 0
    // Reduce this to hash table?
    public addToInventory (id: number, amount: number) {
        for (const [index, inventorySpace] of this.userInventory.entries()) {
            const stackIndex = this.findAvaliableLocationNewMaterials(id, amount)
            const nextEmptyIndex = this.findNextEmptyLocation()
            console.log(stackIndex);
            console.log(nextEmptyIndex);
            //TODO MERGE NEXTEMPTYINDEX LOGIC INTO FIND NEXT EMPTY LOCATION LOGIC
            if (stackIndex !== -1) {
                this.userInventory[index][1] += amount
                return 1
            } else if (nextEmptyIndex !== -1) {
                this.userInventory[stackIndex] = [id, amount]
                return 1
            }
            return -1
        }
    }

    public findNextEmptyLocation() {
        for (const [index, inventorySpace] of this.userInventory.entries()) {
            if (typeof inventorySpace[0] === 'undefined') {
                return index
            }
        }
        return -1
    }

    public findAvaliableLocationNewMaterials(id: number, amount: number) {
        for (const [index, inventorySpace] of this.userInventory.entries()) {
            if (inventorySpace[0] === id && amount + inventorySpace[1] <= maxStackSize) {
                return index
            } 
        }
        return -1
    }
}