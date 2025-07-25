import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { useSkillStore } from '@/stores/skillStore';

export class SkillSyncSystem extends System {
    constructor() {
        super();
        phaserEvents.on('action', (p) => this.syncSkill(p));
    }
    filter() {
        return false;
    } // push-only

    syncSkill(p) {
        const { skills } = p;
        const skillStore = useSkillStore();
        skillStore.setSkills(skills);
    }

    destroy() {
        phaserEvents.off('action', this.syncSkill, this);
    }
}
