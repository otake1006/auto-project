// core/EffectManager.js
export class EffectManager {
    constructor(scene) {
        this.scene = scene;
    }

    shakeCamera(duration = 250, intensity = 0.01) {
        this.scene.cameras.main.shake(duration, intensity);
    }

    flashColor(r = 255, g = 0, b = 0, duration = 100) {
        this.scene.cameras.main.flash(duration, r, g, b);
    }

    slowMotion(factor = 0.3, duration = 300) {
        this.scene.time.timeScale = factor;
        this.scene.time.delayedCall(duration, () => {
            this.scene.time.timeScale = 1;
        });
    }

    fadeIn(duration = 500) {
        this.scene.cameras.main.fadeIn(duration, 0, 0, 0);
    }

    fadeOut(duration = 500) {
        this.scene.cameras.main.fadeOut(duration, 0, 0, 0);
    }
}
