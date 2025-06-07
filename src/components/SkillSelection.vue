<template>
    <div class="flex flex-col overflow-hidden pl-2">
        <TabButtons :tabs="tabs" v-model:selectedTab="selectedTab" />
        <CardList :cards="filteredCards" />
    </div>
</template>

<script setup lang="js">
    import TabButtons from './TabButtons.vue'
    import CardList from './CardList.vue'
    import { useTabCards } from '../composables/useTabCards'

    const { tabs, selectedTab, filteredCards } = useTabCards()
    const props = defineProps()

</script>