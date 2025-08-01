export class SoundEventManager {
    constructor(basePath = '/assets/sounds/') {
        this.basePath = basePath;
        this.cache = {};
        this.bgmAudio = null;

        // localStorageから直接読み込み（Piniaが使えない場合のフォールバック）
        this.isMutedSe = this.loadMuteState('seMuted', false);
        this.isMutedBgm = this.loadMuteState('bgmMuted', false);
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

    play(fileName) {
        if (this.isMutedSe || !fileName) return;
        if (!this.cache[fileName]) {
            this.cache[fileName] = new Audio(this.basePath + fileName);
        }

        const audio = this.cache[fileName];
        audio.currentTime = 0;
        audio.play();
    }

    playClick() {
        this.play('click.mp3');
    }

    playConfirm() {
        this.play('confirm.mp3');
    }

    playWin() {
        this.play('win.mp3');
    }

    playLose() {
        this.play('lose.mp3');
    }

    playLevelUp() {
        this.play('levelup.mp3');
    }

    playBgm() {
        const fileName = 'Future_1.mp3';
        if (this.isMutedBgm) return;

        if (!this.bgmAudio) {
            this.bgmAudio = new Audio(this.basePath + fileName);
            this.bgmAudio.loop = true;
        }

        this.bgmAudio.currentTime = 0;
        this.bgmAudio.play();
    }

    stopBgm() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
        }
    }

    // ミュート制御
    toggleMuteSe() {
        this.isMutedSe = !this.isMutedSe;
    }

    toggleMuteBgm() {
        this.isMutedBgm = !this.isMutedBgm;
        if (this.isMutedBgm) {
            this.stopBgm();
        } else {
            this.playBgm();
        }
    }

    setMuteSe(mute) {
        this.isMutedSe = mute;
    }

    setMuteBgm(mute) {
        this.isMutedBgm = mute;
        if (mute) this.stopBgm();
        else this.playBgm();
    }
}

export const sm = new SoundEventManager();
