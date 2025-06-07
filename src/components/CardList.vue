<template>
  <div class="flex-1 overflow-y-auto border-2 border-white py-2 rounded-lg min-h-[200px]">
    <Card v-for="card in cards" :key="card.id" :card="card" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  cards: Array
})
</script>