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

            // 演出に合わせた段階的ログ表示
            const skillLogPromise = this.showProgressiveSkillLog(view, skill, isEnemy);

            // 演出開始
            const animationPromise = this.bm.startTurn(isEnemy);

            // 両方の完了を待つ
            await Promise.all([skillLogPromise, animationPromise]);
        }
    }

    /**
     * 演出の進行に合わせてスキルログを段階的に表示
     */
    async showProgressiveSkillLog(view, skill, isEnemy) {
        // 詠唱開始ログ（即座に表示）
        await this.showSkillLogWithTiming(view, `${skill} を唱えた!`, 0);

        // 発射タイミングでの追加ログ（発射音と同期）
        // 演出時間の約1/4経過時点
        // const launchDelay = 200; // 発射までの遅延
        // setTimeout(() => {
        //     view.showSkillLog(`${skill} が発動!`);
        // }, launchDelay);

        // 着弾タイミングでの効果ログ
        // 演出時間に基づいた動的計算（平均的な演出時間を想定）
        // const impactDelay = 800; // 着弾までの遅延
        // setTimeout(() => {
        //     const targetName = isEnemy ? 'プレイヤー' : '敵';
        //     view.showSkillLog(`${targetName} にダメージ!`);
        // }, impactDelay);
    }

    /**
     * スキルログを演出タイミングに合わせて表示
     */
    async showSkillLogWithTiming(view, text, delay = 0) {
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        view.showSkillLog(text);
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
