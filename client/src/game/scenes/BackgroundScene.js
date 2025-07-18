// scenes/BootScene.js
export class BackgroundScene extends Phaser.Scene {
    constructor() {
        super('BackgroundScene');
    }

    preload() {
        this.add.image(0, 0, 'background').setOrigin(0);
    }

    create() {}
}
