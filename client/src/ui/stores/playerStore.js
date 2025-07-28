import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePlayerStore = defineStore('player', () => {
    const playerName = ref('');
    
    // プレイヤー名が設定されているかチェック
    const hasPlayerName = computed(() => {
        return playerName.value.trim().length > 0;
    });

    // プレイヤー名を設定
    function setPlayerName(name) {
        const trimmedName = name.trim();
        if (trimmedName.length > 0) {
            playerName.value = trimmedName;
            // ローカルストレージにも保存
            localStorage.setItem('playerName', trimmedName);
        }
    }

    // プレイヤー名を取得
    function getPlayerName() {
        return playerName.value || 'プレイヤー';
    }

    // ローカルストレージからプレイヤー名を読み込み
    function loadPlayerName() {
        const storedName = localStorage.getItem('playerName');
        if (storedName && storedName.trim().length > 0) {
            playerName.value = storedName.trim();
            return true;
        }
        return false;
    }

    // プレイヤー名をクリア
    function clearPlayerName() {
        playerName.value = '';
        localStorage.removeItem('playerName');
    }

    // 初期化時にローカルストレージから読み込み
    loadPlayerName();

    return {
        playerName,
        hasPlayerName,
        setPlayerName,
        getPlayerName,
        loadPlayerName,
        clearPlayerName
    };
});