import { System } from '@/core/System.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { getStateCallbacks } from 'colyseus.js';

export class StateWatchSystem extends System {
    /**
     * @param {Colyseus.Room} room
     */
    constructor(room) {
        super();
        const $ = getStateCallbacks(room);

        $(room.state).players.onAdd((player, sessionId) => {
            const isMyself = room.sessionId === sessionId;

            console.log(`[Colyseus] ${isMyself ? 'My' : 'Enemy'} player added`, player);

            // HP/MP/Ready状態が変更されたらPhaserに通知
            $(player).onChange(() => {
                phaserEvents.emit(isMyself ? 'player-upd' : 'enemy-upd', {
                    hp: player.hp,
                    mp: player.mp,
                    ready: player.ready,
                    shield: player.shield,
                });
            });

            // プレイヤー名が変更されたら通知
            if (player.name) {
                phaserEvents.emit('player-name-update', {
                    sessionId: sessionId,
                    name: player.name
                });
            }

            // プレイヤー名の変更を監視
            $(player).listen('name', (value) => {
                console.log(`[StateWatchSystem] Player name changed: ${sessionId} -> ${value}`);
                phaserEvents.emit('player-name-update', {
                    sessionId: sessionId,
                    name: value
                });
            });
        });
    }
    filter() {
        return false;
    }
    update() {}
    destroy() {}
}
