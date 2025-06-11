<script setup>
import { ref } from 'vue'
import card3 from "./card.vue"
import draggable from "vuedraggable"
import { useSkillStore } from '@/stores/skillStore'

const skillStore = useSkillStore();
const props = defineProps({
    parentList: Object
})
const parent = ref(props.parentList)
</script>

<template>
    <div class="border border-gray-300 rounded-xl p-4 shadow-sm bg-white space-y-15">
        <draggable v-model="skillStore.itemList" group="parent" item-key="index">
            <template #item="{ element: slot, index }">
                <div class="parent-box flex">
                    <h3 class="font-semibold">{{ index + 1 }}</h3>
                    <draggable v-model="skillStore.itemList[index]" group="skills" item-key="id" class="flex">
                        <template #item="{ element: child }">
                            <div class="child-box">
                                <card3 :cards="child"></card3>
                            </div>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>
    </div>
</template>
