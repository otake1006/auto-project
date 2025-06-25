<template>
    <div class="relative w-full rounded-xl border-2 border-white bg-neutral-900 p-4 text-white shadow-2xl">
        <div class="mb-4 text-center text-lg font-bold">任意の値を入力</div>

        <!-- ターン入力セクション -->
        <div class="mb-4 flex items-center justify-between rounded border border-white bg-black p-2">
            <div class="flex items-center space-x-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-black">⏱</div>
                <div class="text-sm">{{ props.card.name }} = <span class="text-red-400">{{ displayValue }}</span></div>
            </div>
            <button
                class="rounded border border-white px-2 py-1 text-sm transition hover:bg-white hover:text-black">切替</button>
        </div>

        <!-- 電卓ボタン -->
        <div class="mb-4 grid grid-cols-3 gap-2">
            <button v-for="btn in buttons" :key="btn.label" @click="handleInput(btn)"
                class="rounded border-2 p-4 text-xl shadow-inner hover:bg-neutral-700" :class="btn.class">
                {{ btn.label }}
            </button>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    card: { type: Object, required: true }
});
const emit = defineEmits(['confirm']);

const input = ref(''); // 数字列として扱うと便利
const displayValue = computed(() => input.value || '0');

// 数字・操作ボタンの定義（保守性と拡張性UP）
const buttons = [
    { label: '7' }, { label: '8' }, { label: '9' },
    { label: '4' }, { label: '5' }, { label: '6' },
    { label: '1' }, { label: '2' }, { label: '3' },
    { label: '0', class: 'col-span-1' },
    { label: '決', action: 'confirm' },
    { label: '←', action: 'backspace' }
];

// 入力処理
function handleInput(btn) {
    const { label, action } = btn;

    if (action === 'confirm') {
        emit('confirm', parseInt(input.value || '0'));
        input.value = '';
    } else if (action === 'backspace') {
        input.value = input.value.slice(0, -1);
    } else {
        if (input.value.length < 6) input.value += label; // 桁数制限あり
    }
}
</script>
