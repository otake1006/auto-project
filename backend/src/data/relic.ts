import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';

// 聖遺物の効果タイプを定義
export enum RelicEffectType {
    PERMANENT = 'permanent', // 永続効果
    SKILL_MODIFIER = 'skill_modifier', // スキル追加効果
    ON_OBTAIN = 'on_obtain', // 入手時効果
}

// 永続効果のトリガータイミング
export enum PermanentTrigger {
    TURN_START = 'turn_start', // ターン開始時
    TURN_END = 'turn_end', // ターン終了時
    ROUND_START = 'round_start', // ラウンド開始時
    ROUND_END = 'round_end', // ラウンド終了時
    SPECIFIC_TURN = 'specific_turn', // 特定ターン
}

// スキル修飾効果のタイプ
export enum SkillModifierType {
    LIFE_STEAL = 'life_steal', // ライフスティール
    COMBO_DAMAGE = 'combo_damage', // コンボダメージ
}

// 入手時効果のタイプ
export enum OnObtainType {
    ADD_CARD = 'add_card', // カード追加
}

// 効果データの基底インターフェース
export interface BaseEffectData {
    type: RelicEffectType;
}

// 永続効果データ
export interface PermanentEffectData extends BaseEffectData {
    type: RelicEffectType.PERMANENT;
    trigger: PermanentTrigger;
    effectType: 'stat_boost' | 'damage' | 'heal' | 'shield';
    value: number;
    targetStat?: 'strength' | 'guard' | 'hp' | 'shield';
    damageType?: 'fixed' | 'percentage_max_hp';
    specificTurn?: number; // 特定ターン用
}

// スキル修飾効果データ
export interface SkillModifierEffectData extends BaseEffectData {
    type: RelicEffectType.SKILL_MODIFIER;
    modifierType: SkillModifierType;
    value: number;
    condition?: {
        minSkillTypes?: number; // 最小スキル種類数
    };
}

// 入手時効果データ
export interface OnObtainEffectData extends BaseEffectData {
    type: RelicEffectType.ON_OBTAIN;
    obtainType: OnObtainType;
    value: number; // カード数など
}

export type RelicEffectData = PermanentEffectData | SkillModifierEffectData | OnObtainEffectData;

export class RelicCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') imgSrc: string;
    @type('string') ability?: string;

    // 効果データ（JSONとして保存、実際の使用時にパース）
    effectData: RelicEffectData;

    constructor(init?: Partial<RelicCard> & { effectData: RelicEffectData }) {
        super();
        if (init) {
            this.id = init.id || 0;
            this.name = init.name || '';
            this.description = init.description || '';
            this.imgSrc = init.imgSrc || '';
            this.ability = init.ability;
            this.effectData = init.effectData;
        }
    }

    // 永続効果かどうかチェック
    isPermanentEffect(): this is RelicCard & { effectData: PermanentEffectData } {
        return this.effectData.type === RelicEffectType.PERMANENT;
    }

    // スキル修飾効果かどうかチェック
    isSkillModifierEffect(): this is RelicCard & { effectData: SkillModifierEffectData } {
        return this.effectData.type === RelicEffectType.SKILL_MODIFIER;
    }

    // 入手時効果かどうかチェック
    isOnObtainEffect(): this is RelicCard & { effectData: OnObtainEffectData } {
        return this.effectData.type === RelicEffectType.ON_OBTAIN;
    }
}

export function getRelic(id: number): RelicCard | undefined {
    return relicCards.find((card) => card.id === id);
}

