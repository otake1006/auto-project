<template>
    <div class="flex space-x-2 pt-2 pb-6">
        <button v-for="tab in tabs" :key="tab" @click="$emit('update:selectedTab', tab)" :class="[
            'flex-1 border-2 py-2 rounded text-white bg-black border-white',
            selectedTab === tab ? 'text-xl' : 'text-sm'
        ]">
            {{ tab }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    tabs: Array,
    selectedTab: String
})

const emits = defineEmits(['update:selectedTab'])
</script>