<template>
    <div class="flex-1 overflow-y-auto border-2 border-white py-2 rounded-lg min-h-[200px]">
        <draggable :list="cards" :group="{ name: skill.currentType, pull: 'clone' }" item-key="id" :sort="false"
            :move="checkMove" :animation="200" :drag-class="'dragging'">
            <template #item="{ element }">
                <Card :card="element" />
            </template>
        </draggable>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import Card from './CardItem.vue'
import draggable from 'vuedraggable'
import { useSkillStore } from '@/ui/stores/skillStore'

const skill = useSkillStore();

const props = defineProps({
    cards: Array
})

function checkMove(evt) {
    const toIndex = evt.to.dataset.index; // ここで index を取得
    const targetElement = skill.skillSets[toIndex];
    const targetGroup = evt.to.dataset.group;
    if (targetGroup === 'condition') {
        return targetElement.skill != null; // 要素があるならOK、なければNG
    }
    return true;
}
</script>

<style scoped>
.ghost {
    opacity: 0;
    display: none !important;
}
</style>