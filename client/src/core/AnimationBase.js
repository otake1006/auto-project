export class AnimationBase {
    constructor(scene) {
        this.scene = scene;
    }

    // 継承先で上書きする
    async play() {
        throw new Error('play() must be implemented');
    }

    wait(ms) {
        return new Promise((resolve) => {
            this.scene.time.delayedCall(ms, resolve);
        });
    }
}
