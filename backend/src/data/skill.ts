import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
export type BattleType = 'attack' | 'defense' | 'support';

export class SkillCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'skill' = 'skill';
    @type('number') energy: number;
    @type('number') damage: number;
    @type('string') battleType: BattleType;
    @type('number') Count: number;
    @type('string') imgSrc: string;
    @type('string') ability?: string;

    constructor(init?: Partial<SkillCard>) {
        super();
        if (init) {
            this.id = init.id ?? 0;
            this.name = init.name ?? '';
            this.description = init.description ?? '';
            this.type = init.type ?? 'skill';
            this.energy = init.energy ?? 0;
            this.damage = init.damage ?? 0;
            this.battleType = init.battleType ?? 'attack';
            this.Count = init.Count ?? 0;
            this.imgSrc = init.imgSrc ?? '';
            this.ability = init.ability;
        }
    }
}
