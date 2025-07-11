import { UIButtonBase } from '../UIButtonBase.js';

export class SpriteButton extends UIButtonBase {
    _setup() {
        const frame = this.options.defaultFrame || 0;
        this.button = this.scene.add.sprite(this.x, this.y, this.key, frame);

        this.applyInteractive({
            onHover: this.options.onHover,
            onOut: this.options.onOut,
            onClick: this.options.onClick,
        });

        if (this.options.tweens) {
            this.applyTweens();
        }
    }
}