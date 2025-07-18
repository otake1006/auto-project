import { AnimationBase } from '../AnimationBase.js';
export class CastEffectAnimation extends AnimationBase {
    constructor(scene, x, y, textureKey, animKey) {
        super(scene);
        this.x = x;
        this.y = y;
        this.textureKey = textureKey;
        this.animKey = animKey;
    }

    async play() {
        return new Promise((resolve) => {
            const sprite = this.scene.add.sprite(this.x, this.y, this.textureKey);
            sprite.play(this.animKey);

            sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                sprite.destroy();
                resolve();
            });
        });
    }
}
