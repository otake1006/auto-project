<template>
    <div class="space-y-4">
        <h2 class="text-lg font-bold">Select a Skill</h2>
        <div class="grid grid-cols-3 gap-2">
            <div v-for="card in cards" :key="card.id" class="p-4 border rounded cursor-pointer hover:bg-blue-100"
                :class="{ 'bg-blue-200': selected === card.id }" @click="select(card.id)">
                <h3 class="font-semibold">{{ card.name }}</h3>
                <p class="text-sm text-gray-600">{{ card.description }}</p>
            </div>
        </div>
        <div class="flex justify-end space-x-2">
            <button @click="$emit('cancel')" class="btn-secondary">Cancel</button>
            <button @click="confirm" :disabled="!selected" class="btn-primary">Confirm</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ cards: Array });
const emit = defineEmits(['confirm', 'cancel']);
const selected = ref(null);

function select(id) {
    selected.value = id;
}
function confirm() {
    emit('confirm', selected.value);
}
</script>
