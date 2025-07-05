<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="close">
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    visible: Boolean,
});
const emit = defineEmits(['close']);

function close() {
    emit('close');
}
</script>
