export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    preload() {
        this.load.spritesheet('bgAnim', 'UntitledArtwork3.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });
    }

    init(data) {
        this.winner = data?.winner || '不明';
    }

    create() {
        const displayText = this.winner === 'draw' ? '相打ち！' : `${this.winner}`;
        // 背景色などが必要であれば追加してください

        this.anims.create({
            key: 'bg-loop',
            frames: this.anims.generateFrameNumbers('bgAnim'),
            frameRate: 8, // フレーム速度
            repeat: -1, // ループ
        });

        this.add.sprite(0, 0, 'bgAnim').setOrigin(0).setDisplaySize(1440, 810).play('bg-loop');

        this.add
            .text(900, 300, displayText, {
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(720, 500, 'タイトルに戻る', {
                fontSize: '32px',
                backgroundColor: '#0000aa',
                color: '#ffffff',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('StartScene');
            });
    }

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
