```js
<script setup>
defineProps({
    cards: Object,
});
const tailwindScript = document.createElement('script');
tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com');
document.head.appendChild(tailwindScript);
</script>

<template>
    <div class="h-20 w-48 flex-shrink-0 p-4" style="background-image: url('/assets/images/skillCard.png')">
        <div class="flex items-center justify-between">
            <img :src="`/assets/images/${cards.imgSrc}`" class="h-12 w-12 object-contain" />

            <!-- 中央：名前と能力 -->
            <div class="flex flex-col items-center text-center">
                <h2 class="text-lg text-white">{{ cards.name }}</h2>
                <p class="text-sm text-neutral-400">{{ cards.ability }}</p>
                <p v-show="cards.value" class="text-sm text-neutral-400">{{ cards.value }}</p>
            </div>

            <!-- 右：数値 -->
            <div class="text-sm font-bold text-sky-400">{{ cards.energy }}</div>
        </div>
    </div>
</template>

```
