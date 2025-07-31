// stores/skillStore.js
import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { useGameStore } from './gameStore';

export const useSkillStore = defineStore('skill', () => {
    const gameStore = useGameStore();
    const tabs = ['スキル', '条件', 'レリック'];

    const tabTypeMap = {
        スキル: 'skill',
        条件: 'condition',
        レリック: 'relic',
    };

    const player = reactive({
        hp: 10,
    });

    const currentTab = ref('スキル');

    const itemList = ref([[], [], [], [], []]);

    const skillSets = ref([
        {
            id: 'set1',
            skill: null,
            conditions: [],
        },
    ]);

    const selectCards = ref([]);

    function setSelectCards(cards) {
        selectCards.value = cards;
    }

    function clearSelectCards() {
        selectCards.value = [];
    }

    const skills = ref([]);
    const conditions = ref([]);
    const relics = ref([]);

    function canMove(evt) {
        const draggedElement = evt.draggedContext.element;
        return draggedElement.skill !== null;
    }

    function handleConditionInput(id, inputValue, index) {
        console.log(skillSets.value[index], skillSets.value, index);
    }

    function handleSkillAdd(event, index) {
        // ゲーム状態をチェック - カード編集不可の場合はスキル追加も無効にする
        if (!gameStore.canEditCards) {
            return;
        }

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
        // ゲーム状態をチェック - カード編集不可の場合はスキル削除も無効にする
        if (!gameStore.canEditCards) {
            return;
        }

        skillSets.value.splice(index, 1);
    }

    // 実際には type でフィルタする（例: 'skill', 'condition', 'relic' など）
    const filteredCards = computed(() => {
        const type = tabTypeMap[currentTab.value];
        if (type === 'skill') {
            return skills.value;
        }
        if (type === 'condition') {
            return getGroupedByKey(conditions.value).map((group) => group.items[0]);
        }
        if (type === 'relic') {
            return relics.value;
        }
        return [];
    });

    function loadRelicFromColyseus(data) {
        console.log(data, 'kokokokokookooko');
        relics.value = data || [];
    }

    function loadConditionFromColyseus(data) {
        conditions.value = data || [];
    }

    function getGroupedByKey(conditions) {
        const groups = {};
        for (const item of conditions) {
            (groups[item.groupId] = groups[item.groupId] || []).push(item);
        }
        return Object.entries(groups).map(([groupId, items]) => ({
            groupId,
            items,
            representative: items[0],
        }));
    }

    function getItemsByGroupId(groupId) {
        if (!groupId) return undefined;

        const grouped = getGroupedByKey(conditions.value);
        const group = grouped.find((group) => group.groupId === groupId);
        return group ? group.items : [];
    }

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

    function reset() {
        skillSets.value = [
            {
                id: 'set1',
                skill: null,
                conditions: [],
            },
        ];
        skills.value = [];
        conditions.value = [];
        relics.value = [];
    }

    return {
        player,
        itemList,
        skillSets,
        setSkills,
        addSkills,
        tabs,
        currentType,
        currentTab,
        filteredCards,
        selectCards,
        handleSkillAdd,
        handleSkillRemove,
        handleConditionInput,
        loadConditionFromColyseus,
        loadRelicFromColyseus,
        getItemsByGroupId,
        setTab,
        clearSelectCards,
        setSelectCards,
        reset,
    };
});
