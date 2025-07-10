// systems/HudSyncSystem.js
import { System } from '@/core/System.js';
import { UiState } from '@/ui/UiState.js';
import { Health } from '@/core/components/Health.js';

export class HudSyncSystem extends System {
    filter(e) {
        return e.has(Health) && e.has(Name);
    }

    update() {
        const p = this.world.entities.find((e) => e.get(Name).value === 'YOU');
        const e = this.world.entities.find((e) => e.get(Name).value === 'ENEMY');

        if (p) {
            const h = p.get(Health);
            UiState.player.hp = h.current;
            UiState.player.max = h.max;
            UiState.player.name = p.get(Name).value;
        }
        if (e) {
            const h = e.get(Health);
            UiState.enemy.hp = h.current;
            UiState.enemy.max = h.max;
            UiState.enemy.name = e.get(Name).value;
        }
    }

    destroy() {}
}
