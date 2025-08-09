import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
export type ConditionType =
    | 'HP_ABOVE'
    | 'HP_BELOW'
    | 'MP_ABOVE'
    | 'MP_BELOW'
    | 'USE_SKILL'
    | 'ENEMY_HP_ABOVE'
    | 'ENEMY_HP_BELOW'
    | 'ENEMY_MP_ABOVE'
    | 'ENEMY_MP_BELOW';

export class ConditionCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'condition' = 'condition';
    @type('string') conditionType: ConditionType;
    @type('number') value: number;
    @type('string') imgSrc: string;
    @type('string') ability?: string;
    @type('string') groupId: string;

    constructor(init?: Partial<ConditionCard>) {
        super();
        Object.assign(this, init);
    }
}

export function getCondition(condition: Condition): ConditionCard | undefined {
    return conditionCards.find((card) => card.id === condition.id);
}

export const conditionCards: ConditionCard[] = [
    new ConditionCard({
        id: 1,
        name: 'HP以上',
        description: '自分のHPが○○以上の時',
        conditionType: 'HP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 2,
        name: 'HP以下',
        description: '自分のHPが○○以下の時',
        conditionType: 'HP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 3,
        name: 'MP以上',
        description: '自分のMPが○○以上の時',
        conditionType: 'MP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
    new ConditionCard({
        id: 4,
        name: 'MP以下',
        description: '自分のMPが○○以下の時',
        conditionType: 'MP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
    new ConditionCard({
        id: 5,
        name: 'スキル未使用',
        description: 'このターンスキルを未使用',
        conditionType: 'USE_SKILL',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'use_skill',
    }),
    new ConditionCard({
        id: 6,
        name: '敵HP以上',
        description: '敵のHPが○○以上の時',
        conditionType: 'ENEMY_HP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'enemy_hp',
    }),
    new ConditionCard({
        id: 7,
        name: '敵HP以下',
        description: '敵のHPが○○以下の時',
        conditionType: 'ENEMY_HP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'enemy_hp',
    }),
    new ConditionCard({
        id: 8,
        name: '敵MP以上',
        description: '敵のMPが○○以上の時',
        conditionType: 'ENEMY_MP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'enemy_mp',
    }),
    new ConditionCard({
        id: 9,
        name: '敵MP以下',
        description: '敵のMPが○○以下の時',
        conditionType: 'ENEMY_MP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'enemy_mp',
    }),
];
