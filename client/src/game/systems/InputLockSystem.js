import { System } from '@/core/System.js';
import { useModalStore } from '@/ui/stores/modalStore';

export class InputLockSystem extends System {
    constructor(scene) {
        super();
        this.scene = scene;
        this.ui = useModalStore();
    }
    filter() {
        return false;
    }

    update() {
        this.scene.input.enabled = !this.ui.isOpen;
    }

    destroy() {}
}
