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

    const skills = ref([]);

    const skillSets = ref([
        {
            id: 'set1',
            skill: null,
            conditions: [],
        },
    ]);

    function canMove(evt) {
        const draggedElement = evt.draggedContext.element;
        return draggedElement.skill !== null;
    }

    function handleConditionInput(id, inputValue, index) {
        console.log(skillSets.value[index], skillSets.value, index);
    }

    function handleSkillAdd(event, index) {
        // 追加されたスキルを取得
        const addedSkill =
            skillSets.value[index].skill ||
            (event.item &&
                event.item.__draggable_context &&
                event.item.__draggable_context.element);

        // スキルがまだ設定されていないなら追加
        if (addedSkill && !skillSets.value[index].skill) {
            skillSets.value[index].skill = addedSkill;
        }

        // ★空きスロットがなければ追加
        const hasEmptySlot = skillSets.value.some((set) => !set.skill);
        if (!hasEmptySlot) {
            skillSets.value.push({
                id: `set${skillSets.value.length + 1}`,
                skill: null,
                conditions: [],
            });
        }
    }

    function handleSkillRemove(index) {
        const card = skillSets.value[index];
        card.skill = null;
        card.conditions = [];
    }

    // 実際には type でフィルタする（例: 'skill', 'condition', 'relic' など）
    const filteredCards = computed(() => {
        const type = tabTypeMap[currentTab.value];
        if (type === 'skill') {
            return skills.value;
        }
        return cards.filter((card) => card.type === type);
    });

    function setSkills(value) {
        skills.value = value;
    }

    function addSkills(value) {
        const test = [...skills.value, ...value];
        skills.value = test;
    }

    const currentType = computed(() => tabTypeMap[currentTab.value]);

    function setTab(tab) {
        currentTab.value = tab;
    }

    return {
        player,
        itemList,
        skillSets,
        setSkills,
        addSkills,
        cards,
        tabs,
        currentType,
        currentTab,
        filteredCards,
        handleSkillAdd,
        handleSkillRemove,
        handleConditionInput,
        setTab,
    };
});
