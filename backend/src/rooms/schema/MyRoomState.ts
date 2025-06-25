import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from './Skill';
import { getSkillCard, getCondition, SkillCard, skillCards } from '../../data/card';

export class Player extends Schema {
    @type('string') name: string = 'player';
    @type('number') hp: number = 100;
    @type('number') mp: number = 50;
    @type('number') shield: number = 0;
    @type('number') maxhp: number = 100;
    @type('number') maxmp: number = 50;
    @type('number') ratiohp: number = 100;
    @type('number') ratiomp: number = 100;
    @type('boolean') ready: boolean = false;
    @type([Skill]) skill = new ArraySchema<Skill>();
    @type([SkillCard]) skills = new ArraySchema<SkillCard>();
    reset() {
        this.hp = this.maxhp;
        this.mp = this.maxmp;
    }

    resetMp() {
        this.mp = this.maxmp;
    }

    selectSkill() {
        const context = { hp: this.hp, mp: this.mp };
        for (const set of this.skill) {
            if (
                set.skill &&
                this.mp >= getSkillCard(set.skill).energy &&
                this.evaluateAllConditions(set.conditions, context)
            ) {
                return set.skill;
            }
        }
        return null;
    }

    useSkill(skillId: number, target: Player) {
        if (!skillId) return;
        const skill = getSkillCard(skillId);
        if (skill.battleType === 'attack') {
            this.mp -= skill.energy;
            target.hp -= skill.damage;
        }
        if (skill.battleType === 'defense') {
            this.mp -= skill.energy;
            this.shield += skill.damage;
        }
    }

    evaluateCondition(condition: Condition, context: any) {
        if (!getCondition(condition)) return true;

        const Condition = getCondition(condition);
        Condition.value = condition.value;
        switch (Condition.conditionType) {
            case 'HP_ABOVE':
                return context.hp > Condition.value;
            case 'HP_BELOW':
                return context.hp < Condition.value;
            case 'MP_ABOVE':
                return context.mp > Condition.value;
            // 追加条件にも対応可能
            default:
                return false;
        }
    }

    evaluateAllConditions(conditions: ArraySchema, context: any) {
        return conditions.every((cond) => this.evaluateCondition(cond, context));
    }
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}
