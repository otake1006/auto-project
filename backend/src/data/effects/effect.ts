import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Player } from '../../rooms/schema/MyRoomState';
export type Type = 'muscular' | 'guard' | 'brittle' | 'weaknes' | 'poison';

export class effectCard extends Schema {
    @type('string') type: Type;
    @type('number') power: number;

    constructor(init?: Partial<effectCard>) {
        super();
        Object.assign(this, init);
    }

    public getBuff(player: Player) {
        switch (this.type) {
            case 'muscular':
                player.buffs.muscular += this.power;
                break;
            case 'guard':
                player.buffs.guard += this.power;
                break;
            case 'brittle':
                player.buffs.brittle += this.power;
                break;
            case 'weaknes':
                player.buffs.weaknes += this.power;
                break;
            case 'poison':
                player.buffs.poison += this.power;
                break;
        }
    }
}
