export default class StatusBar {
    constructor(scene, x, y, width, height, color, label) {
        this.scene = scene;
        this.bg = scene.add.rectangle(x, y, width, height, 0x333333).setOrigin(0, 0.5);
        this.bar = scene.add.rectangle(x, y, width, height, color).setOrigin(0, 0.5);
        this.label = scene.add.text(x + width + 10, y, label, {
            fontSize: '14px',
            color: '#ffffff',
        });
        this.maxWidth = width;
    }

    update(ratio) {
        const newWidth = this.maxWidth * ratio;
        this.scene.tweens.add({
            targets: this.bar,
            displayWidth: newWidth,
            duration: 300,
            ease: 'Power2',
        });
    }
}
