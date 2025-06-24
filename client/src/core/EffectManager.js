// core/EffectManager.js
export class EffectManager {
    constructor(scene) {
        this.scene = scene;
        this.effects = new Set();
    }

    add(effect) {
        this.effects.add(effect);
        effect.once('destroy', () => this.effects.delete(effect));
        effect.play();
    }

    clearAll() {
        this.effects.forEach((effect) => effect.destroy());
        this.effects.clear();
    }
}