export const relicCards: RelicCard[] = [
    // 既存のレリック（ラウンド終了時HP回復）
    new RelicCard({
        id: 1,
        name: '聖なる指輪',
        description: 'ラウンド終了時HPを10回復',
        imgSrc: '/hitokage.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.ROUND_END,
            effectType: 'heal',
            value: 10,
        },
    }),

    // ６ターン目開始時に敵の最大HPの２５％の固定ダメージ
    new RelicCard({
        id: 2,
        name: '時の審判',
        description: '６ターン目開始時に敵の最大HPの２５％の固定ダメージ',
        imgSrc: '/time_judgment.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.SPECIFIC_TURN,
            effectType: 'damage',
            value: 25,
            damageType: 'percentage_max_hp',
            specificTurn: 6,
        },
    }),

    // ターン開始時に筋力を２プラス
    new RelicCard({
        id: 3,
        name: '力の護符',
        description: 'ターン開始時に筋力を２プラス',
        imgSrc: '/strength_amulet.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.TURN_START,
            effectType: 'stat_boost',
            value: 2,
            targetStat: 'strength',
        },
    }),

    // ターン開始時にガード値を２プラス
    new RelicCard({
        id: 4,
        name: '守護の盾',
        description: 'ターン開始時にガード値を２プラス',
        imgSrc: '/guard_shield.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.TURN_START,
            effectType: 'stat_boost',
            value: 2,
            targetStat: 'guard',
        },
    }),

    // ラウンド開始時にシールドを１５もらう
    new RelicCard({
        id: 5,
        name: '防壁の石',
        description: 'ラウンド開始時にシールドを１５もらう',
        imgSrc: '/barrier_stone.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.ROUND_START,
            effectType: 'shield',
            value: 15,
        },
    }),

    // ターン終了時ＨＰを５回復
    new RelicCard({
        id: 6,
        name: '回復の薬草',
        description: 'ターン終了時ＨＰを５回復',
        imgSrc: '/healing_herb.png',
        effectData: {
            type: RelicEffectType.PERMANENT,
            trigger: PermanentTrigger.TURN_END,
            effectType: 'heal',
            value: 5,
        },
    }),

    // 攻撃の５％だけＨＰを回復する
    new RelicCard({
        id: 7,
        name: '吸血の牙',
        description: '攻撃の５％だけＨＰを回復する',
        imgSrc: '/vampire_fang.png',
        effectData: {
            type: RelicEffectType.SKILL_MODIFIER,
            modifierType: SkillModifierType.LIFE_STEAL,
            value: 5,
        },
    }),

    // このターンに発動したスキルの種類が３種類以上でターン終了時２０ダメージ
    new RelicCard({
        id: 8,
        name: '連携の印',
        description: 'このターンに発動したスキルの種類が３種類以上でターン終了時２０ダメージ',
        imgSrc: '/combo_seal.png',
        effectData: {
            type: RelicEffectType.SKILL_MODIFIER,
            modifierType: SkillModifierType.COMBO_DAMAGE,
            value: 20,
            condition: {
                minSkillTypes: 3,
            },
        },
    }),

    // レリックを入手した時にカードを追加でゲットできる
    new RelicCard({
        id: 9,
        name: '宝探しの羅針盤',
        description: 'レリックを入手した時にカードを１枚追加でゲットできる',
        imgSrc: '/treasure_compass.png',
        effectData: {
            type: RelicEffectType.ON_OBTAIN,
            obtainType: OnObtainType.ADD_CARD,
            value: 1,
        },
    }),
];

// 使用例: 効果を処理するヘルパー関数
export class RelicEffectProcessor {
    // 永続効果を処理
    static processPermanentEffect(relic: RelicCard, trigger: PermanentTrigger, context: any) {
        if (!relic.isPermanentEffect()) return;

        const effect = relic.effectData;
        if (effect.trigger !== trigger) return;

        switch (effect.effectType) {
            case 'stat_boost':
                // ステータス上昇処理
                if (effect.targetStat) {
                    context.player[effect.targetStat] += effect.value;
                }
                break;
            case 'heal':
                // 回復処理
                context.player.hp += effect.value;
                break;
            case 'shield':
                // シールド付与処理
                context.player.shield += effect.value;
                break;
            case 'damage':
                // ダメージ処理
                let damage = effect.value;
                if (effect.damageType === 'percentage_max_hp') {
                    damage = Math.floor((context.enemy.maxHp * effect.value) / 100);
                }
                context.enemy.hp -= damage;
                break;
        }
    }

    // スキル修飾効果を処理
    static processSkillModifierEffect(relic: RelicCard, skillDamage: number, context: any) {
        if (!relic.isSkillModifierEffect()) return;

        const effect = relic.effectData;

        switch (effect.modifierType) {
            case SkillModifierType.LIFE_STEAL:
                const healAmount = Math.floor((skillDamage * effect.value) / 100);
                context.player.hp += healAmount;
                break;
            case SkillModifierType.COMBO_DAMAGE:
                if (
                    effect.condition?.minSkillTypes &&
                    context.usedSkillTypes.size >= effect.condition.minSkillTypes
                ) {
                    context.enemy.hp -= effect.value;
                }
                break;
        }
    }

    // 入手時効果を処理
    static processOnObtainEffect(relic: RelicCard, context: any) {
        if (!relic.isOnObtainEffect()) return;

        const effect = relic.effectData;

        switch (effect.obtainType) {
            case OnObtainType.ADD_CARD:
                // カード追加処理
                context.addRandomCards(effect.value);
                break;
        }
    }
}
