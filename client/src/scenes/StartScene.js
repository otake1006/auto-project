import { phaserEvents } from '@/events/EventCenter';
// scenes/TitleScene.js
export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.spritesheet('bgAnim', 'UntitledArtwork2.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });
    }

    create() {
        phaserEvents.emit('scene-changed', 'StartScene');

        this.anims.create({
            key: 'bg-loop',
            frames: this.anims.generateFrameNumbers('bgAnim'),
            frameRate: 8, // フレーム速度
            repeat: -1, // ループ
        });

        this.add.sprite(0, 0, 'bgAnim').setOrigin(0).setDisplaySize(1440, 810).play('bg-loop');

        // バトルスタートボタン
        const startButton = this.add
            .text(770, 400, 'バトルスタート', {
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
