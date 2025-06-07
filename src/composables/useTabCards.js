import { ref, computed } from 'vue'
import { cards } from '@/data/cards.js'

export function useTabCards() {
  const tabs = ['スキル', '条件', 'レリック']

  const tabTypeMap = {
    スキル: 'skill',
    条件: 'condition',
    レリック: 'relic'
  }

  const selectedTab = ref('スキル')

  // 実際には type でフィルタする（例: 'skill', 'condition', 'relic' など）
  const filteredCards = computed(() => {
    const type = tabTypeMap[selectedTab.value]
    return cards.filter(card => card.type === type)
  })

  return {
    tabs,
    selectedTab,
    filteredCards
  }
}
