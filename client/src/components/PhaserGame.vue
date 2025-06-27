<!-- src/components/PhaserGame.vue -->
<template>
    <div ref="gameContainer" class="flex flex-1 flex-row items-center justify-around" />
</template>

<script setup>
    import { onMounted, onBeforeUnmount, ref } from 'vue';
    import Phaser from 'phaser';
    import { BattleScene } from '@/scenes/BattleScene';
    import { StartScene } from '@/scenes/StartScene';
    import { ResultScene } from '@/scenes/ResultScene';
    import { useModalStore } from '@/stores/modalStore';

    const gameContainer = ref(null);
    let game = null;

    // グローバルイベントなどでシーンの切り替え通知を受ける想定

    onMounted(() => {
        const config = {
            type: Phaser.AUTO,
            mode: Phaser.Scale.ScaleModes.RESIZE,
            backgroundColor: '#93cbee',
            width: 1440,
            height: 810,
            parent: gameContainer.value,
            scene: [StartScene, BattleScene, ResultScene],
        };

        game = new Phaser.Game(config);
    });

    onBeforeUnmount(() => {
        if (game) {
            game.destroy(true);
        }
    });
</script>
