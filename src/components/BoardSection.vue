<template>
    <div class="flex h-screen w-screen flex-col overflow-hidden bg-green-200">
        <!-- 上部：バトル -->
        <BattleStatus />

        <!-- 下部：作戦＆カード選択 -->
        <div class="flex flex-[4] overflow-hidden border-t-2 border-gray-300 bg-neutral-700 p-4">
            <TacticsBoard class="w-1/2 overflow-y-auto pr-2" />
            <SkillSelection class="w-1/2 flex flex-col overflow-hidden pl-2" :tabs="tabs" :cards="filteredCards" />
        </div>
    </div>
</template>

<script setup>
import BattleStatus from './BattleStatus.vue'
import TacticsBoard from './TacticsBoard.vue'
import SkillSelection from './SkillSelection.vue'

</script>