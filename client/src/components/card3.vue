<script setup>
import Card from './card.vue'
defineProps({
  cards: Object
})
</script>

<template>
  <div class="flex">
    <Card
      v-for="(card, index) in cards"
      :key="index"
      :name="card.name"
      :energy="card.energy"
      :ability="card.ability"
      :type="card.type"
      :imgSrc="card.imgSrc"
    />
  </div>
</template>
