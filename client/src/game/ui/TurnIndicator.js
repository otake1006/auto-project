import { ScrambleText } from '@/core/effects/ScrambleText';

export class TurnIndicator {
    constructor(scene) {
        this.scene = scene;

        this.text = new ScrambleText(this.scene, this.scene.cameras.main.centerX, 20);
        this.text.textObject.setVisible(false); // ← 内部の textObject にアクセス
    }

    showTurn(turn) {
        this.text.textObject.setAlpha(0);
        this.text.textObject.setVisible(true);
        this.text.showText(`TURN ${turn}`); // ← setText() ではなく showText() を使う

        this.scene.tweens.add({
            targets: this.text.textObject, // ← textObject に対して tween をかける
            alpha: 1,
            yoyo: true,
            duration: 800,
            repeat: 1,
            onComplete: () => {
                this.text.textObject.setVisible(false);
            },
        });
    }

    destroy() {
        this.text.destroy();
    }
}
