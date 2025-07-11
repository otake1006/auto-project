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

export function getRelic(id: number): RelicCard | undefined {
    return relicCards.find((card) => card.id === id);
}

export const relicCards: RelicCard[] = [
    new RelicCard({
        id: 1,
        type: 'permanent',
        name: '聖なる指輪',
        description: 'ラウンド終了時HPを10回復',
        imgSrc: '/hitokage.png',
    }),
];
