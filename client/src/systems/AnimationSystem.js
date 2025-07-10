import { System } from '@/core/System.js';
import { Animation } from '@/components/Animation.js';
import { SpriteRenderer } from '@/components/SpriteRenderer.js';

export class AnimationSystem extends System {
    filter(e) {
        return e.has(Animation) && e.has(SpriteRenderer);
    }

    update(dt, ents) {
        for (const e of ents) {
            const anim = e.get(Animation);
            const rend = e.get(SpriteRenderer);

            // 変更検知: 再生中アニメと希望アニメが違えば再生
            if (anim._playing !== anim.key) {
                rend.sprite.play(anim.key, true);
                anim._playing = anim.key;
            }
        }
    }
}
