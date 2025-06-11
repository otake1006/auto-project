export const cards = [
  {
    id: 1,
    name: '乱数調整',
    energy: 1,
    effect: '次のターン開始時 エナジー2回復',
    ability: 'ダメージ 2',
    type: 'skill', // 👈 分類（スキル）
    imgSrc: '/hitokage.png',
    status: '休憩',
    description: {
      genre: '特兼',
      energy: 1,
      effect: '次のターン開始時、エナジーを',
      note: '休憩中'
    }
  },
  {
    id: 2,
    name: '炎弾',
    energy: 3,
    effect: 'やり6を×3与える',
    ability: 'ダメージ 2',
    type: 'skill', // 👈 分類（スキル）
    status: '',
    description: {
      genre: '特兼',
      energy: 3,
      effect: 'やり6を3回与える',
      note: ''
    }
  },
  {
    id: 3,
    name: '毒の契約',
    energy: 2,
    effect: '次のターンから2ダメージ継続',
    ability: '',
    type: 'condition', // 👈 分類（条件）
    status: '',
    description: {
      genre: '状態異常',
      energy: 2,
      effect: '次のターンから継続ダメージを受ける',
      note: '2ターン持続'
    }
  },
  {
    id: 4,
    name: '聖なる指輪',
    energy: 0,
    effect: '自動で毎ターン回復+1',
    ability: '',
    type: 'relic', // 👈 分類（レリック）
    status: '',
    description: {
      genre: '遺物',
      energy: 0,
      effect: '毎ターン自動回復',
      note: ''
    }
  }
  // …追加可
]
