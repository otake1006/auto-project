<template>
    <div class="flex flex-1 flex-row items-center justify-around p-4">
        <CharacterStatus icon="/assets/player.png" :hp="20" :maxHp="20" :energy="6" :maxEnergy="6" />
        <CharacterStatus icon="/assets/monster.png" :hp="15" :maxHp="20" :energy="3" :maxEnergy="6" />
    </div>
</template>

<script setup>
    import CharacterStatus from './CharacterStatus.vue'
</script>
