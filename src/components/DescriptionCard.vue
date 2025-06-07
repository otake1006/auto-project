<template>
    <div class="w-full flex flex-row items-start space-x-4 border-2 bg-neutral-700 text-white">
        <!-- 左側: ジャンルとエナジーを縦に並べる -->
        <div class="flex flex-col space-y-1">
            <div>ジャンル: {{ card.description.genre }}</div>
            <div>エナジー: {{ card.description.energy }}</div>
        </div>

        <!-- 右側: effect -->
        <div>
            {{ card.description.effect }}
        </div>
    </div>
</template>

<script setup>
defineProps(['card']);
</script>
