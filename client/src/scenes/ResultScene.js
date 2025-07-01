export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.winner = data?.winner || '不明';
    }

    create() {
        const displayText = this.winner === 'draw' ? '相打ち！' : `勝者: ${this.winner}`;
        // 背景色などが必要であれば追加してください
        this.add
            .text(720, 300, displayText, {
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
