<template>
    <div class="container">
        <h2>スキル一覧（ドラッグして追加）</h2>
        <Draggable :list="skills" group="skills" item-key="name">
            <template #item="{ element }">
                <div class="card">{{ element.name }}</div>
            </template>
        </Draggable>

        <h2>スキルビルダー</h2>
        <Draggable :list="buildSkills" group="skills" item-key="name" @add="onSkillAdd">
            <template #item="{ element }">
                <div class="card">
                    <strong>{{ element.name }}</strong>
                    <div class="droppable">
                        <Draggable :list="element.conditions" group="conditions" item-key="type">
                            <template #item="{ element: cond }">
                                <div class="card small">
                                    {{ cond.type }} : {{ cond.value }}
                                </div>
                            </template>
                        </Draggable>
                    </div>
                </div>
            </template>
        </Draggable>

        <h2>条件一覧（ドラッグして追加）</h2>
        <Draggable :list="conditions" group="conditions" item-key="type">
            <template #item="{ element }">
                <div class="card">{{ element.type }} : {{ element.value }}</div>
            </template>
        </Draggable>

        <h2>構築結果</h2>
        <pre>{{ JSON.stringify(buildSkills, null, 2) }}</pre>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Draggable from 'vuedraggable'

const Condition = {
    HP_ABOVE: 'HP_ABOVE',
    HP_BELOW: 'HP_BELOW'
}

const skills = ref([
    { name: 'fire' },
    { name: 'ice' }
])

const conditions = ref([
    { type: Condition.HP_ABOVE, value: 10 },
    { type: Condition.HP_ABOVE, value: 20 },
    { type: Condition.HP_BELOW, value: 30 }
])

const buildSkills = ref([])

function onSkillAdd(event) {
    const newSkill = buildSkills.value[event.newIndex]
    if (!newSkill.conditions) {
        newSkill.conditions = []
    }
}
</script>

<style scoped>
.container {
    padding: 20px;
    max-width: 900px;
    margin: auto;
}

.card {
    border: 1px solid #ccc;
    background-color: #f4f4f4;
    padding: 10px;
    margin: 5px 0;
    border-radius: 4px;
}

.card.small {
    font-size: 0.9em;
}

.droppable {
    min-height: 40px;
    background-color: #e8f0ff;
    padding: 8px;
    margin-top: 8px;
    border: 1px dashed #aaa;
    border-radius: 4px;
}
</style>
