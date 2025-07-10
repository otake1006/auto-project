import { System } from '@/core/System.js';
import { Position } from '@/core/components/Position.js';
import { SpriteRenderer } from '@/core/components/SpriteRenderer.js';

export class RenderSystem extends System {
    filter(e) {
        return e.has(Position) && e.has(SpriteRenderer);
    }
    update(dt, entities) {
        for (const e of entities) {
            const pos = e.get(Position);
            const rend = e.get(SpriteRenderer);
            rend.sprite.setPosition(pos.x, pos.y);
        }
    }
}
