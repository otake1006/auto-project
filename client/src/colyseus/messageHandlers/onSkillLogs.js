import { phaserEvents } from '@/events/EventCenter';

export function onSkillLogs(room, logs) {
    logs.forEach(({ sessionId, skill }) => {
        const isEnemy = room.sessionId !== sessionId;
        phaserEvents.emit('useSkill', { isEnemy, skill });
    });
}
