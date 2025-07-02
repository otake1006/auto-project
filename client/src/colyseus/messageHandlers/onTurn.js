import { phaserEvents } from '@/events/EventCenter';

export function onTurn(turn) {
    phaserEvents.emit('turn', turn);
}
