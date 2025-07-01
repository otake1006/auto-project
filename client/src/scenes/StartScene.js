import { phaserEvents } from '@/events/EventCenter';
// scenes/TitleScene.js
export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('background', 'IMG_0011.png'); // パスは正しく書き換えてください
    }

    create() {
        phaserEvents.emit('scene-changed', 'StartScene');

        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(1440, 810);
        // タイトルテキスト
        this.add
            .text(400, 200, 'オートプロジェクト', {
                fontSize: '60px',
                fontFamily: 'DotGothic16',
                color: '#00000',
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

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
