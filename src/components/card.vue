<script setup>
	defineProps({
    id: Number,
		name: String,
		energy: String,
    ability: String,
    type: String,
    imgSrc: String,
		
	});
  const tailwindScript = document.createElement('script')
  tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com')
  document.head.appendChild(tailwindScript)
</script>

<template>
  <div class="w-60 border border-gray-300 rounded-xl p-4 shadow-sm bg-white">
    
    <div class="flex items-center justify-between">

      <img
       :src="imgSrc"
       class="w-12 h-12 object-contain"
      />

    <!-- 中央：名前と能力 -->
     <div class="flex flex-col items-center text-center">
       <h2 class="text-lg font-semibold">{{name}}</h2>
       <p class="text-sm text-gray-500">{{ability}}</p>
     </div>

     <!-- 右：数値 -->
     <div class="text-sm text-gray-700 font-bold">{{energy}}</div>
     
   </div>
  </div>

</template>
