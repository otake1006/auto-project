import { defineStore } from 'pinia';
import { ref } from 'vue';
import { phaserEvents } from '@/events/EventCenter';

export const useModalStore = defineStore('modal', () => {
    const isOpen = ref(false);
    const modalType = ref(null);
    const modalPayload = ref(null);

    let resolve;

    function open(type, payload = null) {
        isOpen.value = true;
        modalType.value = type;
        modalPayload.value = payload;
        phaserEvents.emit('ui-opened');

        return new Promise((res) => {
            resolve = res;
        });
    }

    function close(result = null) {
        isOpen.value = false;
        modalType.value = null;
        modalPayload.value = null;

        phaserEvents.emit('ui-closed');

        if (resolve) {
            resolve(result);
            resolve = null;
        }
    }

    return {
        isOpen,
        modalType,
        modalPayload,
        open,
        close,
    };
});
