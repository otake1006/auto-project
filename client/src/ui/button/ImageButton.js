import { UIButtonBase } from './UIButtonBase.js';

export class ImageButton extends UIButtonBase {
    _setup() {
        this.button = this.scene.add.image(this.x, this.y, this.key);

        this.applyInteractive({
            onHover: (btn) => {
                if (this.options.hoverImageKey)
                    btn.setTexture(this.options.hoverImageKey);
            },
            onOut: (btn) => {
                btn.setTexture(this.key);
            },
            onClick: (btn) => {
                if (this.options.downImageKey)
                    btn.setTexture(this.options.downImageKey);
                this.options.onClick?.();
            },
        });

        if (this.options.tweens) this.applyTweens();
    }
}