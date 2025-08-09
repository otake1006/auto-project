import { phaserEvents } from '@/events/EventCenter';
import { useSceneStore } from '@/ui/stores/sceneStore';
import { usePlayerStore } from '@/ui/stores/playerStore';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    preload() {}

    init(data) {
        this.winner = data || '不明';
    }

    create() {
        useSceneStore().set(this.scene.key);
        this.scale.resize(1440, 810);

        const displayText = this.getDisplayText();

        this.add.sprite(0, 0, 'result').setOrigin(0).setDisplaySize(1440, 810).play('loop');

        this.add
            .text(1200, 400, displayText, {
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(1100, 600, 'タイトルに戻る', {
                fontSize: '32px',
                backgroundColor: '#0000aa',
                color: '#ffffff',
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('StartScene');
            });
    }

    getDisplayText() {
        const playerStore = usePlayerStore();
        
        // 引き分けの場合
        if (this.winner === 'draw' || this.winner === '引き分け') {
            return '引き分け';
        }
        
        // 勝者がプレイヤー自身の場合
        const playerName = playerStore.getPlayerName();
        if (this.winner === playerName || this.winner === 'player' || this.winner === 'you') {
            return `${playerName} の勝利！`;
        }
        
        // 相手が勝った場合や、具体的なプレイヤー名が送られてきた場合
        if (this.winner && this.winner !== '不明') {
            return `${this.winner} の勝利！`;
        }
        
        // 不明な場合
        return '結果不明';
    }

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
