<script setup>
import { ref } from 'vue'
import card from './components/card5.vue'
const parentList = ref([
 {
   id: 1,
   name: '親1',
   children: [
   { id: 'a', name: 'スキル', energy: "1" },
   { id: 'b', name: 'ファイヤ' }
   ]
  },
  {
    id: 2,
    name: '親2',
    children: [
      { id: 'c', name: '子2a' },
      { id: 'd', name: '子2b' }
    ]
  }
])




</script>


<template>
  <card :cards="cards"></card>
</template>
