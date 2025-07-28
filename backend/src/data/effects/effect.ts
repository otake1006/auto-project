import { Schema, type, ArraySchema } from '@colyseus/schema';
export type Type =
    | 'muscular'
    | 'guard'
    | 'brittle'
    | 'weaknes'
    | 'poison'
    | 'playerReset'
    | 'enemyReset';
export type Target = 'self' | 'enemy';

export class effectCard extends Schema {
    @type('string') type: Type;
    @type('number') power: number;
    @type('string') target: Target;

    constructor(init?: Partial<effectCard>) {
        super();
        Object.assign(this, init);
    }
}
