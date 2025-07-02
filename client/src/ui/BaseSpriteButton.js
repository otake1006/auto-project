export class BaseSpriteButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        this.setInteractive({ useHandCursor: true });
        scene.add.existing(this);

        this._enabled = true;
        this.initEvents();
    }

    initEvents() {
        this.on('pointerover', this.onHoverIn, this);
        this.on('pointerout', this.onHoverOut, this);
        this.on('pointerdown', this.onPress, this);
        this.on('pointerup', this.onRelease, this);
    }

    onHoverIn() {}
    onHoverOut() {}
    onPress() {}
    onRelease() {}

    setEnabled(flag) {
        this._enabled = flag;
        this.setInteractive(flag);
        this.setAlpha(flag ? 1 : 0.5);
    }

    isEnabled() {
        return this._enabled;
    }
}
