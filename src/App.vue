<script setup>
import { ref } from 'vue'
import card from './components/card5.vue'
const parentList = ref([
 {
   id: 1,
   name: '親1',
   children: [
   { id: '1', name: 'スキル', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"},
   { id: '2', name: 'ファイア', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"},
   { id: '3', name: 'サンダー', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"}
   ]
  },
  {
       id: 2,
   name: '親2',
   children: [
   { id: '4', name: 'スキル', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"},
   { id: '5', name: 'ファイア', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"},
   { id: '6', name: 'サンダー', energy: "1" , ability:"ダメージ5", type:"スキル", imgSrc:"\hitokage.png"}
   ]

  }
])




</script>


<template>
  <card :parentList="parentList"></card>
</template>
