<script setup>
import { useTabCards } from './composables/useTabCards'
import Card from './components/Card.vue'

const { tabs, selectedTab, filteredCards } = useTabCards()
</script>

<template>
    <div class="p-4 bg-neutral-700">
      <div class="flex space-x-2 pt-2 pb-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="selectedTab = tab"
          :class="[
            'flex-1 border-2 py-2 rounded text-white bg-black border-white',
            selectedTab === tab ? 'text-xl' : 'text-sm'
          ]"
        >
          {{ tab }}
        </button>
      </div>
      <div class="card-grid  pt-6 border-2 border-white py-2">
        <Card v-for="card in filteredCards" :key="card.id" :card="card" />
      </div>
    </div>
</template>
