import { Schema, type } from '@colyseus/schema';
export type CardType = 'skill' | 'condition' | 'relic';
export type BattleType = 'attack' | 'defense' | 'support'; // 必要に応じて拡張
export type ConditionType = 'HP_ABOVE' | 'HP_BELOW' | 'MP_ABOVE' | 'MP_BELOW'; // 例

// Skillカード
export class SkillCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'skill' = 'skill';
    @type('number') energy: number;
    @type('number') damage: number;
    @type('string') battleType: BattleType;
    @type('number') attackCount: number;
    @type('string') imgSrc: string;
    @type('string') ability?: string;

    constructor(init?: Partial<SkillCard>) {
        super();
        Object.assign(this, init);
    }
}

// Conditionカード
export class ConditionCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'condition' = 'condition';
    @type('string') conditionType: ConditionType;
    @type('number') value: number;
    @type('string') imgSrc: string;
    @type('string') ability?: string;

    constructor(init?: Partial<ConditionCard>) {
        super();
        Object.assign(this, init);
    }
}

// Relicカード
export class RelicCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'relic' = 'relic';
    @type('string') imgSrc: string;
    @type('string') ability?: string;
    @type('number') energy?: number;

    constructor(init?: Partial<RelicCard>) {
        super();
        Object.assign(this, init);
    }
}

export function getSkillCard(id: number): SkillCard | undefined {
    return skillCards.find((card) => card.id === id);
}

export function getCondition(id: number): ConditionCard | undefined {
    return conditionCards.find((card) => card.id === id);
}

export function getRelic(id: number): RelicCard | undefined {
    return relicCards.find((card) => card.id === id);
}

export const skillCards: SkillCard[] = [
    new SkillCard({
        id: 1,
        name: '乱数調整',
        energy: 20,
        description: '次のターン開始時 エナジー2回復',
        ability: 'ダメージ 2',
        damage: 20,
        battleType: 'attack',
        attackCount: 1,
        imgSrc: '/hitokage.png',
    }),
    new SkillCard({
        id: 2,
        name: '炎弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 2',
        damage: 2,
        battleType: 'attack',
        attackCount: 1,
        imgSrc: '/hitokage.png',
    }),
];

export const conditionCards: ConditionCard[] = [
    new ConditionCard({
        id: 3,
        name: 'HP49より上',
        description: '次のターンから2ダメージ継続',
        conditionType: 'HP_ABOVE',
        value: 49,
        imgSrc: '/hitokage.png',
        ability: '',
    }),
];

export const relicCards: RelicCard[] = [
    new RelicCard({
        id: 4,
        name: '聖なる指輪',
        energy: 0,
        description: '自動で毎ターン回復+1',
        imgSrc: '/hitokage.png',
        ability: '',
    }),
];
