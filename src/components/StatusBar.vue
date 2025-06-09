<!-- components/StatusBar.vue -->
<template>
  <div class="flex items-center space-x-1">
    <span>{{ icon }}</span>
    <div class="relative w-24 h-3 bg-gray-300 rounded">
      <div
        class="absolute h-3 rounded transition-all duration-500"
        :class="barColor"
        :style="{ width: `${(value / max) * 100}%` }"
      ></div>
    </div>
    <span class="text-xs">{{ value }} / {{ max }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number
  max: number
  icon: string
  barColor: string
}>()
</script>
