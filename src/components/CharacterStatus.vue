<template>
    <div class="flex flex-col items-center p-2 rounded w-fit">
        <img :src="icon" alt="character" class="w-10 h-10 mb-1" />
        <StatusBar :value="hp" :max="maxHp" icon="❤️" barColor="bg-red-400" />
        <StatusBar :value="energy" :max="maxEnergy" icon="⚡" barColor="bg-blue-400" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import StatusBar from './StatusBar.vue'

const props = defineProps({
    icon: String,
    hp: Number,
    maxHp: Number,
    energy: Number,
    maxEnergy: Number
})
</script>
