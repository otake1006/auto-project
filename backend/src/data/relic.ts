import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';

export class RelicCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: string;
    @type('string') imgSrc: string;
    @type('string') ability?: string;
    @type('number') energy?: number;

    constructor(init?: Partial<RelicCard>) {
        super();
        Object.assign(this, init);
    }
}
