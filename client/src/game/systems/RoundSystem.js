import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { WipeAppearDisappearText } from '@/core/effects/WipeAppearDisappearText.js';

export class RoundSystem extends System {
    constructor(scene, effectMgr) {
        super();
        this.scene = scene;
        this.fx = effectMgr;
        phaserEvents.on('round', (r) => this._show(r));
    }
    filter() {
        return false;
    }
    update() {}

    _show(round) {
        this.fx.shakeCamera();
        this.fx.flashColor();
        
        // 新しいラウンド開始時にアニメーションをアイドルにリセット
        if (this.scene.player) {
            this.scene.player.playIdle();
        }
        if (this.scene.enemy) {
            this.scene.enemy.playIdle();
        }
        
        new WipeAppearDisappearText(
            this.scene,
            this.scene.centerX,
            this.scene.centerY,
            `Round ${round}!`,
            {
                textStyle: { fontSize: '36px', fontFamily: 'Arial', color: '#ffcc00' },
                bgColor: 0x333333,
            },
        );
    }
    destroy() {
        phaserEvents.off('round');
    }
}
