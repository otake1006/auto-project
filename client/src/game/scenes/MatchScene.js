import { networkManager } from '@/core/NetworkManager';
import { StatusIndicator } from '@/game//ui/StatusIndicator';
import { usePlayerStore } from '@/ui/stores/playerStore';
import { HideShowMixin } from '@/game/ui/button/HideShowMixin';
import { ImageButton } from '@/game/ui/button/ImageButton';

class CustomSceneButton extends HideShowMixin(ImageButton) {}

export class MatchScene extends Phaser.Scene {
    constructor() {
        super('MatchScene');
    }

    async create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 150;

        this.add.sprite(0, 0, 'matching').setOrigin(0).play('match');

        const indicator = new StatusIndicator(this, centerX, centerY);

        // キャンセルボタンを追加
        const cancelButton = new CustomSceneButton(this, centerX, centerY + 200, 'button_bg', {
            onHover: (btn) => {
                // btn.setAlpha(0.6);
            },
            onOut: (btn) => {
                // btn.setAlpha(1);
                // btn.setScale(1);
            },
            onClick: (btn) => {
                this.cancelMatching();
            },
            tweens: [
                {
                    scale: 0.95,
                    duration: 80,
                    ease: 'Quad.easeOut',
                    yoyo: true,
                },
            ],
        });

        const connectCheck = indicator.addStatus('Connecting to server...');
        try {
            await networkManager.connect();
            indicator.markDone(0); // 接続成功

            const joinCheck = indicator.addStatus('Joining room...');
            this.room = await networkManager.joinOrCreateRoom('my_room');
            indicator.markDone(1); // ルーム参加成功
            console.log('[MatchScene] Joined room:', room.sessionId);
            
            // プレイヤー名をサーバーに送信
            const playerStore = usePlayerStore();
            const playerName = playerStore.getPlayerName();
            room.send('setPlayerName', { name: playerName });
            console.log('[MatchScene] Player name sent:', playerName);
            console.log('[MatchScene] Joined room:', this.room.sessionId);
            const waitCheck = indicator.addStatus('Waiting for opponent...');

            this.room.onMessage('matching', () => {
                indicator.markDone(2); // 相手見つかった
                this.scene.launch('HudScene');
                this.scene.launch('BackgroundScene');
                this.scene.start('GameScene', { room: this.room });
            });
        } catch (error) {
            console.error('[MatchScene] Connection failed:', error);
            indicator.addStatus('Connection Failed');
            // エラー時に失敗アイコンにしてもよい（markFailedなど）
        }
    }

    cancelMatching() {
        console.log('[MatchScene] Canceling matching...');

        // ルームから離脱
        if (this.room) {
            this.room.leave();
            this.room = null;
        }

        // ネットワークマネージャーを切断
        // networkManager.disconnect();

        // スタート画面に戻る
        this.scene.start('StartScene');
    }
}
