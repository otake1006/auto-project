import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
import { Player } from '../rooms/schema/MyRoomState';

//レリックタイプ　永続・追加効果・入手時
export type RelicEffectType = 'permanent' | 'skill_modifier' | 'on_obtain';

//永続効果
export type PermanentTrigger =
    | 'turn_start'
    | 'turn_end'
    | 'round_start'
    | 'round_end'
    | 'specific_turn_Start'
    | 'specific_turn_End'; //永続効果のトリガータイミング
export type PermanentEffectType = 'stat_boost' | 'damage' | 'heal'; //永続効果のタイプ
export type targetStat = 'muscular' | 'guard' | 'weaknes' | 'brittle' | 'poison' | 'shield'; //永続効果のターゲットステータス

//スキルの修飾効果
export type SkillModifierType = 'life_steal' | 'countDamage' | 'countShield'; //スキル修飾効果

//スキル入手時
export type OnObtainType = 'add_card'; //入手時効果のタイプ

//永続レリックのインターフェース
export interface PermanentRelic {
    type: RelicEffectType | 'permanent';
    trigger: PermanentTrigger; //いつ発動するのか
    effectType: PermanentEffectType; //効果の種類
    value: number;
    targetStat?: targetStat; //どのバフを変更するか
    damageType?:
        | 'fixed'
        | 'percentage_max_hp'
        | 'shieldDamage'
        | 'muscularDamage'
        | 'skillCountDamage'; //ダメージタイプ
    specificTurn?: number; //特定ターン用
}

//スキル修飾レリックのインターフェース
export interface SkillModifierRelic {
    type: RelicEffectType | 'skill_modifier';
    SkillModifierType: SkillModifierType;
    value?: number;
}

//入手時効果レリックのインターフェース
export interface OnObtainEffectRelic {
    type: RelicEffectType | 'on_obtain';
    obtainType: OnObtainType;
    value: number; // カード数など
}

export type RelicEffect = PermanentRelic | SkillModifierRelic | OnObtainEffectRelic;

export class RelicCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') imgSrc: string;
    @type('string') ability?: string;
    Effect: RelicEffect;

    constructor(init?: Partial<RelicCard>) {
        super();
        if (init) {
            this.id = init.id ?? 0;
            this.name = init.name ?? '';
            this.description = init.description ?? '';
            this.imgSrc = init.imgSrc ?? '';
            this.Effect = init.Effect;
        }
    }

    public checkRelicType() {
        if (this.Effect.type === 'permanent') {
            return 'permanent';
        } else if (this.Effect.type === 'skill_modifier') {
            return 'skill_modifier';
        } else if (this.Effect.type === 'on_obtain') {
            return 'on_obtain';
        }
        return null;
    }

    //永続レリックのスタッツ効果
    public stat_boost(player: Player) {
        const effect = this.Effect as PermanentRelic;
        switch (effect.targetStat) {
            case 'muscular':
                player.buffs.muscular += effect.value;
                break;
            case 'guard':
                player.buffs.guard += effect.value;
                break;
            case 'weaknes':
                player.buffs.weaknes += effect.value;
                break;
            case 'brittle':
                player.buffs.brittle += effect.value;
                break;
            case 'poison':
                player.buffs.poison += effect.value;
                break;
            case 'shield':
                player.shield += effect.value;
        }
    }

    //永続レリックのダメージ効果
    public relicDamage(player: Player, target: Player, turn: number) {
        const effect = this.Effect as PermanentRelic;
        switch (effect.damageType) {
            case 'fixed':
                if (this.turnCheck(turn)) {
                    const HPdamage = Math.max(0, effect.value - target.shield);
                    target.shield = Math.max(0, target.shield - effect.value);
                    target.hp = Math.max(0, target.hp - HPdamage);
                }
                break;
            case 'percentage_max_hp':
                if (this.turnCheck(turn)) {
                    target.hp = Math.max(0, target.hp - target.maxhp * (effect.value / 100));
                }
                break;
            case 'muscularDamage':
                if (this.turnCheck(turn)) {
                    const HPdamage = Math.max(0, player.buffs.muscular - target.shield);
                    target.shield = Math.max(0, target.shield - player.buffs.muscular);
                    target.hp = Math.max(0, target.hp - HPdamage);
                }
                break;
            case 'shieldDamage':
                if (this.turnCheck(turn)) {
                    const HPdamage = Math.max(0, player.shield - target.shield);
                    target.shield = Math.max(0, target.shield - player.shield);
                    target.hp = Math.max(0, target.hp - HPdamage);
                }
            case 'skillCountDamage':
                if (player.useSkills.length >= effect.specificTurn) {
                    const HPdamage = Math.max(0, effect.value - target.shield);
                    target.shield = Math.max(0, target.shield - effect.value);
                    target.hp = Math.max(0, target.hp - HPdamage);
                }
        }
    }

    //永続レリックのHP回復効果
    public relicHeal(player: Player, turn: number) {
        const effect = this.Effect as PermanentRelic;
        if (this.turnCheck(turn)) {
            player.hp += effect.value;
        }
    }

    //永続レリックのターンチェック
    public turnCheck(turn: number) {
        const effect = this.Effect as PermanentRelic;
        if (turn === effect.specificTurn || !effect.specificTurn) {
            return true;
        }
        return false;
    }

    public skill_modifier(player: Player, target: Player, damage?: number) {
        const effect = this.Effect as SkillModifierRelic;
        switch (effect.SkillModifierType) {
            case 'life_steal':
                player.hp += damage;
                break;
            case 'countDamage':
                const HPdamage = Math.max(0, effect.value - target.shield);
                target.shield = Math.max(0, target.shield - effect.value);
                target.hp = Math.max(0, target.hp - HPdamage);
                break;
            case 'countShield':
                player.shield += effect.value;
                break;
        }
    }
}

export const RelicCards: RelicCard[] = [
    new RelicCard({
        id: 1,
        name: '力の加護',
        description: 'スキルを使用するたびダメージ５',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'skill_modifier',
            SkillModifierType: 'countDamage',
            value: 5,
        },
    }),
];
