<script setup>
import card3 from "./card3.vue"
defineProps({
  parentList: Object
})
</script>

<template>
 <draggable v-model="parentList" group="parent" item-key="id">
   <template #item="{ element }">
     <div class="parent-box">
       <draggable
         v-model="element.children"
         group="child"
         item-key="id"
        >
         <template #item="{ element: child}">
            <div class="child-box">
              <Card :name="child.name">
                </div>
         </template>
        </draggable>
       </div>
     </template>
    </draggable>
  </template>
