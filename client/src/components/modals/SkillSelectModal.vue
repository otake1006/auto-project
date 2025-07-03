<template>
    <BaseModal :visible="show" @close="show = false">
        <template #container>
            <div class="relative bg-yellow-100 border-2 border-yellow-400 rounded-lg p-10">
                <button class="absolute top-2 right-2 text-red-500" @click="show = false">×</button>
                <div class="space-y-4">
                    <h2 class="text-lg font-bold">Select a Skill</h2>
                    <div class="gap-2">
                        <div v-for="card in cards" :key="card.id"
                            class="w-full max-w-4xl p-4 border rounded cursor-pointer hover:bg-blue-100"
                            :class="{ 'bg-blue-200': selected?.id === card.id }" @click="select(card)">
                            <Card :card="card" />
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button @click="$emit('cancel')" class="btn-secondary">Cancel</button>
                        <button @click="confirm" :disabled="!selected" class="btn-primary">Confirm</button>
                    </div>
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/modals/ModalBase.vue'
import Card from '@/components/CardItem.vue'

const props = defineProps({ cards: Array })
const emit = defineEmits(['confirm', 'cancel'])

const selected = ref(null)
const show = ref(true)

function select(card) {
    selected.value = card
}
function confirm() {
    emit('confirm', selected.value)
}
</script>
