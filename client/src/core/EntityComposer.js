import { Entity } from '@/core/Entity.js';
import { Position } from '@/core/components/Position.js';
import { SpriteRenderer } from '@/core/components/SpriteRenderer.js';
import { Health } from '@/core/components/Health.js';
import { NameTag } from '@/core/components/NameTag.js';
import { HealthBar } from '@/core/components/HealthBar.js';

export const composeCharacter = (scene, data) => {
    return new Entity()
        .add(new Position(scene, data.x, data.y))
        .add(new SpriteRenderer(scene, '' + data.id))
        .add(new Health(data.hp))
        .add(new NameTag(data.playerName))
        .add(new HealthBar(60, 8));
};
