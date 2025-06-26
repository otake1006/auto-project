import { phaserEvents } from '@/events/EventCenter';

export function onRound() {
    phaserEvents.emit('round');
}
