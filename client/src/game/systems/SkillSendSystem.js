import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { networkManager } from '@/core/NetworkManager'; // Colyseus ラッパ
import { useSkillStore } from '@/stores/skillStore';

export class SkillSendSystem extends System {
    constructor() {
        super();
        phaserEvents.on('ready', () => this.sendSkillSet());
    }
    filter() {
        return false;
    } // push-only

    sendSkillSet() {
        const { skillSets } = useSkillStore();
        const payload = skillSets
            .filter((s) => s.skill)
            .map((s) => ({
                skill: s.skill.id,
                conditions: s.conditions.map((c) => ({ id: c.id, value: c.value })),
            }));
        networkManager.send('ready', payload);
    }

    destroy() {
        phaserEvents.off('ready', this.sendSkillSet, this);
    }
}
