<template>
    <div class="flex space-x-2 pt-2 pb-6">
        <button v-for="tab in tabs" :key="tab" @click="setTab(tab)" :class="[
            'flex-1 border-2 py-2 rounded text-white bg-black border-white',
            selectedTab === tab ? 'text-xl' : 'text-sm'
        ]">
            {{ tab }}
        </button>
    </div>
</template>

<script setup>
defineProps({
    tabs: Array,
    setTab: Function,
    selectedTab: String,
})
</script>