<template>
    <div class="relative w-full max-w-xs rounded-xl border-2 border-white bg-neutral-900 p-4 text-white shadow-2xl">
        <div class="mb-4 text-center text-lg font-bold">任意の値を入力</div>

        <!-- ターン入力セクション -->
        <div class="mb-4 flex items-center justify-between rounded border border-white bg-black p-2">
            <div class="flex items-center space-x-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-black">⏱</div>
                <div class="text-sm">ターン = <span class="text-red-400">?</span></div>
            </div>
            <button
                class="rounded border border-white px-2 py-1 text-sm transition hover:bg-white hover:text-black">切替</button>
        </div>

        <!-- 電卓ボタン -->
        <div class="mb-4 grid grid-cols-3 gap-2">
            <button class="rounded border-2 p-4 text-xl shadow-inner hover:bg-neutral-700">7</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">8</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">9</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">4</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">5</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">6</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">1</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">2</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">3</button>
            <button
                class="col-span-1 rounded border-2 bg-neutral-800 p-4 text-xl shadow-inner hover:bg-neutral-700">0</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow hover:bg-neutral-700">決</button>
            <button class="rounded border-2 bg-neutral-800 p-4 text-xl shadow hover:bg-neutral-700">←</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ cards: Array });
const emit = defineEmits(['confirm', 'cancel']);
const selected = ref(null);

function select(id) {
    selected.value = id;
}
function confirm() {
    emit('confirm', selected.value);
}
</script>
