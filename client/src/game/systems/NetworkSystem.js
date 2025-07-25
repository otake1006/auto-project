// systems/NetworkSystem.js
import { System } from '@/core/System.js';
import { phaserEvents } from '@/events/EventCenter';
import { useSkillStore } from '@/ui/stores/skillStore';
import { useModalStore } from '@/ui/stores/modalStore';
import { networkManager } from '@/core/NetworkManager';

export class NetworkSystem extends System {
    /**
     * @param {Colyseus.Room} room
     */
    constructor(room) {
        super();
        this.room = room;
        this.listeners = []; // 解除用に保存

        const reg = (ev, fn) => {
            const bound = fn.bind(this);
            room.onMessage(ev, bound);
            this.listeners.push([ev, bound]);
        };

        reg('action', this.onAction);
        reg('randomSkill', this.onRandomSkill);
        reg('skillLogs', this.onSkillLogs);
        reg('giveCards', this.onGiveCards);
        reg('showReady', this.onShowReady);
        reg('winner', this.onWinner);
        reg('turn', this.onTurn);
        reg('round', this.onRound);
        reg('condition', this.onCondition);
        reg('leave', this.onLeave);
    }

    onAction(skills) {
        useSkillStore().setSkills(skills);
    }

    onRandomSkill(skills) {
        useSkillStore().addSkills(skills);
    }

    onSkillLogs(logs) {
        phaserEvents.emit('skill-log', logs);
    }

    async onGiveCards(cards) {
        const modal = useModalStore();
        const skill = useSkillStore();
        skill.setSelectCards(cards);

        // 進行中の演出がある場合は待機
        await this.waitForCurrentAnimations();

        const selected = await modal.open('skillSelect', { cards });
        if (selected) {
            this.room.send('selectSkill', selected.id);
            skill.addSkills([selected]);
            skill.clearSelectCards();
        }
    }

    /**
     * 現在進行中のアニメーションやエフェクトの完了を待つ
     */
    async waitForCurrentAnimations() {
        return new Promise((resolve) => {
            // BattleManagerのAnimationQueueを直接チェック
            const battleManager = this.getBattleManager();
            
            if (battleManager && battleManager.isAnimationPlaying) {
                // BattleManagerがアニメーション中の場合は完了イベントを待つ
                const checkInterval = setInterval(() => {
                    if (!battleManager.isAnimationPlaying) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50); // 50ms間隔でチェック
                
                // 安全のため5秒でタイムアウト
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 5000);
                
                return;
            }

            // 軽量チェック：主要なエフェクトのみ
            const scene = phaserEvents.getScene?.() || window.currentPhaserScene;
            if (!scene) {
                resolve();
                return;
            }

            // アクティブなTweenの数のみチェック
            const activeTweens = scene.tweens.getAllTweens()
                .filter(tween => tween.state === Phaser.Tweens.TWEEN_ACTIVE);
            
            if (activeTweens.length === 0) {
                resolve();
                return;
            }

            // 最短のTween完了時間を基準にする
            let minWaitTime = Math.min(
                ...activeTweens.map(tween => tween.duration - tween.elapsed)
            );
            
            // 最小100ms、最大2秒に制限
            minWaitTime = Math.max(Math.min(minWaitTime + 100, 2000), 100);

            setTimeout(() => {
                resolve();
            }, minWaitTime);
        });
    }

    /**
     * BattleManagerインスタンスを取得
     */
    getBattleManager() {
        // グローバルまたはシーンからBattleManagerを取得する実装
        const scene = phaserEvents.getScene?.() || window.currentPhaserScene;
        return scene?.battleManager || window.battleManager;
    }
    onShowReady() {
        phaserEvents.emit('show-ready');
    }
    onWinner(data) {
        phaserEvents.emit('phase-change', data);
    }
    onTurn(t) {
        phaserEvents.emit('turn', t);
    }
    onRound(r) {
        phaserEvents.emit('round', r);
    }
    onCondition(c) {
        useSkillStore().loadConditionFromColyseus(c);
    }
    onLeave() {
        phaserEvents.emit('leave-room');
    }

    filter(e) {
        return e.has('NetworkSync');
    }

    update() {}

    /* ----- cleanup ----- */
    destroy() {
        //this.listeners.forEach(([ev, fn]) => this.room.off(ev, fn));
        this.listeners.length = 0;
        // this.room.leave().catch((err) => {
        //     console.error('Failed to leave room:', err);
        // });
        // networkManager.leave();
    }
}

// import { System } from '@/core/System.js';
// import { NetworkSync } from '@/core/components/NetworkSync.js';
// import { Position } from '@/core/components/Position.js';
// import { Health } from '@/core/components/Health.js';
// import { networkManager } from '@/core/NetworkManager'; // Colyseus ラッパ
// import { phaserEvents, Event } from '@/events/EventCenter';

// export class NetworkSystem extends System {
//     constructor() {
//         super();
//         // サーバ→クライアント
//         this.handlers = {
//             action: (p) =>
//                 phaserEvents.emit('action', {
//                     skills: p,
//                 }),
//         };

//         Object.entries(this.handlers).forEach(([ev, fn]) => networkManager.onMessage(ev, fn));

//         networkManager.onMessage('state', (payload) => this._applyState(payload));
//     }

//     filter(e) {
//         return e.has(NetworkSync);
//     }

//     onAction() {}

//     /** クライアント→サーバ */
//     update(_, ents) {
//         // for (const e of ents) {
//         //     const ns = e.get(NetworkSync);
//         //     if (ns.authority === 'local' && ns._dirty) {
//         //         ns._dirty = false;
//         //         networkManager.send('update', this._collectState(e));
//         //     }
//         // }
//     }
// }
