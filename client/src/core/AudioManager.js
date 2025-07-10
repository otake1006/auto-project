export class AudioManager {
    constructor(scene) {
        this.scene = scene;
    }

    playBgm(key) {
        this.scene.sound.play(key, { loop: true, volume: 0.1 });
    }

    fadeOutBgm() {
        const bgm = this.scene.sound.get('battle');
        if (bgm)
            this.scene.tweens.add({
                targets: bgm,
                volume: 0,
                duration: 1000,
                onComplete: () => bgm.stop(),
            });
    }

    cleanup() {
        this.fadeOutBgm();
    }
}
