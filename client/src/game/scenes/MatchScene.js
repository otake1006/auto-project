import { networkManager } from '@/core/NetworkManager';
import { StatusIndicator } from '@/game//ui/StatusIndicator';
import { usePlayerStore } from '@/ui/stores/playerStore';

export class MatchScene extends Phaser.Scene {
    constructor() {
        super('MatchScene');
    }

    async create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 150;

        this.add.sprite(0, 0, 'matching').setOrigin(0).play('match');

        const indicator = new StatusIndicator(this, centerX, centerY);

        // テキストベースのキャンセルボタン（左下に配置）
        const cancelText = this.add
            .text(20, this.scale.height - 20, 'Cancel', {
                fontSize: '32px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3,
            })
            .setOrigin(0, 1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                cancelText.setStyle({ color: '#ff9999' }); // ホバー時の色変更（薄い赤）
            })
            .on('pointerout', () => {
                cancelText.setStyle({ color: '#ffffff' }); // 元の色に戻す
            })
            .on('pointerdown', () => {
                cancelText.setScale(0.95); // クリック時のスケール
            })
            .on('pointerup', () => {
                cancelText.setScale(1); // スケールを戻す
                this.cancelMatching();
            });

        const connectCheck = indicator.addStatus('Connecting to server...');
        try {
            await networkManager.connect();
            indicator.markDone(0); // 接続成功

            const joinCheck = indicator.addStatus('Joining room...');
            const room = await networkManager.joinOrCreateRoom('my_room');
            indicator.markDone(1); // ルーム参加成功
            console.log('[MatchScene] Joined room:', room.sessionId);

            // プレイヤー名をサーバーに送信
            const playerStore = usePlayerStore();
            const playerName = playerStore.getPlayerName();
            room.send('setPlayerName', { name: playerName });
            console.log('[MatchScene] Player name sent:', playerName);
            console.log('[MatchScene] Joined room:', room.sessionId);
            const waitCheck = indicator.addStatus('Waiting for opponent...');

            room.onMessage('matching', () => {
                indicator.markDone(2); // 相手見つかった
                this.scene.launch('HudScene');
                this.scene.launch('BackgroundScene');
                this.scene.start('GameScene', { room });
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
