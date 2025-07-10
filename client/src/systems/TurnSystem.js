import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';

export class TurnSystem extends System {
    constructor(turnIndicator) {
        super();
        this.ind = turnIndicator;
        phaserEvents.on('turn', (t) => this.ind.showTurn(t));
    }
    filter() {
        return false;
    }
    update() {}
    destroy() {
        phaserEvents.off('turn');
    }
}
