// scenes/BootScene.js
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.spritesheet('load', 'Loading.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });
    }

    create() {
        this.anims.create({
            key: 'loading',
            frames: this.anims.generateFrameNumbers('load'),
            frameRate: 8, // フレーム速度
            repeat: -1, // ループ
        });
        this.scene.start('PreloadScene');
    }
}
