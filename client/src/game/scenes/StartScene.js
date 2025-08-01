import { phaserEvents } from '@/events/EventCenter';
import { BgmManager } from '@/core/BgmManager';
import { bgmMap } from '@/core/sounds/bgmMap';
import { VERSION } from '@/constants/version';
import { HideShowMixin } from '@/game/ui/button/HideShowMixin';
import { ImageButton } from '@/game/ui/button/ImageButton';
import { MuteButton } from '@/game/ui/button/MuteButton';
import { useSceneStore } from '@/ui/stores/sceneStore';
import { useModalStore } from '@/ui/stores/modalStore';
import { usePlayerStore } from '@/ui/stores/playerStore';
import { TutorialModal } from '@/game/ui/modal/TutorialModal';
import { CreditsModal } from '@/game/ui/modal/CreditsModal';
import { sm } from '@/core/SoundManager';

class CustomSceneButton extends HideShowMixin(ImageButton) {}
// scenes/TitleScene.js
export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {}

    create() {
        useSceneStore().set(this.scene.key);

        this.scale.resize(1440, 810);
        this.buttonPressed = false;
        phaserEvents.emit('scene-changed', 'StartScene');
        this.bgmManager = new BgmManager(this);
        this.bgmManager.play(this.scene.key, bgmMap);
        this.tutorialModal = new TutorialModal(this);
        this.creditsModal = new CreditsModal(this);

        this.anims.create({
            key: 'bg-loop',
            frames: this.anims.generateFrameNumbers('bgAnim'),
            frameRate: 8, // フレーム速度
            repeat: -1, // ループ
        });

        this.add.sprite(0, 0, 'bgAnim').setOrigin(0).setDisplaySize(1440, 810).play('bg-loop');

        const matchButton = new CustomSceneButton(this, 750, 450, 'button_bg', {
            onHover: (btn) => {
                btn.setAlpha(0.6);
            },
            onOut: (btn) => {
                btn.setAlpha(1);
                btn.setScale(1);
            },
            onClick: (btn) => {
                if (this.buttonPressed) return;

                this.buttonPressed = true;
                btn.setScale(1); // スケールを戻す

                // プレイヤー名は既に設定済みなので、そのままマッチングに進む
                this.bgmManager.fadeOut(500, () => {
                    this.scene.start('MatchScene');
                });
            },
            sounds: { click: 'click.mp3' },
            tweens: [
                {
                    scale: 0.95,
                    duration: 80,
                    ease: 'Quad.easeOut',
                    yoyo: true,
                },
            ],
        });

        // ① 背景画像の追加（ボタン画像）
        // const bg = this.add.image(750, 450, 'button_bg').setOrigin(0.5);

        // ③ インタラクティブ処理を背景に設定（画像をボタンとして使う）
        // bg.setInteractive({ useHandCursor: true })
        //     .on('pointerover', () => {
        //         bg.setAlpha(0.6);
        //     })

        //     // ⚪ ホバー解除で元に戻す
        //     .on('pointerout', () => {
        //         bg.setAlpha(1);
        //         bg.setScale(1);
        //     })
        //     .on('pointerdown', () => {
        //         bg.setScale(0.95);
        //     })
        //     .on('pointerup', () => {
        //         if (this.buttonPressed) return; // ← 追加：すでに押されてたら何もしない
        //         this.buttonPressed = true; // ← 追加：フラグを立てる

        //         bg.setScale(1);
        //         this.bgmManager.fadeOut(500, () => {
        //             this.scene.start('MatchScene');
        //         });
        //         // this.scene.switch('BattleScene'); // ゲーム画面に遷移
        //     });

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

        // 初回起動時のプレイヤー名入力チェック
        this.checkFirstTimePlayerName();
        
        // ミュートボタンを作成
        this.createMuteButtons();
    }

    async checkFirstTimePlayerName() {
        const playerStore = usePlayerStore();

        // プレイヤー名が設定されていない場合のみモーダルを表示
        if (!playerStore.hasPlayerName) {
            console.log('[StartScene] First time launch - requesting player name');
            const modal = useModalStore();
            const playerName = await modal.open('playerNameInput');

            if (playerName) {
                playerStore.setPlayerName(playerName);
                console.log('[StartScene] Player name set:', playerName);
            } else {
                // 名前が設定されなかった場合、デフォルト名を設定
                playerStore.setPlayerName('プレイヤー');
                console.log('[StartScene] Default player name set');
            }
        } else {
            console.log('[StartScene] Player name already exists:', playerStore.getPlayerName());
        }

        // テキストベースのチュートリアルボタン（copyrightTextの上に配置）
        const tutorialText = this.add
            .text(this.scale.width - 10, this.scale.height - 50, 'Tutorial', {
                fontSize: '24px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(1, 1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                tutorialText.setStyle({ color: '#ffff99' }); // ホバー時の色変更
            })
            .on('pointerout', () => {
                tutorialText.setStyle({ color: '#ffffff' }); // 元の色に戻す
            })
            .on('pointerdown', () => {
                tutorialText.setScale(0.95); // クリック時のスケール
            })
            .on('pointerup', () => {
                tutorialText.setScale(1); // スケールを戻す
                this.showTutorial();
            });

        // テキストベースのクレジットボタン（チュートリアルの上に配置）
        const creditsText = this.add
            .text(this.scale.width - 10, this.scale.height - 80, 'Credits', {
                fontSize: '24px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(1, 1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                creditsText.setStyle({ color: '#ffff99' }); // ホバー時の色変更
            })
            .on('pointerout', () => {
                creditsText.setStyle({ color: '#ffffff' }); // 元の色に戻す
            })
            .on('pointerdown', () => {
                creditsText.setScale(0.95); // クリック時のスケール
            })
            .on('pointerup', () => {
                creditsText.setScale(1); // スケールを戻す
                this.creditsModal.show();
            });
    }

    showTutorial() {
        this.tutorialModal.show();
    }

    createMuteButtons() {
        // SE ミュートボタン
        this.seButton = new MuteButton(this, this.scale.width - 100, 30, 'icon_se_on', {
            muteTexture: 'mute_x',
            isMuted: sm.isMutedSe,
            scale: 1.2,
            muteScale: 1.5,
            onToggle: (isMuted) => {
                sm.setMuteSe(isMuted);
            },
            sounds: { click: null },
        });

        // BGM ミュートボタン
        this.bgmButton = new MuteButton(this, this.scale.width - 50, 30, 'icon_bgm_on', {
            muteTexture: 'mute_x',
            isMuted: this.bgmManager.isMuted,
            scale: 1.2,
            muteScale: 1.5,
            onToggle: (isMuted) => {
                this.bgmManager.setMute(isMuted);
            },
            sounds: { click: null },
        });
    }

    shutdown() {
        this.buttonPressed = false;
        this.creditsModal.destroy();
        this.tutorialModal.destroy();
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
