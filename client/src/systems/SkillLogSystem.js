// systems/SkillLogSystem.js
import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';

export class SkillLogSystem extends System {
    constructor(playerView, enemyView, effectMgr, battleMgr, room) {
        super();
        this.queue = [];
        this.views = { player: playerView, enemy: enemyView };
        this.fx = effectMgr;
        this.bm = battleMgr;
        this.room = room;
        phaserEvents.on('skill-log', (log) => this.showLog(log));
    }
    async showLog(log) {
        log.forEach(async ({ sessionId, skill }) => {
            const isEnemy = this.room.sessionId !== sessionId;
            const view = isEnemy ? this.views.enemy : this.views.player;
            view.showSkillLog(`${skill} を唱えた!`);
            if (!isEnemy) this.fx.shakeCamera();
            await this.bm.startTurn(isEnemy);
        });
    }
    filter() {
        return false;
    }
    destroy() {
        phaserEvents.off('skill-log');
    }
}
