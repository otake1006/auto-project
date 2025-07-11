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
