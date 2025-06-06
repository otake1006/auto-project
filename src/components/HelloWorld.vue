<script setup>
import { ref } from 'vue'

defineProps({
  jungle: String,
  energy: Number,
  description: String
})

const count = ref(0)
</script>

<template>
  <div>{{}}</div>
  <div>{{}}</div>
  <div>{{}}</div>
</template>
