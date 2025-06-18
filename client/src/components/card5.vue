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
        <draggable v-model="skillStore.skillSets" item-key="id" :group="{ name: 'skillSets', put: false }"
            :ghost-class="'no-opacity'">
            <template #item="{ element, index }">
                <div class="flex w-full p-4 py-2 flex-row gap-6">
                    <h3 class="font-semibold">{{ index + 1 }}</h3>
                    <draggable :list="element.skill ? [element.skill] : []" :group="{ name: 'skill' }" item-key="id"
                        :ghost-class="'no-opacity'" @add="(e) => skillStore.handleSkillAdd(e, index)">
                        <template #item="{ element: skill }">
                            <card3 :cards="skill"></card3>
                        </template>
                    </draggable>

                    <draggable v-model="element.conditions" :group="{ name: 'condition' }" item-key="id" class="flex">
                        <template #item="{ element: condition }">
                            <card3 :cards="condition"></card3>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style>
.no-opacity {
    opacity: 1 !important;
}
</style>