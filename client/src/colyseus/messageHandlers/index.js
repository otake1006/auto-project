// src/colyseus/messageHandlers/index.js
import { onAction } from './onAction';
import { onCondition } from './onCondition';
import { onRandomSkill } from './onRandomSkill';
import { onRound } from './onRound';
import { onShowReady } from './onShowReady';
import { onSkillLogs } from './onSkillLogs';
import { onSkillSelectModal } from './onSkillSelectModal';
import { onTurn } from './onTurn';
import { phaserEvents } from '@/events/EventCenter';

/**
 * ルームにメッセージハンドラを登録します
 * @param {Colyseus.Room} room
 */
export function setupMessageHandlers(room) {
    room.onMessage('action', (data) => onAction(room, data));
    room.onMessage('randomSkill', (data) => onRandomSkill(room, data));
    room.onMessage('skillLogs', (data) => onSkillLogs(room, data));
    room.onMessage('giveCards', (data) => onSkillSelectModal(room, data));
    room.onMessage('showReady', () => onShowReady(room));
    room.onMessage('winner', (data) => {
        phaserEvents.emit('scene-changed', data); // ← scene変更イベントを送る
    });
    room.onMessage('turn', (data) => onTurn(data));
    room.onMessage('round', (data) => onRound(data));
    room.onMessage('condition', (data) => onCondition(data));
}
