import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGameStore = defineStore('game', () => {
    const isMyPlayerReady = ref(false);
    const gameState = ref('ready'); // 'ready', 'ingame', 'endgame'

    // カード編集が可能かどうか（自分が準備完了したら編集不可）
    const canEditCards = computed(() => {
        return gameState.value === 'ready' && !isMyPlayerReady.value;
    });

    // プレイヤー状態を更新
    function setMyPlayerReady(ready) {
        isMyPlayerReady.value = ready;
    }

    function reset() {
        isMyPlayerReady.value = false;
        gameState.value = 'ready';
    }

    return {
        canEditCards,
        setMyPlayerReady,
        reset,
    };
});
