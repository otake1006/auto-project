import { System } from '@/core/System.js';
import { UiState } from '@/ui/UiState.js';
import { phaserEvents, Event } from '@/events/EventCenter.js';

export class ScemeSystem extends System {
    constructor() {
        super();
        phaserEvents.on('ready', () => this.applyScene());
    }
    filter() {
        return false;
    }

    applyScene(scene) {
        if (UiState.scene === phase) return;
    }
}
