// stores/skillStore.js
import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { cards } from '@/data/cards.js';

export const useSkillStore = defineStore('skill', () => {
    const tabs = ['スキル', '条件', 'レリック'];

    const tabTypeMap = {
        スキル: 'skill',
        条件: 'condition',
        レリック: 'relic',
    };

    const player = reactive({
        hp: 10,
    });

    const categories = ['Attack', 'Defense', 'Magic'];
    const currentCategory = ref('Attack');
    const currentTab = ref('スキル');

    const itemList = ref([[], [], [], [], []]);

    // 実際には type でフィルタする（例: 'skill', 'condition', 'relic' など）
    const filteredCards = computed(() => {
        const type = tabTypeMap[currentTab.value];
        return cards.filter((card) => card.type === type);
    });

    function setTab(tab) {
        currentTab.value = tab;
    }

    return {
        player,
        itemList,
        cards,
        tabs,
        currentTab,
        filteredCards,
        setTab,
    };
});
