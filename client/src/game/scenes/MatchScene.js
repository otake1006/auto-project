import { networkManager } from '@/core/NetworkManager';
import { StatusIndicator } from '@/game//ui/StatusIndicator';

export class MatchScene extends Phaser.Scene {
    constructor() {
        super('MatchScene');
    }

    async create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 150;

        this.add.sprite(0, 0, 'matching').setOrigin(0).play('match');

        const indicator = new StatusIndicator(this, centerX, centerY);

        const connectCheck = indicator.addStatus('Connecting to server...');
        try {
            await networkManager.connect();
            indicator.markDone(0); // 接続成功

            const joinCheck = indicator.addStatus('Joining room...');
            const room = await networkManager.joinOrCreateRoom('my_room');
            indicator.markDone(1); // ルーム参加成功
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
}
