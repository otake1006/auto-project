import { sm } from '@/core/SoundManager';

export function useClickSound() {
    function withClickSound(fn) {
        return (...args) => {
            sm.playClick();
            fn(...args);
        };
    }

    return { withClickSound };
}
