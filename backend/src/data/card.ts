import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Condition, Skill } from '../rooms/schema/Skill';
export type BattleType = 'attack' | 'defense' | 'support'; // 必要に応じて拡張
export type ConditionType = 'HP_ABOVE' | 'HP_BELOW' | 'MP_ABOVE' | 'MP_BELOW'; // 例

// Skillカード
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

// Conditionカード
export class ConditionCard extends Schema {
    @type('number') id: number;
    @type('string') name: string;
    @type('string') description: string;
    @type('string') type: 'condition' = 'condition';
    @type('string') conditionType: ConditionType;
    @type('number') value: number;
    @type('string') imgSrc: string;
    @type('string') ability?: string;
    @type('string') groupId: string;

    constructor(init?: Partial<ConditionCard>) {
        super();
        Object.assign(this, init);
    }
}

// Relicカード
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

export function getSkillCard(id: number): SkillCard | undefined {
    let Skill = new SkillCard(skillCards.find((card) => card.id === id));
    return Skill;
}

export function getCondition(condition: Condition): ConditionCard | undefined {
    return conditionCards.find((card) => card.id === condition.id);
}

export function getRelic(id: number): RelicCard | undefined {
    return relicCards.find((card) => card.id === id);
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

// export function selectRandomSkills(): SkillCard[] {
//     const shuffledCards = shuffle(skillCards);
//     return shuffledCards.slice(0, 3); // 最初の3つを返す
// }

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
        ability: 'ダメージ 2',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 2,
        name: '炎弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 3,
        name: '水弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 4,
        name: '雷弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 5,
        name: '跳弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 6,
        name: 'ファイア',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 7,
        name: 'サンダー',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 8,
        name: '連続切り',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
        battleType: 'attack',
        Count: 1,
        imgSrc: '/fc290.png',
    }),
    new SkillCard({
        id: 9,
        name: '麻酔銃',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 20',
        damage: 20,
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

export const conditionCards: ConditionCard[] = [
    new ConditionCard({
        id: 1,
        name: 'HP以上',
        description: '次のターンから2ダメージ継続',
        conditionType: 'HP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 2,
        name: 'HP以下',
        description: '次のターンから2ダメージ継続',
        conditionType: 'HP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'hp',
    }),
    new ConditionCard({
        id: 3,
        name: 'MP以上',
        description: '次のターンから2ダメージ継続',
        conditionType: 'MP_ABOVE',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
    new ConditionCard({
        id: 4,
        name: 'MP以下',
        description: '次のターンから2ダメージ継続',
        conditionType: 'MP_BELOW',
        value: 0,
        imgSrc: '/fc868.png',
        ability: '',
        groupId: 'mp',
    }),
];

export const relicCards: RelicCard[] = [
    new RelicCard({
        id: 1,
        type: 'permanent',
        name: '聖なる指輪',
        description: 'ラウンド終了時HPを10回復',
        imgSrc: '/hitokage.png',
    }),
];
