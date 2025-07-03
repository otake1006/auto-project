import { phaserEvents } from '@/events/EventCenter';

export function onShowReady() {
    phaserEvents.emit('showReady');
}
