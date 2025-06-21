<template>
    <ModalBase :visible="modalStore.isOpen" @close="modalStore.close()">
        <component :is="modalComponent" v-if="modalComponent" v-bind="modalStore.modalPayload" @confirm="onConfirm"
            @cancel="modalStore.close()" />
    </ModalBase>
</template>

<script setup>
import { computed } from 'vue';
import { useModalStore } from '@/stores/modalStore';

import ModalBase from '@/components/modals/ModalBase.vue';
import SkillSelectModal from '@/components/modals/SkillSelectModal.vue';

const modalStore = useModalStore();

const modalComponent = computed(() => {
    switch (modalStore.modalType) {
        case 'skillSelect':
            return SkillSelectModal;
        default:
            return null;
    }
});

function onConfirm(result) {
    modalStore.close(result);
}
</script>
