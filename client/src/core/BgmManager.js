// core/sounds/BgmManager.js
export class BgmManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBgm = null;
        this.currentKey = null;
    }

    play(sceneKey, bgmMap) {
        const bgmInfo = bgmMap[sceneKey];
        if (!bgmInfo) return;

        if (this.currentKey === sceneKey) return; // 同じBGMはスキップ

        this.stop();
        this.currentBgm = this.scene.sound.add(bgmInfo.key, { loop: bgmInfo.loop, volume: 0.1 });
        this.currentBgm.play();
        this.currentKey = sceneKey;
    }

    stop() {
        console.log('stopされたよ');

        if (this.currentBgm) {
            console.log('stopされた１１');
            this.currentBgm.stop();
            this.currentBgm.destroy();
            this.currentBgm = null;
        }
        this.currentKey = null;
    }

    fadeOut(duration = 500, onComplete = null) {
        if (!this.currentBgm) {
            if (onComplete) onComplete();
            return;
        }

        this.scene.tweens.add({
            targets: this.currentBgm,
            volume: 0,
            duration,
            onComplete: () => {
                this.stop();
                if (onComplete) onComplete();
            },
        });
    }
}
