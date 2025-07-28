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
        this.isProcessing = false;
        this.pendingLogs = [];
        phaserEvents.on('skill-log', (log) => this.queueLog(log));
    }
    /**
     * ログをキューに追加し、処理中でなければ開始
     */
    queueLog(log) {
        this.pendingLogs.push(log);
        if (!this.isProcessing) {
            this.processNextLog();
        }
    }

    /**
     * 次のログを処理
     */
    async processNextLog() {
        if (this.pendingLogs.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const log = this.pendingLogs.shift();
        await this.showLog(log);
        
        // 演出完了後、次のログを処理
        this.processNextLog();
    }

    /**
     * ログの表示と演出実行
     */
    async showLog(log) {
        for (const { sessionId, skill } of log) {
            if (!skill) continue;
            const isEnemy = this.room.sessionId !== sessionId;
            const view = isEnemy ? this.views.enemy : this.views.player;
            view.showSkillLog(`${skill} を唱えた!`);
            // if (!isEnemy) this.fx.shakeCamera();
            await this.bm.startTurn(isEnemy);
        }
    }
    filter() {
        return false;
    }
    destroy() {
        phaserEvents.off('skill-log');
        // 処理をリセット
        this.isProcessing = false;
        this.pendingLogs = [];
    }
}
