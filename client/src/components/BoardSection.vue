<template>
    <div
        class="flex h-screen w-screen items-center justify-center bg-green-200 bg-[url(https://mir-s3-cdn-cf.behance.net/project_modules/source/588a44195922117.66168b374ece8.gif)]">
        <div class="h-[810px] w-[1440px] flex flex-col bg-white shadow-lg rounded-lg">
            <!-- 上部：バトル -->
            <PhaserGame class="flex-1" />

            <!-- 下部：作戦＆カード選択 -->
            <div class="flex flex-[2] overflow-hidden border-t-2 border-gray-300 bg-neutral-700 p-4">
                <TacticsBoard class="w-1/2 overflow-y-auto pr-2" />
                <SkillSelection class="w-1/2 flex flex-col pl-2" :tabs="tabs" :cards="filteredCards" />
            </div>
        </div>
    </div>
</template>


<script setup>
import PhaserGame from '@/components/PhaserGame.vue'
import TacticsBoard from './TacticsBoard.vue'
import SkillSelection from './SkillSelection.vue'

</script>