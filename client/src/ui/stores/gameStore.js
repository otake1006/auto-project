import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { phaserEvents } from '@/events/EventCenter.js';

export const useGameStore = defineStore('game', () => {
    const isMyPlayerReady = ref(false);
    const isEnemyReady = ref(false);
    const gameState = ref('ready'); // 'ready', 'ingame', 'endgame'

    // 両プレイヤーが準備完了かどうか
    const areBothPlayersReady = computed(() => {
        return isMyPlayerReady.value && isEnemyReady.value;
    });

    // カード編集が可能かどうか（自分が準備完了したら編集不可）
    const canEditCards = computed(() => {
        return gameState.value === 'ready' && !isMyPlayerReady.value;
    });

    // プレイヤー状態を更新
    function updateMyPlayerState(playerData) {
        isMyPlayerReady.value = playerData.ready;
    }

    function updateEnemyState(enemyData) {
        isEnemyReady.value = enemyData.ready;
    }

    // ゲーム状態を更新
    function updateGameState(state) {
        gameState.value = state;
    }

    // Phaserイベントリスナーを設定
    if (typeof window !== 'undefined' && phaserEvents) {
        phaserEvents.on('player-upd', updateMyPlayerState);
        phaserEvents.on('enemy-upd', updateEnemyState);
    }

    return {
        isMyPlayerReady,
        isEnemyReady,
        gameState,
        areBothPlayersReady,
        canEditCards,
        updateMyPlayerState,
        updateEnemyState,
        updateGameState
    };
});