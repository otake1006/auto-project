export const cards = [
    {
        id: 1,
        name: '乱数調整',
        energy: 1,
        description: '次のターン開始時 エナジー2回復',
        ability: 'ダメージ 2',
        type: 'skill', // 👈 分類（スキル）
        imgSrc: '/hitokage.png',
    },
    {
        id: 2,
        name: '炎弾',
        energy: 3,
        description: 'やり6を×3与える',
        ability: 'ダメージ 2',
        type: 'skill', // 👈 分類（スキル）,
        imgSrc: '/hitokage.png',
    },
    {
        id: 3,
        name: '毒の契約',
        energy: 2,
        description: '次のターンから2ダメージ継続',
        ability: '',
        type: 'condition', // 👈 分類（条件）,
        imgSrc: '/hitokage.png',
    },
    {
        id: 4,
        name: '聖なる指輪',
        energy: 0,
        description: '自動で毎ターン回復+1',
        ability: '',
        type: 'relic', // 👈 分類（レリック）,
        imgSrc: '/hitokage.png',
    },
    // …追加可
];
