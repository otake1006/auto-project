<template>
    <!-- PlayerNameInputModalは直接表示（透明背景のため） -->
    <PlayerNameInputModal 
        v-if="modalStore.isOpen && modalStore.modalType === 'playerNameInput' && !modalStore.hidePlayerNameInput"
        v-bind="modalStore.modalPayload" 
        @confirm="onConfirm"
        @cancel="modalStore.close()" 
    />
    
    <!-- その他のモーダルはModalBaseを使用 -->
    <ModalBase 
        v-else-if="modalStore.isOpen && modalComponent"
        :visible="modalStore.isOpen" 
        @close="modalStore.close()"
    >
        <component 
            :is="modalComponent" 
            v-bind="modalStore.modalPayload" 
            @confirm="onConfirm"
            @cancel="modalStore.close()" 
        />
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
        // playerNameInputは直接表示するためここでは処理しない
        default:
            return null;
    }
});

function onConfirm(result) {
    modalStore.close(result);
}
</script>
