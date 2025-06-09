<!-- views/GameView.vue -->
<template>
  <div class="flex justify-around items-center min-h-screen bg-black text-white">
    <CharacterStatus
      icon="/assets/player.png"
      :hp="5"
      :maxHp="20"
      :energy="6"
      :maxEnergy="6"
    />
    <CharacterStatus
      icon="/assets/monster.png"
      :hp="15"
      :maxHp="20"
      :energy="3"
      :maxEnergy="6"
    />
  </div>
</template>

<script setup lang="ts">
import CharacterStatus from './components/CharacterStatus.vue'
</script>