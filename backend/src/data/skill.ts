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

export const skillCards: SkillCard[] = [
    new SkillCard({
        id: 1,
        name: '乱数調整',
        energy: 20,
        description: '次のターン開始時 エナジー2回復',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 2,
        name: '炎弾',
        energy: 15,
        description: '炎弾を打ち出す',
        ability: 'ダメージ 15',
        damage: 15,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 3,
        name: '水弾',
        energy: 5,
        description: '水弾を打ち出す',
        ability: 'ダメージ 5',
        damage: 5,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 4,
        name: '雷弾',
        energy: 55,
        description: '雷弾を打ち出す',
        ability: 'ダメージ 50',
        damage: 50,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 5,
        name: '跳弾',
        energy: 15,
        description: '弾が何度も跳ね返りダメージを与える',
        ability: 'ダメージ 5×4',
        damage: 5,
        battleType: 'attack',
        Count: 4,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 6,
        name: 'ファイア',
        energy: 5,
        description: 'この炎はほんのり温かい',
        ability: 'ダメージ 5',
        damage: 5,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 7,
        name: 'サンダー',
        energy: 10,
        description: '雷の力を借りて攻撃する',
        ability: 'ダメージ 10',
        damage: 10,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 8,
        name: '連続切り',
        energy: 10,
        description: '連続で切りつける',
        ability: 'ダメージ 10',
        damage: 2,
        battleType: 'attack',
        Count: 5,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 9,
        name: '麻酔銃',
        energy: 5,
        description: '当たったら像でも麻痺するぞ！',
        ability: 'ダメージ 5',
        damage: 5,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 10,
        name: '大盾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'defense',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
];
