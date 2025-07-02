import { phaserEvents } from '@/events/EventCenter';
import { BgmManager } from '@/core/BgmManager';
import { bgmMap } from '@/core/sounds/bgmMap';
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
        this.bgmManager = new BgmManager(this);
        this.bgmManager.play(this.scene.key, bgmMap);

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
                this.bgmManager.fadeOut(500, () => {
                    this.scene.start('BattleScene');
                });
                // this.scene.switch('BattleScene'); // ゲーム画面に遷移
            });
    }

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
