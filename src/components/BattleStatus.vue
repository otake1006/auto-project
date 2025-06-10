<template>
    <div class="flex flex-1 flex-row items-center justify-around p-4">
        <CharacterStatus icon="/assets/player.png" :hp="battle.player.hp" :maxHp="battle.player.maxhp" :energy="battle.player.mp" :maxEnergy="battle.player.maxmp" />
        <CharacterStatus icon="/assets/monster.png" :hp="battle.monster.hp" :maxHp="battle.monster.maxhp" :energy="battle.monster.mp" :maxEnergy="battle.monster.maxmp" />
    </div>
</template>

<script setup>
    import CharacterStatus from './CharacterStatus.vue'
    import {useBattleStore} from '@/stores/battleStore'
    const battle = useBattleStore();
</script>
