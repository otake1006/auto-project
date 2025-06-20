export class Effect extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    /** 子クラスでオーバーライドして演出定義 */
    play() {
        console.warn('Effect.play() は子クラスで実装してください');
    }

    destroyAfter(duration) {
        this.scene.time.delayedCall(duration, () => this.destroy(), [], this);
    }
}
