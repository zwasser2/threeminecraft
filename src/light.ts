import {DirectionalLight} from "three";

export class light {
    public initializeLighting(scene) {
        const light = new DirectionalLight(0xffffff, 1.0)
        light.position.set(100, 100, 100)
        scene.add(light)
    }
}