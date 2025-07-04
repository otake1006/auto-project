// scenes/MatchScene.js
import { networkManager } from '@/core/NetworkManager';

export class MatchScene extends Phaser.Scene {
    constructor() {
        super('MatchScene');
    }

    async create() {
        const { centerX, centerY } = this.cameras.main;

        this.add
            .text(centerX, centerY, 'Connecting to server...', { fontSize: '24px', color: '#fff' })
            .setOrigin(0.5);

        try {
            await networkManager.connect();

            this.add
                .text(centerX, centerY + 20, 'Joining room...', { fontSize: '18px' })
                .setOrigin(0.5);

            const room = await networkManager.joinOrCreateRoom('my_room');

            this.add
                .text(centerX, centerY + 40, 'Waiting for opponent...', {
                    fontSize: '18px',
                })
                .setOrigin(0.5);

            // 相手が接続してゲーム開始する通知
            room.onMessage('matching', () => {
                this.scene.start('BattleScene', { room });
            });
        } catch (error) {
            console.error('[MatchScene] Connection failed:', error);
            this.add
                .text(400, 240, 'Connection Failed', { fontSize: '20px', color: '#f00' })
                .setOrigin(0.5);
        }
    }
}
