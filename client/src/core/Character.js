import Stat from './Stat.js';
import { evaluateAllConditions } from '@/utils/conditionEvaluator';
import Skill from '@/core/Skill.js';

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
        this.setFlipX(flipX);
        this.initAnimations();
        this.skillSets = skillSets;

        scene.add.existing(this);
    }

    initAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 9,
            repeat: -1,
        });

        this.play('idle');
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
        this.hp = hp;
        this.mp = mp;
    }

    isAlive() {
        return !this.hp.isEmpty();
    }
}
