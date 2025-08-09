import { bgmMap } from '@/core/sounds/bgmMap.js';

// core/sounds/BgmManager.js
export class BgmManager {
    constructor(scene, muteStore = null) {
        this.scene = scene;
        this.currentBgm = null;
        this.currentKey = null;
        this.currentBgmMap = null; // bgmMapを保持
        this.muteStore = muteStore;

        // muteStoreがある場合はそれを使用、ない場合はlocalStorageから読み込み
        if (this.muteStore) {
            this.isMuted = this.muteStore.bgmMuted;
        } else {
            this.isMuted = this.loadMuteState('bgmMuted', false);
        }
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

    play(sceneKey, bgmMapParam = null) {
        // bgmMapを保持（後でミュート解除時に使用）
        const targetBgmMap = bgmMapParam || bgmMap;
        this.currentBgmMap = targetBgmMap;

        const bgmInfo = targetBgmMap[sceneKey];
        if (!bgmInfo) return;

        // ミュート状態の場合は currentKey だけ保存して早期リターン
        if (this.isMuted) {
            this.currentKey = sceneKey;
            console.log(`BGM '${sceneKey}' is queued for playback (currently muted)`);
            return;
        }

        // ミュート中でない場合は通常の再生処理
        this.currentKey = sceneKey;
        this.stop();
        this.currentBgm = this.scene.sound.add(bgmInfo.key, { loop: bgmInfo.loop, volume: 0.1 });
        this.currentBgm.play();
        console.log(`BGM '${sceneKey}' started playing`);
    }

    stop() {
        if (this.currentBgm) {
            this.currentBgm.stop();
            this.currentBgm.destroy();
            this.currentBgm = null;
        }
        // stop()メソッドは物理的なBGM停止のみ行う
        // currentKeyはミュート処理やシーン変更時のみクリア
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
                this.play(this.currentKey, bgmMap);
            }
        }
    }

    setMute(muted) {
        this.isMuted = muted;
        this.handleMuteChange();
        this.saveMuteState();
    }

    // ミュート状態をトグル
    toggleMute() {
        this.setMute(!this.isMuted);
        return this.isMuted;
    }

    // ミュート状態変更時の処理
    handleMuteChange() {
        if (this.isMuted) {
            this.stop();
            console.log('BGM muted');
        } else {
            // ミュート解除時に前回のBGMを再生再開
            if (this.currentKey && this.currentBgmMap) {
                console.log(`Resuming BGM '${this.currentKey}' after unmute`);
                this.play(this.currentKey, this.currentBgmMap);
            } else if (this.currentKey) {
                console.log(`Attempting to resume BGM '${this.currentKey}' with default bgmMap`);
                this.play(this.currentKey, bgmMap);
            }
        }
    }

    // muteStoreとlocalStorageに保存
    saveMuteState() {
        if (this.muteStore) {
            this.muteStore.setBgmMuted(this.isMuted);
        } else {
            // フォールバック: localStorageに直接保存
            try {
                localStorage.setItem('mute_bgmMuted', JSON.stringify(this.isMuted));
            } catch (error) {
                console.warn('Failed to save mute state to localStorage:', error);
            }
        }
    }

    // 現在のミュート状態を取得
    getMuteState() {
        return this.isMuted;
    }

    // currentKeyをクリア（シーン変更時などに使用）
    clearCurrentKey() {
        this.currentKey = null;
        this.currentBgmMap = null;
    }

    // 完全停止（シーン変更時などに使用）
    stopAndClear() {
        this.stop();
        this.clearCurrentKey();
    }

    // リソース解放
    destroy() {
        this.stopAndClear();
        this.muteStore = null;
    }
}
