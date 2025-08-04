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
    public stat_boost(player: Player, target: Player) {
        const effect = this.Effect as PermanentRelic;
        switch (effect.targetStat) {
            case 'muscular':
                player.buffs.muscular += effect.value;
                break;
            case 'guard':
                player.buffs.guard += effect.value;
                break;
            case 'weaknes':
                target.buffs.weaknes += effect.value;
                break;
            case 'brittle':
                target.buffs.brittle += effect.value;
                break;
            case 'poison':
                target.buffs.poison += effect.value;
                break;
            case 'shield':
                console.log('シールド');
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
                if (damage) {
                    player.hp += Math.round((damage * effect.value) / 100);
                }
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

export function getRelicCard(id: number): RelicCard | undefined {
    let Relic = new RelicCard(RelicCards.find((card) => card.id === id));
    return Relic;
}

export function shuffle<T>(array: T[]) {
    const out = Array.from(array);
    for (let i = out.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[r];
        out[r] = tmp;
    }
    return out;
}

export function selectRandomRelics(arrayRelics: RelicCard[]): RelicCard[] {
    const xIds = new Set(arrayRelics.map((card) => card.id));

    // Card から x に含まれていないカードを抽出
    const missing = RelicCards.filter((card) => !xIds.has(card.id));

    // シャッフル
    const shuffledRelics = shuffle(missing);

    // 最初の3つを返す（足りなければ全部）
    return shuffledRelics.slice(0, 3);
}

export const RelicCards: RelicCard[] = [
    new RelicCard({
        id: 1,
        name: '力の加護',
        description: 'スキルを使用するたび３ダメージ',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'skill_modifier',
            SkillModifierType: 'countDamage',
            value: 3,
        },
    }),
    new RelicCard({
        id: 2,
        name: '守りの加護',
        description: 'スキルを使用するたび２シールド',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'skill_modifier',
            SkillModifierType: 'countShield',
            value: 2,
        },
    }),
    new RelicCard({
        id: 3,
        name: '吸血の加護',
        description: '与えたダメージの10%回復',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'skill_modifier',
            SkillModifierType: 'life_steal',
            value: 10,
        },
    }),
    new RelicCard({
        id: 4,
        name: '魔法のプロテイン',
        description: 'ターン開始時筋力１を得る',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_start',
            effectType: 'stat_boost',
            value: 1,
            targetStat: 'muscular',
        },
    }),
    new RelicCard({
        id: 5,
        name: '増殖鎧',
        description: 'ターン開始時ガード値２を得る',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_start',
            effectType: 'stat_boost',
            value: 2,
            targetStat: 'guard',
        },
    }),
    new RelicCard({
        id: 6,
        name: '臨時シールド',
        description: 'ターン開始時１０シールドを得る',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_start',
            effectType: 'stat_boost',
            value: 10,
            targetStat: 'shield',
        },
    }),
    new RelicCard({
        id: 7,
        name: '溶解液',
        description: 'ターン開始時敵に弱体化３を与える',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_start',
            effectType: 'stat_boost',
            value: 3,
            targetStat: 'weaknes',
        },
    }),
    new RelicCard({
        id: 8,
        name: 'やる気ダウン剤',
        description: 'ターン開始時敵に脆弱化３を与える',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_start',
            effectType: 'stat_boost',
            value: 3,
            targetStat: 'brittle',
        },
    }),
    new RelicCard({
        id: 9,
        name: '天使の加護',
        description: 'ターン終了時にＨＰを５回復する',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_end',
            effectType: 'heal',
            value: 5,
        },
    }),
    new RelicCard({
        id: 10,
        name: 'プラズマチャージ',
        description: 'ターン終了時に使用したスキルが３種類以上で２０ダメージ',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_end',
            effectType: 'damage',
            value: 20,
            damageType: 'skillCountDamage',
            specificTurn: 3,
        },
    }),
    new RelicCard({
        id: 10,
        name: '呪いの人形',
        description: '６ターン目終了時に敵の最大ＨＰ２５％分のダメージ',
        imgSrc: '/fc290.png',
        Effect: {
            type: 'permanent',
            trigger: 'turn_end',
            effectType: 'damage',
            value: 25,
            damageType: 'percentage_max_hp',
            specificTurn: 6,
        },
    }),
];
