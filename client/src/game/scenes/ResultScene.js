import { phaserEvents } from '@/events/EventCenter';
import { useSceneStore } from '@/ui/stores/sceneStore';

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

        const displayText = this.winner === 'draw' ? '相打ち！' : `${this.winner}`;
        // 背景色などが必要であれば追加してください

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

    shutdown() {
        // クリーンアップ（イベントの重複登録防止）
        phaserEvents.removeAllListeners('scene-changed');
    }
}
