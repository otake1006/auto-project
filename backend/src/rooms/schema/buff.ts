import { Schema, type } from '@colyseus/schema';
import { Player } from '../../rooms/schema/MyRoomState';
import { effectCard } from '../../data/effects/effect';
export class buff extends Schema {
    @type('number') muscular: number = 0; //筋肉
    @type('number') guard: number = 0; //ガード値
    @type('number') brittle: number = 0; //脆い
    @type('number') weaknes: number = 0; //弱体
    @type('number') poison: number = 0; //毒

    public brittleCheck() {
        if (this.brittle > 0) {
            this.brittle -= 1;
            return 0.75;
        }
        return 1;
    }

    public weaknesCheck() {
        if (this.weaknes > 0) {
            this.weaknes -= 1;
            return 1.5;
        }
        return 1;
    }

    public reset() {
        this.muscular = 0;
        this.guard = 0;
        this.brittle = 0;
        this.weaknes = 0;
        this.poison = 0;
    }

    public getBuff(player: Player, enemy: Player, effect: effectCard) {
        const target = effect.target === 'self' ? player : enemy;
        switch (effect.type) {
            case 'muscular':
                target.buffs.muscular += effect.power;
                break;
            case 'guard':
                target.buffs.guard += effect.power;
                break;
            case 'brittle':
                target.buffs.brittle += effect.power;
                break;
            case 'weaknes':
                target.buffs.weaknes += effect.power;
                break;
            case 'poison':
                target.buffs.poison += effect.power;
                break;
            case 'playerReset':
                player.buffs.reset();
                break;
            case 'enemyReset':
                enemy.buffs.reset();
                break;
        }
    }
}
