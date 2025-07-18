<template>
    <div :class="[
        'bg-no-repeat cursor-pointer inline-block select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80',
        className,
    ]" :style="[spriteStyle, style]" @click="handleClick" @keydown.enter.prevent="handleClick"
        @keydown.space.prevent="handleClick" tabindex="0" role="button" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    spriteSrc: { type: String, required: true }, // スプライト画像パス
    row: { type: Number, required: true },       // 行 index（0-based）
    col: { type: Number, required: true },       // 列 index（0-based）
    size: { type: Number, default: 32 },         // スプライトサイズ
    scale: { type: Number, default: 1 },         // 表示スケーリング
    disabled: { type: Boolean, default: false }, // 無効状態
    className: { type: String, default: '' },    // 追加クラス（Tailwind等）
    style: { type: Object, default: () => ({}) },// 追加スタイル
    action: { type: Function, default: null },   // 任意の動作
})

const emit = defineEmits(['click'])

const spriteStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundImage: `url(${props.spriteSrc})`,
    backgroundPosition: `-${props.col}px -${props.row}px`,
    backgroundSize: 'auto',
    transform: `scale(${props.scale})`,  // ← ここで Phaser 風 toScale(n)
    transformOrigin: 'top left',
}))


function handleClick(event) {
    if (props.disabled) return
    emit('click', event)
    if (props.action) props.action(event)
}
</script>
