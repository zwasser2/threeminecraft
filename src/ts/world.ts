import {BoxGeometry, Mesh, AxesHelper, Vector3} from "three";
import THREE = require("three");
import {userCamera} from "./camera";

export class world {
    public buildWorld(scene) {
        const worldSize = 50
        const blockSize = 2
        let box : Mesh
        const group = new THREE.Group()
        const texture = new THREE.TextureLoader().load("src/ts/res/blocks/dirt.png")
        const material = new THREE.MeshBasicMaterial({map: texture})
        for (let i = 0; i < worldSize; i ++) {
            for (let j = 0; j < worldSize; j ++) {
                // for (let k = 0; k < worldSize; k ++) {
                    box = new Mesh(new BoxGeometry(blockSize, blockSize, blockSize), material)
                    box.position.set(blockSize * i, 0, blockSize * j)
                    group.add(box)
                // }
            }
        }
        scene.add(group)
    }
}