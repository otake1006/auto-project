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
    <div
        class="space-y-15 rounded-xl border border-gray-300 bg-white p-4 shadow-sm"
        ref="dropArea"
        style="background-image: url('battleboard.png')"
    >
        <draggable
            v-model="skillStore.skillSets"
            item-key="id"
            :group="{ name: 'skillSets' }"
            :move="canMove"
            :ghost-class="'no-opacity'"
            :animation="200"
            handle=".drag-handle"
        >
            <template #item="{ element, index }">
                <div
                    v-show="index === 0 ? true : skillStore.skillSets[index - 1]?.skill"
                    class="flex h-25 w-full flex-row gap-6 p-4 py-2"
                >
                    <h3 class="drag-handle font-semibold">{{ index + 1 }}</h3>
                    <draggable
                        :list="element.skill ? [element.skill] : []"
                        :group="{ name: 'skill', pull: false }"
                        item-key="id"
                        chosen-class="'ghost'"
                        @add="(e) => skillStore.handleSkillAdd(e, index)"
                        @end="(e) => onDragEnd(e, index)"
                        @remove="(e) => skillStore.handleSkillRemove(index)"
                        :ghost-class="'ghost'"
                    >
                        <template #item="{ element: skill }">
                            <card3 :cards="skill"></card3>
                        </template>
                        <template #footer>
                            <div
                                v-if="!element.skill"
                                class="flex h-20 w-48 items-center justify-center rounded border-2 border-dashed border-gray-400 bg-gray-50 text-gray-500 italic"
                            >
                                + ここにカードを追加
                            </div>
                        </template>
                    </draggable>

                    <draggable
                        v-model="element.conditions"
                        :ghost-class="'ghost'"
                        :group="{ name: 'condition' }"
                        data-group="condition"
                        :data-index="index"
                        @add="(e) => onDropped(e, index)"
                        item-key="id"
                        class="flex gap-6"
                        :move="canMove"
                    >
                        <template #item="{ element: condition }">
                            <card3 :cards="condition"></card3>
                        </template>
                        <template #footer>
                            <div
                                v-if="element.conditions.length < 2 && element.skill"
                                class="flex h-20 w-48 items-center justify-center rounded border-2 border-dashed border-gray-400 bg-gray-50 text-gray-500 italic"
                            >
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
