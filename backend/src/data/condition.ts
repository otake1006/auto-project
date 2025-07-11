import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
export type ConditionType = 'HP_ABOVE' | 'HP_BELOW' | 'MP_ABOVE' | 'MP_BELOW';

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

export const conditionCards: ConditionCard[] = [
    new ConditionCard({
        id: 1,
        name: 'HP以上',
        description: '次のターンから2ダメージ継続',
        conditionType: 'HP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 2,
        name: 'HP以下',
        description: '次のターンから2ダメージ継続',
        conditionType: 'HP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 3,
        name: 'MP以上',
        description: '次のターンから2ダメージ継続',
        conditionType: 'MP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
    new ConditionCard({
        id: 4,
        name: 'MP以下',
        description: '次のターンから2ダメージ継続',
        conditionType: 'MP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
];
