<template>
    <div
        class="flex items-center justify-center bg-[url('assets/images/select-skill.png')] bg-contain bg-center bg-no-repeat"
    >
        <div class="p-25">
            <div>
                <div
                    v-for="card in cards"
                    :key="card.id"
                    class="w-full max-w-4xl cursor-pointer rounded p-4 hover:border hover:border-green-300"
                    :class="{ 'bg-green-200': selected?.id === card.id }"
                    @click="confirm(card)"
                >
                    <Card :card="card" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import Card from '@/ui/components/CardItem.vue';

    const props = defineProps({ cards: Array });
    const emit = defineEmits(['confirm', 'cancel']);

    const selected = ref(null);
    const show = ref(true);

    function select(card) {
        selected.value = card;
    }
    function confirm(card) {
        emit('confirm', card);
    }
</script>
