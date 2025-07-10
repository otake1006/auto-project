<template>
    <div class="flex space-x-2 pt-2 pb-6">
        <img @click="setTab('スキル')" src="/skill-button.png" alt="Skill Icon" :class="[
            'flex-1 w-[225px] h-[48px]',
            selectedTab === tab ? 'text-xl' : 'text-sm'
        ]">
        <img @click="setTab('条件')" src="/condition-button.png" alt="Condition Icon" :class="[
            'flex-1 w-[225px] h-[48px]',
            selectedTab === tab ? 'text-xl' : 'text-sm'
        ]">

        <img @click="setTab('レリック')" src="/relic-button.png" alt="Relic Icon" :class="[
            'flex-1 w-[225px] h-[48px]',
            selectedTab === tab ? 'text-xl' : 'text-sm'
        ]">

    </div>
</template>

<script setup>
defineProps({
    tabs: Array,
    setTab: Function,
    selectedTab: String,
})
</script>