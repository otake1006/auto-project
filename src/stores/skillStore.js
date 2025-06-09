// stores/skillStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cards } from '@/data/cards.js';

export const useSkillStore = defineStore('skill', () => {
    const tabs = ['スキル', '条件', 'レリック'];

    const tabTypeMap = {
        スキル: 'skill',
        条件: 'condition',
        レリック: 'relic',
    };

    const categories = ['Attack', 'Defense', 'Magic'];
    const currentCategory = ref('Attack');
    const currentTab = ref('スキル');

    // const skillList = ref({
    //     Attack: [{ id: 1, name: 'Slash', power: 10 }],
    //     Defense: [{ id: 2, name: 'Shield', defense: 5 }],
    //     Magic: [{ id: 3, name: 'Fireball', mpCost: 10 }],
    // });

    const currentSkills = computed(() =>
        cards.filter((card) => {
            const type = tabTypeMap[currentTab.value];
            return card.type === type || [];
        }),
    );

    function setTab(tab) {
        currentTab.value = tab;
    }

    return {
        tabs,
        currentTab,
        currentSkills,
        setTab,
    };
});
