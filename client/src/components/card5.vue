<script setup>
import { ref } from 'vue';
import card3 from './card.vue';
import draggable from 'vuedraggable';
import { useSkillStore } from '@/stores/skillStore';
import { useModalStore } from '@/stores/modalStore';

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

function canMove(evt) {
    const draggedElement = evt.relatedContext.element;
    const contextElement = evt.draggedContext.element;

    return draggedElement.skill !== null && contextElement.skill !== null;
}



function handleChange(evt) {
    if (evt.added && evt.added.element) {
        const newItem = evt.added.element;
        console.log('New item added:', evt);

        // 追加対象リストを取得（componentごとにドラッグ先が異なる場合は要工夫）
        const toList = evt.to.__draggable_component?.modelValue;
        const index = evt.added.newIndex;

        // Vue 3 では .value や $set 不要、splice で OK
        if (toList) {
            toList.splice(index, 1, {
                ...newItem,
                value: 0  // ← 任意の値に書き換え
            });
        }
    }
}


async function onDropped(data, index) {
    const modalStore = useModalStore();
    const inputValue = await modalStore.open('conditionInput', { card: data.item.__draggable_context.element });
    if (inputValue) {
        const newIndex = data.newIndex;
        skillStore.skillSets[index].conditions[newIndex] = {
            ...data.item.__draggable_context.element,
            value: inputValue  // ← ここで書き換え！
        };
    }

}
</script>

<template>
    <div class="space-y-15 rounded-xl border border-gray-300 bg-white p-4 shadow-sm" ref="dropArea">
        <draggable v-model="skillStore.skillSets" item-key="id" :group="{ name: 'skillSets' }" :move="canMove"
            :ghost-class="'no-opacity'" :animation="200" handle=".drag-handle">
            <template #item="{ element, index }">
                <div v-show="index === 0 ? true : skillStore.skillSets[index - 1]?.skill"
                    class="flex w-full p-4 py-2 flex-row gap-6 h-25">
                    <h3 class="font-semibold drag-handle">{{ index + 1 }}</h3>
                    <draggable :list="element.skill ? [element.skill] : []" :group="{ name: 'skill', pull: false }"
                        item-key="id" chosen-class="'ghost'" @add="(e) => skillStore.handleSkillAdd(e, index)"
                        @end="onDragEnd" @remove="(e) => skillStore.handleSkillRemove(index)" :ghost-class="'ghost'">
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


                    <draggable v-model="element.conditions" :ghost-class="'ghost'" :group="{ name: 'condition' }"
                        @add="(e) => onDropped(e, index)" item-key="id" class="flex gap-6">
                        <template #item="{ element: condition }">
                            <card3 :cards="condition"></card3>
                        </template>
                        <template #footer>
                            <div v-if="element.conditions.length < 2 && element.skill"
                                class="flex items-center justify-center  w-48 h-20 border-2 border-dashed border-gray-400 rounded bg-gray-50 text-gray-500 italic">
                                + ここにカードを追加
                            </div>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>
    </div>
</template>

<style scoped>
.ghost {
    opacity: 0;
    display: none !important;
}
</style>