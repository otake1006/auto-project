export default class StatusBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, color, label) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.maxValue = 1;
        this.currentValue = 1;
        this.maxWidth = width;
        // 背景バー
        this.bg = scene.add.rectangle(0, 0, width, height, 0x333333).setOrigin(0, 0.5);

        // ステータスバー（色付き）
        this.bar = scene.add.rectangle(0, 0, width, height, color).setOrigin(0, 0.5);

        // ラベル（左側）
        this.label = scene.add
            .text(-width + 75, 0, label, {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0, 0.5);

        // 値のラベル（中央）
        this.statusLabel = scene.add
            .text(width / 2, 0, '1/1', {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0.5, 0.5);

        // コンテナに追加
        this.add([this.bg, this.bar, this.label, this.statusLabel]);
        scene.add.existing(this);
    }

    update(current, max) {
        const ratio = Phaser.Math.Clamp(current / max, 0, 1);
        const newWidth = this.maxWidth * ratio;

        this.statusLabel.setText(`${current}/${max}`);

        this.scene.tweens.add({
            targets: this.bar,
            displayWidth: newWidth,
            duration: 300,
            ease: 'Power2',
        });
    }
}
