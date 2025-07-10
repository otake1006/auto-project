// scenes/HudScene.js
import Phaser from 'phaser';
import { phaserEvents, Event } from '@/events/EventCenter';
import { ReadyButton } from '@/ui/button/ReadyButton.js';
import { TurnIndicator } from '@/ui/TurnIndicator.js';
import CharacterView from '@/entities/CharacterView.js';
import { bounceTween } from '@/ui/animations/bounceTween.js';

export class HudScene extends Phaser.Scene {
    constructor() {
        super('HudScene');
    }

    create() {
        /* ---------------------- レイアウト定数 ---------------------- */
        const { width, height } = this.scale;

        /* ---------------------- Ready ボタン ------------------------ */
        // this.readyButton = new ReadyButton(
        //     this,
        //     this.centerX,
        //     this.centerY + 30,
        //     () => {
        //         // this.sendSkillSet(); // 既存ロジック
        //     },
        //     {
        //         defaultKey: 'ready-button',
        //         hoverImageKey: 'ready-button',
        //         downImageKey: 'ready-button',
        //         sounds: { click: 'click.mp3' },
        //         tweens: [bounceTween],
        //     },
        // );

        /* ---------------------- Turn インジケータ ------------------- */
        this.turnIndicator = new TurnIndicator(this, width / 2, 40);

        phaserEvents.on('turn', (t) => this.turnIndicator.showTurn(t), this);
    }

    /* ---------------------- クリーンアップ ----------------------- */
    shutdown() {
        phaserEvents.off('show-ready', null, this);
        phaserEvents.off('turn', null, this);
    }
}
