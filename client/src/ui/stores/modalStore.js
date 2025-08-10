import { defineStore } from 'pinia';
import { ref } from 'vue';
import { phaserEvents } from '@/events/EventCenter';

export const useModalStore = defineStore('modal', () => {
    const isOpen = ref(false);
    const modalType = ref(null);
    const modalPayload = ref(null);
    const hidePlayerNameInput = ref(false);

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
        // keepOpenフラグがある場合は、結果を返すがモーダルは開いたままにする
        if (result && result.keepOpen) {
            if (resolve) {
                resolve(result);
            }
            return;
        }

        isOpen.value = false;
        modalType.value = null;
        modalPayload.value = null;

        phaserEvents.emit('ui-closed');

        if (resolve) {
            resolve(result);
            resolve = null;
        }
    }

    function setPlayerNameInputVisibility(visible) {
        hidePlayerNameInput.value = !visible;
    }

    return {
        isOpen,
        modalType,
        modalPayload,
        hidePlayerNameInput,
        open,
        close,
        setPlayerNameInputVisibility,
    };
});
