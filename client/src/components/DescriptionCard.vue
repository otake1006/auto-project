<template>
    <div
        class="overflow-y-auto flex-shrink-0  w-110 flex flex-row items-start space-x-4 border-2 bg-neutral-700 text-white p-2">
        <!-- 左側: ジャンルとエナジーを縦に並べる -->
        <div class="flex flex-col">
            <!-- <div v-show="card.genre">ジャンル: {{ card.genre }}</div>
            <div v-show="card.energy">エナジー:
                <span class="text-sky-400">{{ card.energy }}</span>
            </div> -->

        </div>

        <!-- 右側: effect -->
        <div v-show="card.description">
            <!-- {{ card.description }} -->
            <HighlightText :text=card.description :highlights="[
                { match: '[雷弾]', class: 'text-yellow-200 font-bold' },
                { match: '[0-9]{4} 年', class: 'text-green-600' }
            ]" />
        </div>
    </div>
</template>

<script setup>
import HighlightText from '@/components/HighlightText.vue'

defineProps(['card']);
</script>
