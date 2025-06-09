<script setup>
	defineProps({
    cards: Object
		
	});
  const tailwindScript = document.createElement('script')
  tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com')
  document.head.appendChild(tailwindScript)
</script>

<template>
  <div class="w-full min-w-40 border border-gray-300 rounded-xl p-4 shadow-sm bg-white ">
    
    <div class="flex items-center justify-between">

      <img
       :src="cards.imgSrc"
       class="w-12 h-12 object-contain"
      />

    <!-- 中央：名前と能力 -->
     <div class="flex flex-col items-center text-center">
       <h2 class="text-lg font-semibold">{{cards.name}}</h2>
       <p class="text-sm text-gray-500">{{cards.ability}}</p>
     </div>

     <!-- 右：数値 -->
     <div class="text-sm text-gray-700 font-bold">{{cards.energy}}</div>
     
   </div>
  </div>

</template>
