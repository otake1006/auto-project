import { Schema, type, ArraySchema } from '@colyseus/schema';
export type Type = 'muscular' | 'guard' | 'brittle' | 'weaknes' | 'poison';

export class effectCard extends Schema {
    @type('string') type: Type;
    @type('number') power: number;

    constructor(init?: Partial<effectCard>) {
        super();
        Object.assign(this, init);
    }
}
