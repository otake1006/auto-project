<script setup>
import { ref } from 'vue'
import card3 from "./card.vue"
import draggable from "vuedraggable"
const props = defineProps({
  parentList: Object
})
const parent = ref(props.parentList)
</script>

<template>
<div class="border border-gray-300 rounded-xl p-4 shadow-sm bg-white space-y-15">
 <draggable v-model="parent" group="parent" item-key="id">
   <template #item="{ element }">
     <div class="parent-box flex">
        <p>親:{{ element.name }}</p>
       <draggable
         v-model="element.children"
         group="child"
         item-key="id"
         class="flex"
        >
         <template #item="{ element: child}">
            <div class="child-box">
              <card3 :cards="child"></card3>
                </div>
         </template>
        </draggable>
        </div>
     </template>
    </draggable>
    </div>

  </template>
