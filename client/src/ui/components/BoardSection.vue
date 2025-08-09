<template>
    <div
        class="flex h-screen w-screen items-center justify-center bg-green-200 bg-[url(https://mir-s3-cdn-cf.behance.net/project_modules/source/588a44195922117.66168b374ece8.gif)]"
    >
        <div class="relative flex h-[810px] w-[1440px] flex-col rounded-lg bg-white shadow-lg">
            <!-- 上部：バトル -->
            <PhaserGame class="flex-1" />

            <!-- 下部：作戦＆カード選択 -->
            <div
                v-show="sceneStore.current === 'GameScene'"
                class="flex flex-[2] overflow-hidden border-t-2 border-gray-300 bg-neutral-700 p-4"
            >
                <TacticsBoard class="w-1/2 overflow-y-auto pr-2" />
                <SkillSelection
                    class="flex w-1/2 flex-col pl-2"
                    :tabs="tabs"
                    :cards="filteredCards"
                />
            </div>
            <div v-show="sceneStore.current === 'GameScene'" class="">
                <button @click="openUnifiedModal" class="btn">Open Unified Modal</button>
            </div>
            <!-- モーダルはすべてのシーンで表示 -->
            <ModalDispatcher />
        </div>
    </div>
</template>

<script setup>
    import PhaserGame from '@/PhaserGame.vue';
    import TacticsBoard from './TacticsBoard.vue';
    import SkillSelection from './SkillSelection.vue';
    import ModalDispatcher from '@/ui/components/modals/ModalDispatcher.vue';
    import { networkManager } from '@/core/NetworkManager.js';
    import { useModalStore } from '@/ui/stores/modalStore';
    import { useSkillStore } from '@/ui/stores/skillStore';
    import { useSceneStore } from '@/ui/stores/sceneStore';

    import { phaserEvents } from '@/events/EventCenter';
    import { ref } from 'vue';

    phaserEvents.on('scene-changed', onSceneChanged);

    const skillStore = useSkillStore();
    const modalStore = useModalStore();
    const sceneStore = useSceneStore();

    function onSceneChanged(newSceneName) {
        currentScene.value = newSceneName;
        console.log(newSceneName);
    }
    const currentScene = ref('StartScene');

    async function openSkillModal() {
        const selectSkills = skillStore.selectCards;
        if (!selectSkills.length) return;

        const selected = await modalStore.open('skillSelect', {
            cards: selectSkills,
        });

        if (selected) {
            // Colyseusに送信: room.send('selectSkill', { id: selected })
            skillStore.addSkills([selected]);
            skillStore.clearSelectCards();
            phaserEvents.emit('selectCard', selected.id);
        }
    }

    async function openUnifiedModal() {
        // スキルとレリックの配布カードデータを取得
        const selectSkills = skillStore.selectCards;
        const selectRelics = skillStore.selectRelicCards; // レリック配布カードを取得

        console.log('Select Skills:', selectSkills);
        console.log('Select Relics:', selectRelics);

        // カードが何もない場合は開かない
        if (!selectSkills.length && !selectRelics.length) return;

        const result = await modalStore.open('unifiedSelect', {
            skillCards: selectSkills,
            relicCards: selectRelics
        });

        if (result) {
            const { card, type } = result;

            // カードタイプに応じて適切なメソッドを呼び出し
            if (type === 'skill') {
                networkManager.send('selectSkill', card.id);
                skillStore.addSkills([card]);
                skillStore.clearSelectCards();
            } else if (type === 'relic') {
                networkManager.send('selectRelic', card.id);
                skillStore.addRelics([card]);
                skillStore.clearSelectRelicCards();
            }
        }
    }
</script>
