import { BgmManager } from './BgmManager';
import { ButtonClickSound } from './sounds/ButtonClickSound';

export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.bgmManager = new BgmManager(scene);
        //this.buttonClick = new ButtonClickSound(scene);
    }

    playBgm(key) {
        this.bgmManager.play(key);
    }

    stopBgm() {
        this.bgmManager.stop();
    }

    playClick() {
        //this.buttonClick.play();
    }

    playEffect(key) {
        //this.scene.sound.play(key);
    }
}
