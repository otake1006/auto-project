<template>
    <div
        class="flex h-screen w-screen items-center justify-center bg-green-200 bg-[url(https://mir-s3-cdn-cf.behance.net/project_modules/source/588a44195922117.66168b374ece8.gif)]"
    >
        <div class="relative flex h-[810px] w-[1440px] flex-col rounded-lg bg-white shadow-lg">
            <!-- 上部：バトル -->
            <PhaserGame class="flex-1" />

            <!-- 下部：作戦＆カード選択 -->
            <div
                v-show="currentScene === 'BattleScene'"
                class="flex flex-[2] overflow-hidden border-t-2 border-gray-300 bg-neutral-700 p-4"
            >
                <TacticsBoard class="w-1/2 overflow-y-auto pr-2" />
                <SkillSelection
                    class="flex w-1/2 flex-col pl-2"
                    :tabs="tabs"
                    :cards="filteredCards"
                />
                <SpriteButton
                    sprite-src="assets/chests.png"
                    :scale="4"
                    :col="0"
                    :row="0"
                    className="absolute bottom-40 left-0"
                    :action="openSkillModal"
                />
            </div>
            <button v-show="currentScene === 'BattleScene'" @click="openSkillModal" class="btn">
                Open Skill Modal
            </button>
            <ModalDispatcher v-show="currentScene === 'BattleScene'" />
        </div>
    </div>
</template>

<script setup>
    import PhaserGame from '@/components/PhaserGame.vue';
    import TacticsBoard from './TacticsBoard.vue';
    import SkillSelection from './SkillSelection.vue';
    import ModalDispatcher from '@/components/modals/ModalDispatcher.vue';
    import { useModalStore } from '@/stores/modalStore';
    import SpriteButton from './SpriteButton.vue';
    import { phaserEvents, Event } from '@/events/EventCenter';
    import { ref } from 'vue';

    phaserEvents.on('scene-changed', onSceneChanged);

    const modalStore = useModalStore();

    function onSceneChanged(newSceneName) {
        currentScene.value = newSceneName;
        console.log(newSceneName);
    }
    const currentScene = ref('StartScene');

    async function openSkillModal() {
        const selected = await modalStore.open('conditionInput', {
            cards: [
                { id: 1, name: 'Fireball', description: 'Burns enemy' },
                { id: 2, name: 'Ice Shield', description: 'Blocks damage' },
                { id: 3, name: 'Heal', description: 'Restores HP' },
            ],
        });

        if (selected) {
            console.log('Selected skill:', selected);
            // Colyseusに送信: room.send('selectSkill', { id: selected })
        }
    }
</script>
