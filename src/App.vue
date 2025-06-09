<script setup>
import { useBattleStore } from '@/stores/battleStore'
import CharacterStatus from './components/CharacterStatus.vue'

const battle = useBattleStore();

function resetStats() {
    battle.updateHp('player', 100)
    battle.updateMp('player', 50)
    battle.updateshield('player', 0)

    battle.updateHp('monster', 100)
    battle.updateMp('monster', 50)
    battle.updateshield('monster', 0)
}
</script>



<template>
    <div class="p-6 space-y-4">
        <h1 class="text-2xl font-bold">Battle Test</h1>

        <div class="grid grid-cols-2 gap-6">
            <div>
                <h2 class="text-xl font-semibold">Player</h2>
                <p>HP: {{ battle.player }}</p>
                <p>MP: {{ battle.player.mp }}</p>
                <p>Shield: {{ battle.player.shield }}</p>
                <div class="space-x-2 mt-2">
                    <button @click="battle.attack('player', 10)">Attack Player</button>
                    <button @click="battle.consumMp('player', 5)">Use MP</button>
                    <button @click="battle.shieldAttack('player', 3)">Shield Attack</button>
                    <button @click="battle.shieldPlus('player', 5)">Shield Plus</button>
                </div>
            </div>

            <div>
                <h2 class="text-xl font-semibold">Monster</h2>
                <p>HP: {{ battle.monster }}</p>
                <p>MP: {{ battle.monster.mp }}</p>
                <p>Shield: {{ battle.monster.shield }}</p>
                <div class="space-x-2 mt-2">
                    <button @click="battle.attack('monster', 12)">Attack Monster</button>
                    <button @click="battle.consumMp('monster', 6)">Use MP</button>
                    <button @click="battle.shieldAttack('monster', 4)">Shield Attack</button>
                    <button @click="battle.shieldPlus('monster', 7)">Shield Plus</button>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <button @click="resetStats" class="bg-gray-200 px-4 py-2 rounded">Reset</button>
        </div>
    </div>

    <CharacterStatus icon="/assets/player.png" :hp="battle.player.hp" :maxHp="battle.player.maxhp" :energy="battle.player.mp" :maxEnergy="battle.player.maxmp" />
    <CharacterStatus icon="/assets/monster.png" :hp="battle.monster.hp" :maxHp="battle.monster.maxhp" :energy="battle.monster.mp" :maxEnergy="battle.monster.maxmp" />
</template>