// core/CharacterView.js
import StatusBar from '@/game/ui/StatusBar.js';
import SkillLog from '@/game/ui/SkillLog.js'; // 追加
import { StatusIcon } from '@/game/ui/StatusIcon';

export default class CharacterView {
    constructor(scene, character, x, y, isRight = false) {
        this.scene = scene;
        this.character = character;
        this.x = x;
        this.y = y;

        // キャラ表示
        this.sprite = scene.add.sprite(x, y, character.textureKey);

        // ステータスバー表示（HP/MP）
        this.hpBar = new StatusBar(scene, x - 50, y + 60, 100, 12, 0xff0000, 'HP');
        this.mpBar = new StatusBar(scene, x - 50, y + 80, 100, 11, 0x0000ff, 'MP');

        this.nameText = scene.add
            .text(x, y - 40, `${character.name}: 準備中`, {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0.5);

        this.skillLog = new SkillLog(scene, x, y, isRight); // 右に表示（左なら x - 80）

        this.armorIcon = new StatusIcon(scene, isRight ? x + 60 : x - 60, y, {
            key: 'shield',
            count: 0,
        });
    }

    showSkillLog(text) {
        this.skillLog.showLog(text);
    }

    setReady(isReady) {
        this.nameText.setText(`${this.character.name}: ${isReady ? '準備完了' : '準備中'}`);
    }

    updateBars() {
        this.hpBar.update(this.character.hp.current, 100);
        this.mpBar.update(this.character.mp.current, 50);
    }

    updateCount(count) {
        this.armorIcon.updateCount(count);
    }

    destroy() {
        this.sprite.destroy();
        this.hpBar.destroy();
        this.mpBar.destroy();
        this.skillLog.destroy();
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
        };
    }
}
