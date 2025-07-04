import { phaserEvents } from '@/events/EventCenter';
import { BgmManager } from '@/core/BgmManager';
import { bgmMap } from '@/core/sounds/bgmMap';
import { VERSION } from '@/constants/version';
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
        this.load.image('button_bg', 'batlestartbottan.png');
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

        // ① 背景画像の追加（ボタン画像）
        const bg = this.add.image(750, 450, 'button_bg').setOrigin(0.5);

        // ③ インタラクティブ処理を背景に設定（画像をボタンとして使う）
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setAlpha(0.6);
            })

            // ⚪ ホバー解除で元に戻す
            .on('pointerout', () => {
                bg.setAlpha(1);
                bg.setScale(1);
            })
            .on('pointerdown', () => {
                bg.setScale(0.95);
            })
            .on('pointerup', () => {
                bg.setScale(1);
                this.scene.start('BattleScene');
                this.bgmManager.fadeOut(500, () => {
                    this.scene.start('BattleScene');
                });
                // this.scene.switch('BattleScene'); // ゲーム画面に遷移
            });

        const versionText = this.add
            .text(10, this.scale.height - 20, `version: ${VERSION}`, {
                fontSize: '20px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
            })
            .setOrigin(0, 1); // 左下基準

        const copyrightText = this.add
            .text(
                this.scale.width - 10,
                this.scale.height - 20,
                '© 2025 Au-Ta. Do not distribute!',
                {
                    fontSize: '20px',
                    fontFamily: 'DotGothic16',
                    color: '#ffffff',
                },
            )
            .setOrigin(1, 1);
    }

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
