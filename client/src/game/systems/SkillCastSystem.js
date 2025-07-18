import { SkillCast } from '@/components/SkillCast.js';
import { Animation } from '@/components/Animation.js';
import { ProjectileTag } from '@/components/ProjectileTag.js';

export class SkillCastSystem extends System {
    filter(e) {
        return e.has(SkillCast);
    }

    update(_, ents) {
        for (const e of ents) {
            const sc = e.get(SkillCast);

            // 1. キャストアニメ
            e.add(new Animation('cast-' + sc.skillId));

            // 2. Projectile をスポーン（例: Fireball）
            if (sc.skillId === 'fireball') {
                const proj = new Entity()
                    .add(new Position(null, e.get(Position).x, e.get(Position).y))
                    .add(new ProjectileTag(sc.params.targetX, sc.params.targetY, 300 /*spd*/))
                    .add(new SpriteRenderer(scene, 'fx-fireball'));
                this.world.addEntity(proj);
            }

            // 一度実行したらコンポーネント除去
            e.remove(SkillCast);
        }
    }

    destroy() {}
}
