<template>
    <div class="flex items-center space-x-1">
        <span>{{ icon }}</span>
        <div class="relative w-24 h-3 bg-gray-300 rounded">
            <div class="absolute h-3 rounded" :class="barColor" :style="{ width: `${(value / max) * 100}%` }"></div>
        </div>
        <span class="text-xs">{{ value }} / {{ max }}</span>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    value: Number,
    max: Number,
    icon: String,
    barColor: String
})
</script>
