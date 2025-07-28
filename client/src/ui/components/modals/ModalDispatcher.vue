<template>
    <ModalBase :visible="modalStore.isOpen" @close="modalStore.close()">
        <component :is="modalComponent" v-if="modalComponent" v-bind="modalStore.modalPayload" @confirm="onConfirm"
            @cancel="modalStore.close()" />
    </ModalBase>
</template>

<script setup>
import { computed } from 'vue';
import { useModalStore } from '@/ui/stores/modalStore';

import ModalBase from '@/ui/components/modals/ModalBase.vue';
import SkillSelectModal from '@/ui/components/modals/SkillSelectModal.vue';
import ConditionInputModal from '@/ui/components/modals/ConditionInputModal.vue';
import PlayerNameInputModal from '@/ui/components/modals/PlayerNameInputModal.vue';

const modalStore = useModalStore();

const modalComponent = computed(() => {
    switch (modalStore.modalType) {
        case 'skillSelect':
            return SkillSelectModal;
        case 'conditionInput':
            return ConditionInputModal;
        case 'playerNameInput':
            return PlayerNameInputModal;
        default:
            return null;
    }
});

function onConfirm(result) {
    modalStore.close(result);
}
</script>
