export class BgmManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBgm = null;
    }

    play(key) {
        if (this.currentBgm) {
            this.currentBgm.stop();
        }
        this.currentBgm = this.scene.sound.add(key, { loop: true, volume: 0.5 });
        this.currentBgm.play();
    }

    stop() {
        if (this.currentBgm) {
            this.currentBgm.stop();
            this.currentBgm = null;
        }
    }
}
