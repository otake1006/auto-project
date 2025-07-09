import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
import { getSkillCard, getCondition } from '../data/card';
import { MyRoomState, Player } from '../rooms/schema/MyRoomState2';
import { Client } from '@colyseus/core';

export class SkillService {
    private state: MyRoomState;
    constructor(state: MyRoomState) {
        this.state = state;
    }
    selectSkill(sessionId: string) {
        const player = this.state.players.get(sessionId);
        const context = { hp: player.hp, mp: player.mp };
        for (const set of player.skill) {
            if (
                set.skill &&
                context.mp >= getSkillCard(set.skill).energy &&
                this.evaluateAllConditions(set.conditions, context)
            ) {
                return set.skill;
            }
        }
        return null;
    }

    selectAllSkills() {
        const skills: number[] = [];
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        const player1skill = this.selectSkill(sessionId1);
        const player2skill = this.selectSkill(sessionId2);
        skills.push(player1skill, player2skill);
        return skills;
    }
    useSkill(skillId: number, player: Player, target: Player) {
        if (!skillId) return;
        const skill = getSkillCard(skillId);
        const damage = skill.damage * skill.Count;
        if (skill.battleType === 'attack') {
            player.mp -= skill.energy;
            const HPdamage = Math.max(0, damage - target.shield);
            target.shield = Math.max(0, target.shield - damage);
            target.hp = Math.max(0, target.hp - HPdamage);
        }
        if (skill.battleType === 'defense') {
            player.mp -= skill.energy;
            player.shield = Math.min(player.maxshield, player.shield + damage);
        }
    }

    useAllSkill() {
        const skills = this.selectAllSkills();
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        const player1skill = skills[0];
        const player2skill = skills[1];
        const skill = getSkillCard(player2skill);
        if (skill.battleType === 'defense') {
            this.useSkill(player2skill, player1, player2);
            this.useSkill(player1skill, player2, player1);
        } else {
            this.useSkill(player1skill, player2, player1);
            this.useSkill(player2skill, player1, player2);
        }
    }

    evaluateCondition(condition: Condition, context: any) {
        if (!getCondition(condition)) return true;

        const Condition = getCondition(condition);
        Condition.value = condition.value;
        switch (Condition.conditionType) {
            case 'HP_ABOVE':
                return context.hp >= Condition.value;
            case 'HP_BELOW':
                return context.hp <= Condition.value;
            case 'MP_ABOVE':
                return context.mp >= Condition.value;
            case 'MP_BELOW':
                return context.mp <= Condition.value;
            // 追加条件にも対応可能
            default:
                return false;
        }
    }

    evaluateAllConditions(conditions: ArraySchema, context: any) {
        return conditions.every((cond) => this.evaluateCondition(cond, context));
    }
}
