import { Effect } from '@/core/Effect.js';

export class TextEffect extends Effect {
    constructor(scene, x, y, textContent, options = {}) {
        super(scene, x, y);
        this.textContent = textContent;
        this.options = {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            duration: 1500,
            scaleFrom: 0.5,
            scaleTo: 1.2,
            onComplete: () => {},
            ...options,
        };
    }

    play() {
        const t = this.options;
        const text = this.scene.add
            .text(0, 0, this.textContent, {
                fontSize: t.fontSize,
                fontFamily: t.fontFamily,
                color: t.color,
                stroke: t.stroke,
                strokeThickness: t.strokeThickness,
            })
            .setOrigin(0.5);
        this.add(text);

        this.setAlpha(0);
        this.setScale(t.scaleFrom);

        this.scene.tweens.add({
            targets: this,
            scale: t.scaleTo,
            alpha: 1,
            ease: 'Back.Out',
            duration: t.duration,
            onComplete: () => {
                this.destroy();
                if (typeof t.onComplete === 'function') t.onComplete();
            },
        });
    }
}
