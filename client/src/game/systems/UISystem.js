// systems/UISystem.js
import { System } from '@/core/System.js';
import { Position } from '@/components/Position.js';
import { Health } from '@/components/Health.js';
import { HealthBar } from '@/components/HealthBar.js';
import { NameTag } from '@/components/NameTag.js';

export class UISystem extends System {
    constructor(scene) {
        super();
        this.scene = scene;
    }

    filter(e) {
        // 位置は必須／ヘルス or 名前タグのどちらかを持つ
        return e.has(Position) && (e.has(HealthBar) || e.has(NameTag));
    }

    onAddUI(e) {
        // 初回生成時に GameObject を作っておく
        const pos = e.get(Position);

        if (e.has(NameTag)) {
            const nt = e.get(NameTag);
            nt.textObj = this.scene.add
                .text(pos.x, pos.y + nt.offsetY, nt.name, {
                    fontSize: nt.fontSize,
                    color: '#ffffff',
                    stroke: '#000',
                    strokeThickness: 2,
                    origin: 0.5,
                })
                .setDepth(10);
        }

        if (e.has(HealthBar)) {
            const hb = e.get(HealthBar);
            hb.bgRect = this.scene.add
                .rectangle(pos.x, pos.y + hb.offsetY, hb.maxWidth, hb.height, hb.bgColor)
                .setOrigin(0.5)
                .setDepth(9);

            hb.fgRect = this.scene.add
                .rectangle(
                    pos.x - hb.maxWidth / 2,
                    pos.y + hb.offsetY,
                    hb.maxWidth,
                    hb.height,
                    hb.fgColor,
                )
                .setOrigin(0, 0.5)
                .setDepth(10);
        }
    }

    update(dt, entities) {
        for (const e of entities) {
            // 新規エンティティなら UI 作成
            if (!e.__uiInitialized) {
                this.onAddUI(e);
                e.__uiInitialized = true;
            }

            const pos = e.get(Position);

            // 名前ラベル位置更新
            if (e.has(NameTag)) {
                const nt = e.get(NameTag);
                nt.textObj.setPosition(pos.x, pos.y + nt.offsetY);
            }

            // ヘルスバー位置 & 残量更新
            if (e.has(HealthBar) && e.has(Health)) {
                const hb = e.get(HealthBar);
                const h = e.get(Health);

                const ratio = h.current / h.max;
                hb.bgRect.setPosition(pos.x, pos.y + hb.offsetY);
                hb.fgRect
                    .setPosition(pos.x - hb.maxWidth / 2, pos.y + hb.offsetY)
                    .setDisplaySize(hb.maxWidth * ratio, hb.height);
            }
        }
    }

    destroy() {}
}
