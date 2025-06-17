export type CardType = 'skill' | 'condition' | 'relic';
export type BattleType = 'attack' | 'defense' | 'support'; // 必要に応じて拡張
export type ConditionType = 'HP_ABOVE' | 'HP_BELOW' | 'MP_ABOVE' | 'MP_BELOW'; // 例

export interface BaseCard {
    id: number;
    name: string;
    description: string;
    ability?: string;
    type: CardType;
    imgSrc: string;
}

// Skillカード
export interface SkillCard extends BaseCard {
    type: 'skill';
    energy: number;
    damage: number;
    battleType: BattleType;
    attackCount: number;
}

// Conditionカード
export interface ConditionCard extends BaseCard {
    type: 'condition';
    conditionType: ConditionType;
    value: number;
}

// Relicカード
export interface RelicCard extends BaseCard {
    type: 'relic';
    energy?: number;
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
    {
        id: 1,
        name: '乱数調整',
        energy: 20,
        description: '次のターン開始時 エナジー2回復',
        ability: 'ダメージ 2',
        type: 'skill',
        damage: 20,
        battleType: 'attack',
        attackCount: 1,
        imgSrc: '/hitokage.png',
    },
    {
        id: 2,
        name: '炎弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 2',
        type: 'skill',
        damage: 2,
        battleType: 'attack',
        attackCount: 1,
        imgSrc: '/hitokage.png',
    },
];

export const conditionCards: ConditionCard[] = [
    {
        id: 3,
        name: 'HP49より上',
        description: '次のターンから2ダメージ継続',
        ability: '',
        type: 'condition',
        conditionType: 'HP_ABOVE',
        value: 49,
        imgSrc: '/hitokage.png',
    },
];

export const relicCards: RelicCard[] = [
    {
        id: 4,
        name: '聖なる指輪',
        energy: 0,
        description: '自動で毎ターン回復+1',
        ability: '',
        type: 'relic',
        imgSrc: '/hitokage.png',
    },
];
