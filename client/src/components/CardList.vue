<template>
    <div class="flex-1 overflow-y-auto border-2 border-white py-2 rounded-lg min-h-[200px]">
        <draggable :list="cards" :group="{ name: skill.currentType }" item-key="id" :sort="false" :animation="200">
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
import { useSkillStore } from '@/stores/skillStore'

const skill = useSkillStore();

const props = defineProps({
    cards: Array
})
</script>