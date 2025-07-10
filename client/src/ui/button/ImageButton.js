import { UIButtonBase } from './UIButtonBase.js';

export class ImageButton extends UIButtonBase {
    _setup() {
        this.button = this.scene.add.image(this.x, this.y, this.key);

        this.applyInteractive({
            onHover: (btn) => {
                if (this.options.hoverImageKey) btn.setTexture(this.options.hoverImageKey);
                this.options.onHover?.(btn);
            },
            onOut: (btn) => {
                btn.setTexture(this.key);
                this.options.onOut?.(btn);
            },
            onClick: (btn) => {
                if (this.options.downImageKey) btn.setTexture(this.options.downImageKey);
                this.options.onClick?.(btn);
            },
        });

        if (this.options.tweens) this.applyTweens();
    }
}
