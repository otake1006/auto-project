// systems/NetworkSystem.js
import { System } from '@/core/System.js';
import { phaserEvents } from '@/events/EventCenter';
import { useSkillStore } from '@/stores/skillStore';
import { useModalStore } from '@/stores/modalStore';
import { networkManager } from '../core/NetworkManager';

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

        const selected = await modal.open('skillSelect', { cards });
        if (selected) {
            this.room.send('selectSkill', selected.id);
            skill.addSkills([selected]);
            skill.clearSelectCards();
        }
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
        networkManager.leave();
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
