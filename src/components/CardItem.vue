<script setup>
    defineProps(['card']);
</script>

<template>
    <div class="w-full border border-gray-300 rounded-xl p-4 shadow-sm bg-white">
        <img :src="imgSrc" class="logo" alt="Vite logo" />
        <h2 class="text-lg font-semibold mb-2">{{ card.name }}</h2>
        <p class="text-sm text-gray-700 mb-1">エナジー: {{ card.energy }}</p>
        <p class="text-sm text-gray-500">{{ card.ability }}</p>
    </div>
</template>