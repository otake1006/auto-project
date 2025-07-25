import { System } from '@/core/System.js';
import { useSkillStore } from '@/ui/stores/skillStore';
import { phaserEvents, Event } from '@/events/EventCenter';

export class ReadySystem extends System {
    constructor(readyBtn, room) {
        super();
        this.btn = readyBtn;
        this.room = room;
        phaserEvents.on('show-ready', () => readyBtn.show());
        phaserEvents.on('ready', () => this._sendSkillSet());
    }
    _sendSkillSet() {
        const store = useSkillStore();
        const payload = store.skillSets
            .filter((s) => s.skill)
            .map((s) => ({
                skill: s.skill.id,
                conditions: s.conditions.map((c) => ({ id: c.id, value: c.value })),
            }));
        this.room.send('ready', payload);
    }
    filter() {
        return false;
    }
    update() {}
    destroy() {
        phaserEvents.off('show-ready');
        phaserEvents.off('ready');
        // this.btn.removeAllListeners();
    }
}
