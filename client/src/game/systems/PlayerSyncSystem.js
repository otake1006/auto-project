// systems/PlayerSyncSystem.js
import { System } from '@/core/System.js';
import { phaserEvents } from '@/events/EventCenter';

export class PlayerSyncSystem extends System {
    constructor(playerEnt, playerView, enemyEnt, enemyView) {
        super();
        this.map = {
            'player-upd': [playerEnt, playerView],
            'enemy-upd': [enemyEnt, enemyView],
        };
        Object.keys(this.map).forEach((ev) =>
            phaserEvents.on(ev, (data) => this._apply(this.map[ev], data)),
        );
    }
    filter() {
        return false;
    }
    update() {}

    _apply([char, view], data) {
        const previousHp = char.hp.current;
        char.updatePlayer(data);
        view.setReady?.(data.ready);
        view.updateBars();
        view.updateCount(data.shield);

        // バフ情報を更新
        if (data.buffs && view.updateBuffs) {
            view.updateBuffs(data.buffs);
        }

        // HPが0になった場合、死亡アニメーションを再生
        if (previousHp > 0 && data.hp === 0) {
            char.playDeathAnimation();
        }
    }

    destroy() {
        phaserEvents.off('player-upd');
        phaserEvents.off('enemy-upd');
    }
}
