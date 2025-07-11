// src/ui/StatusIcon.js
export class StatusIcon extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config) {
        super(scene, x, y);

        this.config = config; // { key, frame, count, useSpriteSheet }

        this.icon = config.useSpriteSheet
            ? scene.add.sprite(0, 0, config.key, config.frame)
            : scene.add.image(0, 0, config.key);

        this.icon.setDisplaySize(32, 32);

        this.countText = scene.add
            .text(0, 0, `${config.count}`, {
                fontSize: '14px',
                fontFamily: 'DotGothic16',
                color: '#fff',
                backgroundColor: 'rgba(0,0,0,0.4)',
                padding: { left: 2, right: 2 },
            })
            .setOrigin(1, 1)
            .setPosition(16, 16); // 右下に配置

        this.add([this.icon, this.countText]);
        this.updateCount(config.count ?? 0);
        scene.add.existing(this);
    }

    updateCount(newCount) {
        if (newCount > 0) {
            this.setVisible(true);
            this.countText.setText(`${newCount}`);
        } else {
            this.setVisible(false);
        }
    }

    setIcon(key, frame = null, useSpriteSheet = false) {
        this.icon.setTexture(key, frame);
        this.config.useSpriteSheet = useSpriteSheet;
    }
}
