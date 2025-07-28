import Stat from '@/core/entities/Stat.js';
import { evaluateAllConditions } from '@/utils/conditionEvaluator';
import Skill from '@/core/entities/Skill.js';

export default class Character extends Phaser.GameObjects.Sprite {
    /**
     *
     * @param {Phaser.Scene} scene - Phaserのシーン
     * @param {number} x - 表示X座標
     * @param {number} y - 表示Y座標
     * @param {string} texture - スプライトのテクスチャキー
     * @param {string} name - キャラクター名
     * @param {number} maxHp - 最大HP
     * @param {number} maxMp - 最大MP
     * @param {Array} skills - スキル配列
     * @param {boolean} flipX - 反転フラグ
     */
    constructor(scene, x, y, texture, name, maxHp, maxMp, flipX = true, skillSets = []) {
        super(scene, x, y, texture);

        this.name = name;
        this.hp = new Stat('HP', maxHp);
        this.mp = new Stat('MP', maxMp);

        this.setScale(3);
        this.setFlipX(!flipX);
        this.initAnimations();
        this.skillSets = skillSets;

        scene.add.existing(this);
    }

    initAnimations() {
        // アニメーションの初期化は外部のjsonファイルで管理されているため、
        // ここではデフォルトのアイドルアニメーションを開始するのみ
        this.playIdle();
    }

    /**
     * アイドルアニメーションを再生
     */
    playIdle() {
        this.play('idle');
    }

    /**
     * 攻撃アニメーションを再生し、完了後にアイドルに戻る
     */
    playAttackAnimation() {
        this.play('attack');

        // アニメーション完了後にidleアニメーションに戻す
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.playIdle();
        });
    }

    /**
     * 指定されたアニメーションを再生
     * @param {string} animKey - アニメーションキー
     */
    playAnimation(animKey) {
        this.play(animKey);
    }

    /**
     * 現在再生中のアニメーションキーを取得
     * @returns {string|null} 現在のアニメーションキー
     */
    getCurrentAnimation() {
        return this.anims.currentAnim?.key || null;
    }

    /**
     * 指定されたアニメーションが再生中かどうかを判定
     * @param {string} animKey - チェックするアニメーションキー
     * @returns {boolean} 再生中かどうか
     */
    isPlayingAnimation(animKey) {
        return this.getCurrentAnimation() === animKey;
    }

    selectSkill() {
        const context = { hp: this.hp.current, mp: this.mp.current };
        for (const set of this.skillSets) {
            if (
                set.skill &&
                this.mp.current >= set.skill.energy &&
                evaluateAllConditions(set.conditions, context)
            ) {
                return set.skill;
            }
        }
        return null;
    }

    updateSkillSets(skillSetDefs) {
        this.skillSets = skillSetDefs.map((set) => ({
            id: set.id,
            skill: set.skill ? new Skill(set.skill.name, set.skill.energy, set.skill.damage) : null,
            conditions: set.conditions,
        }));
    }

    useSkill(skill, target) {
        if (!skill) return;
        this.mp.decrease(skill.energy);
        target.hp.decrease(skill.damage);
    }

    updatePlayer({ hp, mp }) {
        this.hp.current = hp;
        this.mp.current = mp;
    }

    isAlive() {
        return !this.hp.isEmpty();
    }
}
