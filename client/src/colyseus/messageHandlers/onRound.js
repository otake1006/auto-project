import { phaserEvents } from '@/events/EventCenter';

export function onRound(round) {
    phaserEvents.emit('round', round);
}
