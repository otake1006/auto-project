<!-- src/components/PhaserGame.vue -->
<template>
    <div ref="gameContainer" class="flex flex-1 flex-row items-center justify-around" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Phaser from 'phaser';
import { StartScene } from '@/game/scenes/StartScene';
import { ResultScene } from '@/game/scenes/ResultScene';
import { PreloadScene } from '@/game/scenes/PreloadScene';
import { BootScene } from '@/game/scenes/BootScene';
import { MatchScene } from '@/game/scenes/MatchScene';
import { GameScene } from '@/game/scenes/GameScene';
import { HudScene } from '@/game/scenes/HudScene';
import { BackgroundScene } from '@/game/scenes/BackgroundScene';
import { AssetLoader } from '@/game/plugins/AssetLoader';


const gameContainer = ref(null);
let game = null;

// グローバルイベントなどでシーンの切り替え通知を受ける想定

onMounted(() => {
    const config = {
        type: Phaser.AUTO,
        mode: Phaser.Scale.ScaleModes.RESIZE,
        backgroundColor: '#191424',
        width: 1440,
        height: 810,
        parent: gameContainer.value,
        scene: [BootScene, PreloadScene, StartScene, MatchScene, HudScene, BackgroundScene, GameScene, ResultScene],
        plugins: {
            global: [{ key: 'AssetLoader', plugin: AssetLoader, start: true }],
        }
    };

    game = new Phaser.Game(config);
});

onBeforeUnmount(() => {
    if (game) {
        game.destroy(true);
    }
});
</script>
