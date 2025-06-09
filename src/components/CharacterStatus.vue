<!-- components/CharacterStatus.vue -->
<template>
  <div class="flex flex-col items-center p-2 bg-white/20 rounded shadow-md w-fit">
    <img :src="icon" alt="character" class="w-10 h-10 mb-1" />
    <StatusBar
      :value="hp"
      :max="maxHp"
      icon="❤️"
      barColor="bg-red-400"
    />
    <StatusBar
      :value="energy"
      :max="maxEnergy"
      icon="⚡"
      barColor="bg-blue-400"
    />
  </div>
</template>

<script setup lang="ts">
import StatusBar from './StatusBar.vue'

defineProps<{
  icon: string
  hp: number
  maxHp: number
  energy: number
  maxEnergy: number
}>()
</script>
