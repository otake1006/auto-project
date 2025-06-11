<template>
    <div class="flex flex-col overflow-hidden pl-2">
        <TabButtons :tabs="skill.tabs" v-model:selectedTab="skill.setTab" />
        <CardList :cards="skill.filteredCards" />
    </div>
</template>

<script setup lang="js">
import TabButtons from './TabButtons.vue'
import CardList from './CardList.vue'
import { useSkillStore } from '@/stores/skillStore'

const skill = useSkillStore();

const props = defineProps()

</script>