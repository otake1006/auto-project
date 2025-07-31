// core/sounds/BgmManager.js
export class BgmManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBgm = null;
        this.currentKey = null;
        this.isMuted = false;
    }

    play(sceneKey, bgmMap) {
        const bgmInfo = bgmMap[sceneKey];
        if (!bgmInfo || this.isMuted) return;

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

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stop();
        } else {
            // 再生再開はシーンごとに制御が必要なので明示的に play を呼ぶこと
        }
    }
}
