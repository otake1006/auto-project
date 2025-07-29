import { BgmManager } from './BgmManager';
import { ButtonClickSound } from './sounds/ButtonClickSound';

export class SoundEventManager {
    constructor(basePath = '/assets/sounds/') {
        this.basePath = basePath;
        this.cache = {};
    }

    play(fileName) {
        if (!fileName) return;
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
        this.play('Future_1.mp3');
    }
}

export const sm = new SoundEventManager();
