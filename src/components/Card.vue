<!-- components/Card.vue -->
<template>
    <div class="p-4 py-1 flex flex-row gap-6">
        <!-- <CardItem :card="card" /> -->
            <Card :cards="card"></Card>
            <!-- <DescriptionCard :card="card" /> -->
    </div>
</template>

<script setup>
import CardItem from './CardItem.vue'
import Card from './card.vue'
import DescriptionCard from './DescriptionCard.vue'

defineProps({
    card: {
        type: Object,
        required: true
    }
})
</script>
