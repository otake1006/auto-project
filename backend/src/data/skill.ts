import { Schema, type, ArraySchema } from '@colyseus/schema';
export type BattleType = 'attack' | 'defense' | 'effect';

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

export function getSkillCard(id: number): SkillCard | undefined {
    let Skill = new SkillCard(skillCards.find((card) => card.id === id));
    return Skill;
}

export function getInitialSkill() {
    const initialSkill = new ArraySchema<SkillCard>();
    const shuffleCard = shuffle(skillCards);

    for (let i = 0; i < 3; i++) {
        // 新しいインスタンスを作る（コピー）
        const card = shuffleCard[i];
        initialSkill.push(new SkillCard({ ...card }));
    }

    return initialSkill;
}

export function getRandomSkill() {
    const shuffleCard = shuffle(skillCards);
    return shuffleCard[1];
}

export function selectRandomSkills(arraySkills: SkillCard[]): SkillCard[] {
    const xIds = new Set(arraySkills.map((card) => card.id));

    // Card から x に含まれていないカードを抽出
    const missing = skillCards.filter((card) => !xIds.has(card.id));

    // シャッフル
    const shuffledCards = shuffle(missing);

    // 最初の3つを返す（足りなければ全部）
    return shuffledCards.slice(0, 3);
}

export function shuffle<T>(array: T[]) {
    const out = Array.from(array);
    for (let i = out.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = out[i];
        out[i] = out[r];
        out[r] = tmp;
    }
    return out;
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
        energy: 50,
        description: '雷弾を打ち出す',
        ability: 'ダメージ 50',
        damage: 40,
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
        energy: 20,
        description: '大きな盾で身を守る',
        ability: 'シールド 20',
        damage: 10,
        battleType: 'defense',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 11,
        name: '連続ガード',
        energy: 15,
        description: '連続でガードを行う',
        ability: 'シールド 10',
        damage: 2,
        battleType: 'defense',
        Count: 5,
        imgSrc: '/fc290.png',
    }),
];
