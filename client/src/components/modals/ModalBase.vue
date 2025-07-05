<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="close">
        <slot name="container">
            <div class="relative bg-white rounded-xl shadow-xl w-full max-w-4xl p-6">
                <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="close">×</button>
                <slot />
            </div>
        </slot>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { phaserEvents } from '@/events/EventCenter';

const props = defineProps({
    visible: Boolean,
});
const emit = defineEmits(['close']);

function close() {
    emit('close');
}

onMounted(() => {
    if (props.visible) {
        phaserEvents.emit('ui-opened');
    }
});

onUnmounted(() => {
    phaserEvents.emit('ui-closed');
});
</script>
