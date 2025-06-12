<script setup>
    import { ref } from 'vue';
    import card3 from './card.vue';
    import draggable from 'vuedraggable';
    import { useSkillStore } from '@/stores/skillStore';

    const skillStore = useSkillStore();
    const props = defineProps({
        parentList: Object,
    });
    const parent = ref(props.parentList);
</script>

<template>
    <div class="space-y-15 rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
        <!-- <draggable v-model="skillStore.itemList" group="parent" item-key="index">
            <template #item="{ element: slot, index }">
                <div class="parent-box flex">
                    <h3 class="font-semibold">{{ index + 1 }}</h3>
                    <draggable v-model="skillStore.itemList[index]" group="skills" item-key="id" class="flex">
                        <template #item="{ element: child }">
                            <div class="child-box">
                                <card3 :cards="child"></card3>
                            </div>
                            <draggable :list="child.conditions" group="conditions" item-key="id">
                                <template #item="{ element: cond }">
                                    <card3 :cards="cond"></card3>
                                </template>
</draggable>
</template>
</draggable>
</div>
</template>
</draggable> -->
        <draggable
            v-model="skillStore.skillSets"
            item-key="id"
            :group="{ name: 'skillSets', put: false }"
        >
            <template #item="{ element, index }">
                <div class="flex w-full border-2 py-6">
                    <h3 class="font-semibold">{{ index + 1 }}</h3>
                    <draggable
                        :list="element.skill ? [element.skill] : []"
                        :group="{ name: 'skill' }"
                        item-key="id"
                        @add="(e) => skillStore.handleSkillAdd(e, index)"
                    >
                        <template #item="{ element: skill }">
                            <card3 :cards="skill"></card3>
                        </template>
                    </draggable>

                    <draggable
                        v-model="element.conditions"
                        :group="{ name: 'conditions' }"
                        item-key="id"
                    >
                        <template #item="{ element: condition }">
                            <card3 :cards="condition"></card3>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>
    </div>
</template>
