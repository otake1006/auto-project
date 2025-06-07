<!-- components/Card.vue -->
<template>
    <div class="p-4 w-full py-1 flex flex-row gap-6">
        <CardItem :card="card" />
        <DescriptionCard :card="card" />
    </div>
</template>

<script setup>
import CardItem from './CardItem.vue'
import DescriptionCard from './DescriptionCard.vue'

defineProps({
    card: {
        type: Object,
        required: true
    }
})
</script>
