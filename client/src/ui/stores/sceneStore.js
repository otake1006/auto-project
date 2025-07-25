import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useSceneStore = defineStore('scene', () => {
    const scene = ref('BootScene');

    function set(name) {
        scene.value = name;
    }

    const current = computed(() => {
        return scene.value;
    });

    return {
        current,
        set,
    };
});
