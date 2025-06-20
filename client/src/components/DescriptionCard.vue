<template>
    <div
        class="overflow-y-auto flex-shrink-0  w-115 flex flex-row items-start space-x-4 border-2 bg-neutral-700 text-white p-2">
        <!-- 左側: ジャンルとエナジーを縦に並べる -->
        <div class="flex flex-col">
            <div v-show="card.genre">ジャンル: {{ card.genre }}</div>
            <div v-show="card.energy">エナジー: {{ card.energy }}</div>
        </div>

        <!-- 右側: effect -->
        <div v-show="card.description">
            {{ card.description }}
        </div>
    </div>
</template>

<script setup>
defineProps(['card']);
</script>
