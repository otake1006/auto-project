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

    const skillSets = ref([
        {
            id: 'set1',
            skill: null,
            conditions: [],
        },
        {
            id: 'set2',
            skill: null,
            conditions: [],
        },
        {
            id: 'set3',
            skill: null,
            conditions: [],
        },
        {
            id: 'set4',
            skill: null,
            conditions: [],
        },
        {
            id: 'set5',
            skill: null,
            conditions: [],
        },
    ]);

    function handleSkillAdd(event, index) {
        // 追加されたスキルを取得
        const addedSkill =
            skillSets.value[index].skill ||
            (event.item &&
                event.item.__draggable_context &&
                event.item.__draggable_context.element);
        if (addedSkill && !skillSets.value[index].skill) {
            skillSets.value[index].skill = addedSkill;
        }
    }

    // 実際には type でフィルタする（例: 'skill', 'condition', 'relic' など）
    const filteredCards = computed(() => {
        const type = tabTypeMap[currentTab.value];
        return cards.filter((card) => card.type === type);
    });

    const currentType = computed(() => tabTypeMap[currentTab.value]);

    function setTab(tab) {
        currentTab.value = tab;
    }

    return {
        player,
        itemList,
        skillSets,
        cards,
        tabs,
        currentType,
        currentTab,
        filteredCards,
        handleSkillAdd,
        setTab,
    };
});
