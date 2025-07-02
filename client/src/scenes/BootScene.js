// scenes/BootScene.js
import { bgmMap } from '@/core/sounds/bgmMap';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        Object.values(bgmMap).forEach(({ key, file }) => {
            this.load.audio(key, `assets/sounds/${file}`);
        });

        // this.load.audio('click', '/sounds/ui/click.mp3');
        // this.load.audio('win', '/sounds/ui/win.mp3');
    }

    create() {
        this.scene.start('StartScene');
    }
}
