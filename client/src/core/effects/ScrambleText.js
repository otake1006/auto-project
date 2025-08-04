const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';

export class ScrambleText {
    constructor(scene, x, y, fontSize = 24) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;

        this.textObject = scene.add
            .text(x, y, '', {
                fontFamily: 'DotGothic16',
                fontSize: `${fontSize}px`,
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4,
            })
            .setOrigin(0.5);
    }

    showText(targetText, duration = 1000) {
        this.targetText = targetText;
        this.currentText = Array(targetText.length).fill('');
        this.frame = 0;
        this.maxFrame = Math.ceil(duration / 50); // アニメーションフレーム数

        this.timer = this.scene.time.addEvent({
            delay: 50,
            repeat: this.maxFrame,
            callback: this.updateText,
            callbackScope: this,
        });
    }

    updateText() {
        const progress = this.frame / this.maxFrame;
        for (let i = 0; i < this.targetText.length; i++) {
            if (Math.random() < progress) {
                this.currentText[i] = this.targetText[i];
            } else if (this.currentText[i] !== this.targetText[i]) {
                const randChar = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
                this.currentText[i] = randChar;
            }
        }

        this.textObject.setText(this.currentText.join(''));
        this.frame++;

        if (this.frame >= this.maxFrame) {
            this.textObject.setText(this.targetText);
            this.timer.remove(false);
        }
    }

    destroy() {
        this.textObject.destroy();
    }
}
