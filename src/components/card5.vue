<script setup>
import cards from "./card3.vue"
import card from "./card.vue"
defineProps({
  cards: Object
})
</script>

<template>
    <div class="w-140 h-120 border border-gray-300 rounded-xl p-4 shadow-sm bg-white space-y-15">
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">1</h2>
      <card :cards="cards"></card> 
    </div>
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">2</h2>
      <card :cards="cards"></card> 
    </div>
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">3</h2>
      <card :cards="cards"></card> 
    </div>
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">4</h2>
      <card :cards="cards"></card> 
    </div>
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">6</h2>
      <card :cards="cards"></card> 
    </div>
  </div>
</template>
