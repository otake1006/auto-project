import { sm } from '@/core/SoundManager';

export class TextButton extends Phaser.GameObjects.Container {
    constructor(
        scene,
        x,
        y,
        text,
        {
            width = 200,
            height = 50,
            borderColor = 0xffffff,
            bgColor = 0x000000,
            textColor = '#ffffff',
            hoverColor = '#ffff00',
            activeColor = '#00ffff',
            onClick = () => {},
        } = {},
    ) {
        super(scene, x, y);
        this.scene = scene;

        // 背景ボックス
        this.background = scene.add
            .rectangle(0, 0, width, height, bgColor)
            .setStrokeStyle(2, borderColor)
            .setOrigin(0.5);

        // テキスト
        this.label = scene.add
            .text(0, 0, text, {
                fontSize: '20px',
                color: textColor,
                fontFamily: 'DotGothic16',
            })
            .setOrigin(0.5);

        this.add([this.background, this.label]);
        this.setSize(width, height);

        this.setInteractive({ useHandCursor: true });
        scene.add.existing(this);

        this.defaultColors = { textColor, borderColor };
        this.hoverColor = hoverColor;
        this.activeColor = activeColor;
        this.onClick = onClick;

        this._setupInteractions();
    }

    _setupInteractions() {
        this.on('pointerover', () => this._onHover());
        this.on('pointerout', () => this._onRest());
        this.on('pointerdown', () => this._onActive());
        this.on('pointerup', () => {
            this._onHover();
            this.onClick();
            sm.playClick();
        });
    }

    _onHover() {
        //this.label.setColor(this.hoverColor);
        //this._animateBorder(this.hoverColor);
    }

    _onRest() {
        this.label.setColor(this.defaultColors.textColor);
        //this._animateBorder(this.defaultColors.borderColor);
    }

    _onActive() {
        // this.label.setColor(this.activeColor);
        // this._animateBorder(this.activeColor);
    }

    _animateBorder(color) {
        this.scene.tweens.add({
            targets: this.background,
            strokeColor: color,
            duration: 150,
            ease: 'Sine.easeInOut',
        });
    }

    hide() {
        this.setVisible(false);
        this.setActive(false);
    }

    show() {
        this.setVisible(true);
        this.setActive(true);
    }
}
