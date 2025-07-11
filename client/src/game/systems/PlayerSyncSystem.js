// systems/PlayerSyncSystem.js
import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';

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
        char.updatePlayer(data);
        view.setReady?.(data.ready);
        view.updateBars();
        view.updateCount(data.shield);
    }

    destroy() {
        phaserEvents.off('player-upd');
        phaserEvents.off('enemy-upd');
    }
}
