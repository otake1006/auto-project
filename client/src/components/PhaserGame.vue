<!-- src/components/PhaserGame.vue -->
<template>
    <div ref="gameContainer" class="flex flex-1 flex-row items-center justify-around" />
</template>

<script setup>
    import { onMounted, onBeforeUnmount, ref } from 'vue';
    import Phaser from 'phaser';
    import { BattleScene } from '@/scenes/BattleScene';

    const gameContainer = ref(null);
    let game = null;

    onMounted(() => {
        const config = {
            type: Phaser.AUTO,
            mode: Phaser.Scale.ScaleModes.RESIZE,
            backgroundColor: '#93cbee',
            width: 1440,
            height: 258,
            parent: gameContainer.value,
            scene: [StartScene, BattleScene],
        };

        game = new Phaser.Game(config);
    });

    onBeforeUnmount(() => {
        if (game) {
            game.destroy(true);
        }
    });
</script>
