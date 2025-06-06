<script setup>
import { ref } from 'vue'
import card from './components/card5.vue'
const cards = [
  {
    name: 'ヒトカゲ',
    energy: '5',
    ability: '2回復',
    type: '炎',
    imgSrc: 'https://media.discordapp.net/attachments/1331433261716475925/1380186664227569837/8c45cf85becf84af9de3df62bb84a767.png?ex=68439f3f&is=68424dbf&hm=4e28312f6ab8c2f0f00bcb56964978aadd2fb3b312564601db3f117c9fb365eb&=&format=webp&quality=lossless&width=450&height=450'
  },
  {
    name: 'ゼニガメ',
    energy: '3',
    ability: '防御力アップ',
    type: '水',
    imgSrc: 'https://media.discordapp.net/attachments/1331433261716475925/1380186664227569837/8c45cf85becf84af9de3df62bb84a767.png?ex=68439f3f&is=68424dbf&hm=4e28312f6ab8c2f0f00bcb56964978aadd2fb3b312564601db3f117c9fb365eb&=&format=webp&quality=lossless&width=450&height=450'
  },
  {
    name: 'フシギダネ',
    energy: '4',
    ability: '回復5',
    type: '草',
    imgSrc: 'https://media.discordapp.net/attachments/1331433261716475925/1380186664227569837/8c45cf85becf84af9de3df62bb84a767.png?ex=68439f3f&is=68424dbf&hm=4e28312f6ab8c2f0f00bcb56964978aadd2fb3b312564601db3f117c9fb365eb&=&format=webp&quality=lossless&width=450&height=450'
  }
]




</script>


<template>
  <card :cards="cards"></card>
</template>
