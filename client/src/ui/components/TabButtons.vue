<template>
    <div class="flex space-x-2 pt-2 pb-6">
        <button @click="handleTabClick('スキル')" :class="getTabClasses('スキル')"
            class="tab-button group relative overflow-hidden">
            <img src="/assets/images/skill-button.png" alt="Skill Icon"
                class="w-[225px] h-[48px] transition-all duration-200 group-active:scale-95">
            <div v-if="selectedTab === 'スキル'"></div>
        </button>

        <button @click="handleTabClick('条件')" :class="getTabClasses('条件')"
            class="tab-button group relative overflow-hidden">
            <img src="/assets/images/condition-button.png" alt="Condition Icon"
                class="w-[225px] h-[48px] transition-all duration-200 group-active:scale-95">
            <div v-if="selectedTab === '条件'"></div>
        </button>

        <button @click="handleTabClick('レリック')" :class="getTabClasses('レリック')"
            class="tab-button group relative overflow-hidden">
            <img src="/assets/images/relic-button.png" alt="Relic Icon"
                class="w-[225px] h-[48px] transition-all duration-200 group-active:scale-95">
            <div v-if="selectedTab === 'レリック'"></div>
        </button>
    </div>
</template>

<script setup>
import { sm } from '@/core/SoundManager.js'

const props = defineProps({
    tabs: Array,
    setTab: Function,
    selectedTab: String,
})

const handleTabClick = (tabName) => {
    // Play click sound
    sm.playClick()

    // Call the setTab function
    if (props.setTab) {
        props.setTab(tabName)
    }
}

const getTabClasses = (tabName) => {
    const baseClasses = 'flex-1 transition-all duration-300 hover:brightness-110 active:brightness-90'
    const selectedClasses = 'brightness-125 shadow-lg transform scale-105'
    const unselectedClasses = 'hover:scale-102'

    return props.selectedTab === tabName
        ? `${baseClasses} ${selectedClasses}`
        : `${baseClasses} ${unselectedClasses}`
}
</script>

<style scoped>
.tab-button {
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
}

.tab-button:hover {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.tab-button:active {
    transform: translateY(2px);
}

@keyframes pulse-glow {
    0% {
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        opacity: 0.8;
    }

    100% {
        box-shadow: 0 0 16px rgba(255, 215, 0, 1);
        opacity: 1;
    }
}
</style>