<template>
    <div class="flex items-center justify-center bg-[url('/select-skill.png')] bg-no-repeat bg-center bg-contain">
        <div class="p-25">
            <div>
                <div v-for="card in cards" :key="card.id"
                    class="w-full max-w-4xl p-4 rounded cursor-pointer hover:border hover:border-blue-300"
                    :class="{ 'bg-blue-200': selected?.id === card.id }" @click="confirm(card)">
                    <Card :card="card" />
                </div>
            </div>
        </div>
    </div>


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
function confirm(card) {
    emit('confirm', card)
}
</script>
