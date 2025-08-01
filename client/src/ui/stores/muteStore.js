import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useMuteStore = defineStore('mute', () => {
    // Initialize from localStorage or defaults
    const bgmMuted = ref(loadFromStorage('bgmMuted', false));
    const seMuted = ref(loadFromStorage('seMuted', false));

    // Watch for changes and persist to localStorage
    watch(bgmMuted, (newValue) => {
        saveToStorage('bgmMuted', newValue);
    });

    watch(seMuted, (newValue) => {
        saveToStorage('seMuted', newValue);
    });

    // Actions
    function setBgmMuted(muted) {
        bgmMuted.value = muted;
    }

    function setSeMuted(muted) {
        seMuted.value = muted;
    }

    function toggleBgmMuted() {
        bgmMuted.value = !bgmMuted.value;
    }

    function toggleSeMuted() {
        seMuted.value = !seMuted.value;
    }

    return {
        bgmMuted,
        seMuted,
        setBgmMuted,
        setSeMuted,
        toggleBgmMuted,
        toggleSeMuted,
    };
});

// Helper functions for localStorage
function loadFromStorage(key, defaultValue) {
    try {
        const stored = localStorage.getItem(`mute_${key}`);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.warn(`Failed to load ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(`mute_${key}`, JSON.stringify(value));
    } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
    }
}