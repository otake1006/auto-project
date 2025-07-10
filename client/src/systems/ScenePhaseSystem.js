import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';

export class ScenePhaseSystem extends System {
    constructor(scene, bgm) {
        super();
        this.scene = scene;
        this.bgm = bgm;
        phaserEvents.on('phase-change', (d) => this._toResult(d));
        phaserEvents.on('leave-room', () => this._toStart());
    }

    _toResult(data) {
        console.log(data);
        this.bgm.fadeOut(500, () => this.scene.start('ResultScene', data));
    }

    _toStart() {
        this.bgm.fadeOut(500, () => this.scene.start('StartScene'));
    }

    filter() {
        return false;
    }

    update() {}

    destroy() {
        phaserEvents.off('scene-change');
        phaserEvents.off('leave-room');
    }
}
