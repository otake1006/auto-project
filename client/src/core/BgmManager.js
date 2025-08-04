import { bgmMap } from '@/core/sounds/bgmMap.js';

// core/sounds/BgmManager.js
export class BgmManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBgm = null;
        this.currentKey = null;
        // localStorageから直接読み込み（Piniaが使えない場合のフォールバック）
        this.isMuted = this.loadMuteState('bgmMuted', false);
    }

    loadMuteState(key, defaultValue) {
        try {
            const stored = localStorage.getItem(`mute_${key}`);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            console.warn(`Failed to load ${key} from localStorage:`, error);
            return defaultValue;
        }
    }

    play(sceneKey, bgmMap) {
        const bgmInfo = bgmMap[sceneKey];
        if (!bgmInfo) return;

        // ミュート状態でも currentKey は保存する
        this.currentKey = sceneKey;
        
        if (this.isMuted) return;

        this.stop();
        this.currentBgm = this.scene.sound.add(bgmInfo.key, { loop: bgmInfo.loop, volume: 0.1 });
        this.currentBgm.play();
    }

    stop() {
        console.log('stopされたよ');

        if (this.currentBgm) {
            console.log('stopされた１１');
            this.currentBgm.stop();
            this.currentBgm.destroy();
            this.currentBgm = null;
        }
        // ミュート時はcurrentKeyを保持して再生再開に使用
        if (!this.isMuted) {
            this.currentKey = null;
        }
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
            // ミュート解除時に前回のBGMを再生再開
            if (this.currentKey) {
                if (this.currentKey) {
                    this.play(this.currentKey, bgmMap);
                }
            }
        }
    }

    setMute(muted) {
        this.isMuted = muted;
        if (this.isMuted) {
            this.stop();
        } else {
            // ミュート解除時に前回のBGMを再生再開
            console.log(this.currentKey);
            if (this.currentKey) {
                this.play(this.currentKey, bgmMap);
            }
        }
    }
}
