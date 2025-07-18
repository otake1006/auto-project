export class BaseSound {
    constructor(scene, key) {
        this.scene = scene;
        this.key = key;
        this.sound = this.scene.sound.add(this.key);
    }

    play(config = {}) {
        this.sound.play(config);
    }

    stop() {
        this.sound.stop();
    }
}
