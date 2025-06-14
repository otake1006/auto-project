// core/CharacterView.js
import StatusBar from '@/ui/StatusBar.js';

export default class CharacterView {
    constructor(scene, character, x, y) {
        this.scene = scene;
        this.character = character;
        this.x = x;
        this.y = y;

        // キャラ表示
        this.sprite = scene.add.sprite(x, y, character.textureKey);

        // ステータスバー表示（HP/MP）
        this.hpBar = new StatusBar(scene, x - 50, y + 68, 100, 8, 0xff0000, '');
        this.mpBar = new StatusBar(scene, x - 50, y + 80, 100, 6, 0x0000ff, '');
    }

    updateBars() {
        this.hpBar.update(this.character.hp.ratio);
        this.mpBar.update(this.character.mp.ratio);
    }

    destroy() {
        this.sprite.destroy();
        this.hpBar.destroy();
        this.mpBar.destroy();
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
        };
    }
}
