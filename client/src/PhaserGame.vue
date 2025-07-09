<!-- src/components/PhaserGame.vue -->
<template>
    <div ref="gameContainer" class="flex flex-1 flex-row items-center justify-around" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Phaser from 'phaser';
import { StartScene } from '@/scenes/StartScene';
import { ResultScene } from '@/scenes/ResultScene';
import { useModalStore } from '@/stores/modalStore';
import { PreloadScene } from '@/scenes/PreloadScene';
import { BootScene } from '@/scenes/BootScene';
import { MatchScene } from '@/scenes/MatchScene';
import { GameScene } from '@/scenes/GameScene';
import { HudScene } from '@/scenes/HudScene';
import { BackgroundScene } from './scenes/BackgroundScene';


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
    };

    game = new Phaser.Game(config);
});

onBeforeUnmount(() => {
    if (game) {
        game.destroy(true);
    }
});
</script>
