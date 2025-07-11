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
const dropArea = ref(null);

function onDragEnd(evt, targetIndex) {
    const mouseX = evt.originalEvent.clientX;
    const mouseY = evt.originalEvent.clientY;
    const dropRect = dropArea.value.getBoundingClientRect();
    const isOutside =
        mouseX < dropRect.left ||
        mouseX > dropRect.right ||
        mouseY < dropRect.top ||
        mouseY > dropRect.bottom;

    if (isOutside) {
        if (targetIndex !== undefined) {
            skillStore.handleSkillRemove(targetIndex);
        }
    }
}

function canMove(evt) {
    console.log('canMove called', evt);
    const draggedElement = evt.relatedContext.element;
    const contextElement = evt.draggedContext.element;

    return draggedElement.skill !== null && contextElement.skill !== null;
}

async function onDropped(data, index) {
    const modalStore = useModalStore();
    const card = data.item.__draggable_context.element;
    const groupedCards = skillStore.getItemsByGroupId(card.groupId) || [card];
    const inputCard = await modalStore.open('conditionInput', {
        cards: groupedCards,
    });

    const draggedItem = data.item.__draggable_context.element;

    const currentConditions = skillStore.skillSets[index].conditions;
    if (currentConditions.length >= 3) {
        return;
    }

    currentConditions.splice(data.newDraggableIndex, 1);

    if (inputCard) {
        currentConditions.splice(data.newDraggableIndex, 0, {
            ...inputCard,
        });
    }
}
</script>

<template>
    <div class="space-y-15 rounded-xl p-4 shadow-sm" ref="dropArea"
        style="background-image: url('/assets/images/battleboard.png')">
        <draggable v-model="skillStore.skillSets" item-key="id" :group="{ name: 'skillSets' }" :move="canMove"
            :ghost-class="'no-opacity'" :animation="200" handle=".drag-handle">
            <template #item="{ element, index }">
                <div v-show="index === 0 ? true : skillStore.skillSets[index - 1]?.skill"
                    class="flex h-25 w-full flex-row gap-2 p-4 py-2">
                    <h3 class="drag-handle font-black stroke-text flex items-center text-white text-2xl">{{ index + 1 }}
                    </h3>
                    <draggable :list="element.skill ? [element.skill] : []" :group="{ name: 'skill', pull: false }"
                        item-key="id" chosen-class="'ghost'" @add="(e) => skillStore.handleSkillAdd(e, index)"
                        @end="(e) => onDragEnd(e, index)" @remove="(e) => skillStore.handleSkillRemove(index)"
                        :ghost-class="'ghost'">
                        <template #item="{ element: skill }">
                            <card3 :cards="skill"></card3>
                        </template>
                        <template #footer>
                            <img v-if="!element.skill" src="/assets/images/add-card-placeholder.png" alt="Click Button"
                                class="h-20 w-48" />
                        </template>
                    </draggable>

                    <draggable v-model="element.conditions" :ghost-class="'ghost'" :group="{ name: 'condition' }"
                        data-group="condition" :data-index="index" @add="(e) => onDropped(e, index)" item-key="id"
                        class="flex gap-2" :move="canMove">
                        <template #item="{ element: condition }">
                            <card3 :cards="condition"></card3>
                        </template>
                        <template #footer>
                            <img v-if="element.conditions.length < 2 && element.skill"
                                src="/assets/images/add-card-placeholder.png" alt="Click Button" class="h-20 w-48" />
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

.stroke-text {
    -webkit-text-stroke: 1px rgb(255, 255, 255);
    /* 縁の太さと色 */
    text-shadow: 0 1px 1px rgb(252, 252, 252);
    /* 影も追加したい場合 */
}
</style>
