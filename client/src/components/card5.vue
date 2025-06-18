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
const dropArea = ref(null)

function onDragEnd(evt) {
    const mouseX = evt.originalEvent.clientX
    const mouseY = evt.originalEvent.clientY
    const dropRect = dropArea.value.getBoundingClientRect()
    const isOutside =
        mouseX < dropRect.left ||
        mouseX > dropRect.right ||
        mouseY < dropRect.top ||
        mouseY > dropRect.bottom

    if (isOutside) {
        const index = evt.oldIndex
        if (index !== undefined) {
            skillStore.handleSkillRemove(index);
        }
    }

}


</script>

<template>
    <div class="space-y-15 rounded-xl border border-gray-300 bg-white p-4 shadow-sm" ref="dropArea">
        <draggable v-model="skillStore.skillSets" item-key="id" :group="{ name: 'skillSets' }"
            :ghost-class="'no-opacity'" :animation="200" handle=".drag-handle">
            <template #item="{ element, index }">
                <div class="flex w-full p-4 py-2 flex-row gap-6 h-25">
                    <h3 class="font-semibold drag-handle">{{ index + 1 }}</h3>
                    <draggable :list="element.skill ? [element.skill] : []" :group="{ name: 'skill', pull: false }"
                        item-key="id" :ghost-class="'no-opacity'" @add="(e) => skillStore.handleSkillAdd(e, index)"
                        @end="onDragEnd" @remove="(e) => skillStore.handleSkillRemove(index)">
                        <template #item="{ element: skill }">
                            <card3 :cards="skill"></card3>
                        </template>
                        <template #footer>
                            <div v-if="!element.skill"
                                class="flex items-center justify-center  w-48 h-20 border-2 border-dashed border-gray-400 rounded bg-gray-50 text-gray-500 italic">
                                + ここにカードを追加
                            </div>
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