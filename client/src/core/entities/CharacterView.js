// core/CharacterView.js
import StatusBar from '@/game/ui/StatusBar.js';
import SkillLog from '@/game/ui/SkillLog.js'; // 追加
import { StatusIcon } from '@/game/ui/StatusIcon';
import { phaserEvents } from '@/events/EventCenter';

export default class CharacterView {
    constructor(scene, character, x, y, isRight = false) {
        this.scene = scene;
        this.character = character;
        this.x = x;
        this.y = y;
        this.isRight = isRight;

        // キャラ表示
        this.sprite = scene.add.sprite(x, y, character.textureKey);
        
        // デフォルトでアイドルアニメーションを開始
        this.sprite.play('idle');

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

        // プレイヤー名更新イベントを監視
        phaserEvents.on('player-name-update', (data) => this.updatePlayerName(data));
    }

    updatePlayerName(data) {
        // roomを取得（GameSceneから、またはnetworkManagerから）
        const room = this.scene.room || this.scene.networkManager?.getRoom();
        
        if (!room) {
            console.warn('[CharacterView] Room not available for player name update');
            return;
        }
        
        // 自分のキャラクターか敵のキャラクターかを判定
        const isMyself = data.sessionId === room.sessionId;
        const shouldUpdate = (isMyself && !this.isRight) || (!isMyself && this.isRight);
        
        console.log(`[CharacterView] Player name update - SessionId: ${data.sessionId}, MySessionId: ${room.sessionId}, IsMyself: ${isMyself}, IsRight: ${this.isRight}, ShouldUpdate: ${shouldUpdate}, Name: ${data.name}`);
        
        if (shouldUpdate) {
            this.character.name = data.name;
            this.nameText.setText(`${this.character.name}: 準備中`);
            console.log(`[CharacterView] Updated player name to: ${this.character.name}`);
        }
    }

    showSkillLog(text) {
        this.skillLog.showLog(text);
        // スキル使用時に攻撃アニメーションを再生
        this.playAttackAnimation();
    }

    playAttackAnimation() {
        // 攻撃アニメーションを再生
        this.sprite.play('attack');
        
        // アニメーション完了後にidleアニメーションに戻す
        this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.sprite.play('idle');
        });
    }

    setReady(isReady) {
        const displayName = this.character.name || 'プレイヤー';
        this.nameText.setText(`${displayName}: ${isReady ? '準備完了' : '準備中'}`);
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
        
        // イベントリスナーを削除
        phaserEvents.off('player-name-update', this.updatePlayerName);
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
        };
    }
}
