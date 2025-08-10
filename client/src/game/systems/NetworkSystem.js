// systems/NetworkSystem.js
import { System } from '@/core/System.js';
import { phaserEvents } from '@/events/EventCenter';
import { useSkillStore } from '@/ui/stores/skillStore';
import { useModalStore } from '@/ui/stores/modalStore';
import { useGameStore } from '@/ui/stores/gameStore';
import { networkManager } from '@/core/NetworkManager';

export class NetworkSystem extends System {
    /**
     * @param {Colyseus.Room} room
     */
    constructor(room) {
        super();
        this.room = room;
        this.listeners = []; // 解除用に保存
        this.scene = null; // シーンへの参照を保存
        this.modalQueue = []; // モーダル表示のキュー
        this.isProcessingModal = false; // モーダル処理中フラグ

        const reg = (ev, fn) => {
            const bound = fn.bind(this);
            room.onMessage(ev, bound);
            this.listeners.push([ev, bound]);
        };

        reg('action', this.onAction);
        reg('randomSkill', this.onRandomSkill);
        reg('skillLogs', this.onSkillLogs);
        reg('giveCards', this.onGiveCards);
        reg('giveRelics', this.onReceiveRelic);
        reg('showReady', this.onShowReady);
        reg('winner', this.onWinner);
        reg('turn', this.onTurn);
        reg('round', this.onRound);
        reg('condition', this.onCondition);
        reg('relic', this.onRelic);
        reg('leave', this.onLeave);
        reg('playerName', this.onPlayerName);
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
        const skill = useSkillStore();

        // 受け取ったスキルカードをstoreに追加
        skill.setSelectCards(cards);

        // // 既存のレリックカードをチェック
        // const existingRelics = skill.selectRelicCards;

        // // カードが何もない場合は開かない
        // if (cards.length === 0 && existingRelics.length === 0) return;

        // this.modalQueue.push({
        //     type: 'unified',
        //     skillCards: cards,
        //     relicCards: existingRelics,
        //     modalType: 'unifiedSelect',
        //     messageTypes: { skill: 'selectSkill', relic: 'selectRelic' },
        //     addMethods: { skill: 'addSkills', relic: 'addRelics' },
        // });

        // // キュー処理を開始
        // this.processModalQueue();
    }

    async onReceiveRelic(cards) {
        const skill = useSkillStore();

        // 受け取ったレリックカードを選択用カードとして保存
        skill.setSelectRelicCards(cards);

        // 既存のスキルカードをチェック;
        const existingSkills = skill.selectCards;

        // カードが何もない場合は開かない
        if (existingSkills.length === 0 && cards.length === 0) return;

        this.modalQueue.push({
            type: 'unified',
            skillCards: existingSkills,
            relicCards: cards,
            modalType: 'unifiedSelect',
            messageTypes: { skill: 'selectSkill', relic: 'selectRelic' },
            addMethods: { skill: 'addSkills', relic: 'addRelics' },
        });

        // キュー処理を開始
        this.processModalQueue();
    }

    /**
     * モーダルキューを順次処理
     */
    async processModalQueue() {
        // 既に処理中の場合は何もしない
        if (this.isProcessingModal) {
            return;
        }

        // キューが空の場合は何もしない
        if (this.modalQueue.length === 0) {
            return;
        }

        this.isProcessingModal = true;

        try {
            while (this.modalQueue.length > 0) {
                const item = this.modalQueue.shift();
                await this.processModalItem(item);
            }
        } finally {
            this.isProcessingModal = false;
        }
    }

    /**
     * 個別のモーダル処理
     */
    async processModalItem(item) {
        // 演出が進行中の場合は待機
        await this.waitForAnimationsToComplete();

        const modal = useModalStore();
        const skill = useSkillStore();

        if (item.type === 'unified') {
            // 統合モーダルの場合 - 連続選択対応
            let continuousSelection = true;

            while (continuousSelection) {
                const result = await modal.open(item.modalType, {
                    skillCards: item.skillCards,
                    relicCards: item.relicCards,
                    initialTab: 'skill',
                });

                if (result) {
                    const { card, type, keepOpen } = result;
                    this.room.send(item.messageTypes[type], card.id);

                    // カードタイプに応じて適切なメソッドを呼び出し
                    if (type === 'skill') {
                        skill.addSkills([card]);
                    } else if (type === 'relic') {
                        skill.addRelics([card]);
                    }

                    // keepOpenがfalseの場合は終了
                    if (!keepOpen) {
                        continuousSelection = false;
                    }

                    skill.clearSelectCards();
                    skill.clearSelectRelicCards();
                } else {
                    // キャンセルされた場合は終了
                    continuousSelection = false;
                }
            }
        }
    }

    /**
     * 演出が完了するまで待機
     */
    async waitForAnimationsToComplete() {
        return new Promise((resolve) => {
            const checkAnimations = () => {
                // SkillLogSystemの演出状態を確認
                const skillLogSystem = this.getSkillLogSystem();

                if (
                    !skillLogSystem ||
                    (!skillLogSystem.isProcessing && skillLogSystem.pendingLogs.length === 0)
                ) {
                    resolve();
                } else {
                    // 100ms後に再チェック
                    setTimeout(checkAnimations, 100);
                }
            };

            checkAnimations();
        });
    }

    /**
     * シーンを設定
     */
    setScene(scene) {
        this.scene = scene;
    }

    /**
     * SkillLogSystemインスタンスを取得
     */
    getSkillLogSystem() {
        return this.scene?.skillLogSystem;
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
        const gameStore = useGameStore();
        gameStore.reset();
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
    onRelic(c) {
        useSkillStore().loadRelicFromColyseus(c);
    }
    onLeave() {
        phaserEvents.emit('leave-room');
    }

    onPlayerName(data) {
        phaserEvents.emit('player-name-update', data);
    }

    filter(e) {
        return e.has('NetworkSync');
    }

    update() {}

    /* ----- cleanup ----- */
    destroy() {
        //this.listeners.forEach(([ev, fn]) => this.room.off(ev, fn));
        this.listeners.length = 0;
        // モーダルキューをクリア
        this.modalQueue.length = 0;
        this.isProcessingModal = false;
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
