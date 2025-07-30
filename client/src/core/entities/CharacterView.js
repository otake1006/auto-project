// core/CharacterView.js
import StatusBar from '@/game/ui/StatusBar.js';
import SkillLog from '@/game/ui/SkillLog.js'; // 追加
import { StatusIcon } from '@/game/ui/StatusIcon';
import { BuffDisplay } from '@/game/ui/BuffDisplay';
import { phaserEvents } from '@/events/EventCenter';

export default class CharacterView {
    constructor(scene, character, x, y, isRight = false) {
        this.scene = scene;
        this.character = character;
        this.x = x;
        this.y = y;
        this.isRight = isRight;

        // キャラは既にCharacterクラスで管理されている
        // CharacterViewではspriteへの参照のみ保持
        this.sprite = character;

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

        // バフ表示を追加（プレイヤーの横に配置）
        this.buffDisplay = new BuffDisplay(scene, x, y, isRight);

        // 初期状態でステータスバーを更新
        this.updateBars();

        // プレイヤー名更新イベントを監視（バインドされたメソッドを保存）
        this.boundUpdatePlayerName = (data) => this.updatePlayerName(data);
        phaserEvents.on('player-name-update', this.boundUpdatePlayerName);
    }

    updatePlayerName(data) {
        // networkManagerからsessionIdを取得
        const networkManager = this.scene.networkManager;
        const mySessionId = networkManager?.getSessionId();

        if (!mySessionId) {
            console.warn('[CharacterView] SessionId not available for player name update');
            return;
        }

        // 自分のキャラクターか敵のキャラクターかを判定
        const isMyself = data.sessionId === mySessionId;
        const shouldUpdate = (isMyself && !this.isRight) || (!isMyself && this.isRight);

        console.log(
            `[CharacterView] Player name update - SessionId: ${data.sessionId}, MySessionId: ${mySessionId}, IsMyself: ${isMyself}, IsRight: ${this.isRight}, ShouldUpdate: ${shouldUpdate}, Name: ${data.name}`,
        );

        if (shouldUpdate) {
            this.character.name = data.name;
            
            // nameTextが存在し、破棄されていない場合のみ更新
            if (this.nameText && this.nameText.active) {
                this.nameText.setText(`${this.character.name}: 準備中`);
                console.log(`[CharacterView] Updated player name to: ${this.character.name}`);
            } else {
                console.warn('[CharacterView] nameText is null or destroyed, cannot update player name');
            }
        }
    }

    showSkillLog(text) {
        this.skillLog.showLog(text);
        // スキル使用時に攻撃アニメーションを再生（Characterクラスのメソッドを使用）
        this.character.playAttackAnimation();
    }

    setReady(isReady) {
        const displayName = this.character.name || 'プレイヤー';
        
        // nameTextが存在し、破棄されていない場合のみ更新
        if (this.nameText && this.nameText.active) {
            this.nameText.setText(`${displayName}: ${isReady ? '準備完了' : '準備中'}`);
        } else {
            console.warn('[CharacterView] nameText is null or destroyed, cannot set ready status');
        }
    }

    updateBars() {
        if (this.hpBar && this.hpBar.scene) {
            this.hpBar.update(this.character.hp.current, this.character.hp.max);
        }
        if (this.mpBar && this.mpBar.scene) {
            this.mpBar.update(this.character.mp.current, this.character.mp.max);
        }
    }

    updateCount(count) {
        if (this.armorIcon && this.armorIcon.scene) {
            this.armorIcon.updateCount(count);
        }
    }

    updateBuffs(buffs) {
        if (this.buffDisplay && this.buffDisplay.scene) {
            this.buffDisplay.updateBuffs(buffs);
        }
    }

    destroy() {
        // spriteはCharacterクラスで管理されているため、ここでは削除しない
        // CharacterクラスのdestroyはGameSceneなどで呼び出される
        
        // UI要素を安全に削除
        if (this.hpBar && this.hpBar.destroy) {
            this.hpBar.destroy();
        }
        if (this.mpBar && this.mpBar.destroy) {
            this.mpBar.destroy();
        }
        if (this.skillLog && this.skillLog.destroy) {
            this.skillLog.destroy();
        }
        if (this.nameText && this.nameText.destroy) {
            this.nameText.destroy();
        }
        if (this.armorIcon && this.armorIcon.destroy) {
            this.armorIcon.destroy();
        }
        if (this.buffDisplay && this.buffDisplay.destroy) {
            this.buffDisplay.destroy();
        }

        // イベントリスナーを削除
        if (this.boundUpdatePlayerName) {
            phaserEvents.off('player-name-update', this.boundUpdatePlayerName);
        }
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y,
        };
    }
}
