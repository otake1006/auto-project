import { ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
import { getSkillCard, SkillCard } from '../data/skill';
import { getCondition } from '../data/condition';
import { MyRoomState, Player } from '../rooms/schema/MyRoomState';
import { MyRoom } from '../rooms/Room';
import { buff } from '../rooms/schema/buff';
import { PermanentRelic, SkillModifierRelic, OnObtainEffectRelic, RelicCard } from '../data/Relics';
import { GameConfig } from '../config/game';

export class SkillService {
    private state: MyRoomState;
    private room: MyRoom;
    private startturn: boolean = true;

    constructor(room: MyRoom) {
        this.room = room;
        this.state = room.state;
    }
    private selectSkill(playersessionId: string, enemySessionId: string) {
        const player = this.state.players.get(playersessionId);
        const enemy = this.state.players.get(enemySessionId);
        for (const set of player.skill) {
            if (
                set.skill &&
                player.mp >= getSkillCard(set.skill).energy &&
                this.evaluateAllConditions(set.conditions, player, enemy, set.skill)
            ) {
                return set.skill;
            }
        }
        return null;
    }

    private selectAllSkills() {
        const skills: number[] = [];
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        const player1skill = this.selectSkill(sessionId1, sessionId2);
        const player2skill = this.selectSkill(sessionId2, sessionId1);
        skills.push(player1skill, player2skill);
        console.log(skills);
        return skills;
    }

    private useSkill(skillId: number, player: Player, target: Player) {
        if (!skillId) return;
        const skill = getSkillCard(skillId);
        player.useSkills.push(skillId); //使用したスキルを記録
        player.mp -= skill.energy;
        if (skill.battleType === 'attack') {
            const damage = this.damageCalculation(skill, player.buffs, target.buffs);
            const HPdamage = Math.max(0, damage - target.shield);
            target.shield = Math.max(0, target.shield - damage);
            target.hp = Math.max(0, target.hp - HPdamage);
            this.skillModifierEffect(player, target, HPdamage);
        }
        if (skill.battleType === 'defense') {
            const shield = (skill.damage + player.buffs.guard) * skill.Count;
            player.shield = Math.min(player.maxshield, player.shield + shield);
            this.skillModifierEffect(player, target);
        }
        if (skill.battleType === 'effect') {
            for (const effect of skill.effects) {
                player.buffs.getBuff(player, target, effect);
            }
            this.skillModifierEffect(player, target);
        }
    }

    public damageCalculation(skill: SkillCard, playerBuff: buff, targetBuff: buff) {
        return Math.round(
            (skill.damage + playerBuff.muscular) *
                playerBuff.brittleCheck() *
                targetBuff.weaknesCheck() *
                skill.Count,
        );
    }

    public useAllSkill() {
        if (this.startturn) {
            //ターン開始時のレリック発動
            this.PermanentEffectAll(GameConfig.TURN_START);
            this.startturn = false;
        }
        const skills = this.selectAllSkills();
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        const player1skill = skills[0];
        const player2skill = skills[1];
        const skill = getSkillCard(player2skill);
        if (skill.battleType === 'defense') {
            this.useSkill(player2skill, player2, player1);
            this.useSkill(player1skill, player1, player2);
            this.room.broadcast('skillLogs', [
                { sessionId: sessionId1, skill: getSkillCard(player1skill)?.name },
                { sessionId: sessionId2, skill: getSkillCard(player2skill)?.name },
            ]);
        } else {
            this.useSkill(player1skill, player1, player2);
            this.useSkill(player2skill, player2, player1);
            this.room.broadcast('skillLogs', [
                { sessionId: sessionId2, skill: getSkillCard(player2skill)?.name },
                { sessionId: sessionId1, skill: getSkillCard(player1skill)?.name },
            ]);
        }
        if (!player1skill && !player2skill) {
            player1.resetMp();
            player2.resetMp();
            player1.resetShield();
            player2.resetShield();

            //ターン終了時のレリック発動
            this.PermanentEffectAll(GameConfig.TURN_END);

            this.state.turn++;
            this.startturn = true;
            player1.useSkills = [];
            player2.useSkills = [];
            this.room.broadcast('turn', this.state.turn);
        }
    }

    private useDebuff(debuffskill: SkillCard) {}

    private evaluateCondition(
        condition: Condition,
        player: Player,
        enemy: Player,
        skillId: number,
    ) {
        if (!getCondition(condition)) return true;

        const Condition = getCondition(condition);
        Condition.value = condition.value;
        switch (Condition.conditionType) {
            case 'HP_ABOVE':
                return player.hp >= Condition.value;
            case 'HP_BELOW':
                return player.hp <= Condition.value;
            case 'MP_ABOVE':
                return player.mp >= Condition.value;
            case 'MP_BELOW':
                return player.mp <= Condition.value;
            case 'USE_SKILL':
                return !player.useSkills.includes(skillId);
            case 'ENEMY_HP_ABOVE':
                return enemy.hp >= Condition.value;
            case 'ENEMY_HP_BELOW':
                return enemy.hp <= Condition.value;
            case 'ENEMY_MP_ABOVE':
                return enemy.mp >= Condition.value;
            case 'ENEMY_MP_BELOW':
                return enemy.mp <= Condition.value;
            // 追加条件にも対応可能
            default:
                return false;
        }
    }

    private evaluateAllConditions(
        conditions: ArraySchema,
        player: Player,
        enemy: Player,
        skillId: number,
    ) {
        return conditions.every((cond) => this.evaluateCondition(cond, player, enemy, skillId));
    }

    public PermanentEffectAll(trigger: string) {
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        this.PermanentEffect(player1, player2, trigger);
        this.PermanentEffect(player2, player1, trigger);
    }

    public PermanentEffect(player: Player, target: Player, Trigger: string) {
        if (!player.relics) return;

        for (const relic of player.relics) {
            if (relic.Effect.type === 'permanent') {
                const effect = relic.Effect as PermanentRelic;
                if (effect.trigger === Trigger) {
                    switch (effect.effectType) {
                        case 'stat_boost':
                            relic.stat_boost(player);
                            break;
                        case 'damage':
                            relic.relicDamage(player, target, this.state.turn);
                            break;
                        case 'heal':
                            relic.relicHeal(player, this.state.turn);
                            break;
                    }
                }
            }
        }
    }

    public skillModifierEffect(player: Player, target: Player, damage?: number) {
        if (!player.relics) return;
        for (const relic of player.relics) {
            if (relic.Effect.type === 'skill_modifier') {
                const effect = relic.Effect as SkillModifierRelic;
                relic.skill_modifier(player, target, damage);
            }
        }
    }
}
