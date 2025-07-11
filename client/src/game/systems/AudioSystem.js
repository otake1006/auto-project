// systems/AudioSystem.js
import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';

export class AudioSystem extends System {
    /** @param {Phaser.Scene} scene */
    constructor(scene) {
        super();
        this.scene = scene;
        this.bgm = null;

        phaserEvents.on(Event.PHASE_CHANGED, (p) => this.#onPhase(p), this);
        phaserEvents.on(Event.ROUND, (r) => this.#onRound(r), this);
        phaserEvents.on(Event.SKILL_CAST_SFX, (key) => this.#sfx(key), this);
    }
    filter() {
        return false;
    } // push 系

    #onPhase(phase) {
        const map = { ready: 'bgm_ready', battle: 'bgm_battle', result: 'bgm_result' };
        const key = map[phase];
        if (key) this.#bgm(key);
    }
    #onRound(round) {
        this.#sfx('sfx_round');
    }

    #bgm(key) {
        if (this.bgm?.key === key) return;
        this.bgm?.stop(); // 前の曲を止める
        this.bgm = this.scene.sound.add(key, { loop: true, volume: 0 });
        this.bgm.play();
        this.scene.tweens.add({ targets: this.bgm, volume: 1, duration: 500 });
    }
    #sfx(key) {
        this.scene.sound.play(key);
    }

    destroy() {
        phaserEvents.off(Event.PHASE_CHANGED, this.#onPhase, this);
        phaserEvents.off(Event.ROUND, this.#onRound, this);
        phaserEvents.off(Event.SKILL_CAST_SFX, this.#sfx, this);
        this.bgm?.stop();
        this.bgm?.destroy();
    }
}
