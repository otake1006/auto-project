// scenes/TitleScene.js
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload() {
        // 必要ならボタン画像などを読み込む
    }

    create() {
        // タイトルテキスト
        this.add
            .text(400, 200, 'タイトル画面', {
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // バトルスタートボタン
        const startButton = this.add
            .text(400, 400, 'バトルスタート', {
                fontSize: '32px',
                backgroundColor: '#00aa00',
                color: '#ffffff',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('BattleScene'); // ゲーム画面に遷移
            });
    }
}
