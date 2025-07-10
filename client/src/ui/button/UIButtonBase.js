import { sm } from '@/core/SoundManager';

export class UIButtonBase {
    constructor(scene, x, y, key, options = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.key = key; // デフォルトの画像 or フレームキー
        this.options = options;

        this.button = null;
        this._setup();
    }

    _setup() {
        throw new Error('_setup() must be implemented by subclass');
    }

    applyInteractive({ onHover, onOut, onClick }) {
        this.button.setInteractive({ useHandCursor: true });

        this.button.on('pointerover', () => {
            if (this.options.hoverFrame && this.button.setFrame)
                this.button.setFrame(this.options.hoverFrame);
            if (this.options.sounds?.hover)
                sm.play(this.options.sounds.hover);
            onHover?.(this.button);
        });

        this.button.on('pointerout', () => {
            if (this.options.defaultFrame && this.button.setFrame)
                this.button.setFrame(this.options.defaultFrame);
            onOut?.(this.button);
        });

        this.button.on('pointerdown', () => {
            if (this.options.downFrame && this.button.setFrame)
                this.button.setFrame(this.options.downFrame);
            if (this.options.sounds?.click)
                sm.play(this.options.sounds.click);
            onClick?.(this.button);
        });
    }

    applyTweens() {
        if (this.options.tweens) {
            this.options.tweens.forEach((tweenConfig) => {
                this.scene.tweens.add({
                    targets: this.button,
                    ...tweenConfig,
                });
            });
        }
    }

    getGameObject() {
        return this.button;
    }
}