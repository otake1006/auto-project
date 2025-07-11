import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Player } from '../../rooms/schema/MyRoomState';
export type Type = 'muscular' | 'guard';

export class buffCard extends Schema {
    @type('string') type: Type;
    @type('number') power: number;

    constructor(init?: Partial<buffCard>) {
        super();
        Object.assign(this, init);
    }
}
