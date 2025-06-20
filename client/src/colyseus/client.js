import * as Colyseus from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { useSkillStore } from '@/stores/skillStore';

export class ColyseusClient {
    constructor(
        endpoint = import.meta.env.VITE_COLYSEUS_URL,
        roomName = import.meta.env.VITE_COLYSEUS_ROOM_NAME,
    ) {
        this.client = new Colyseus.Client(endpoint);
        this.room = null;
        this.roomName = roomName;

        this.join();
    }

    async join() {
        this.room = await this.client.joinOrCreate(this.roomName);
        this.initialize();
    }

    sendSkillSet(data) {
        this.room.send('ready', data);
    }

    initialize() {
        const skillStore = useSkillStore();
        if (!this.room) return;

        const $ = getStateCallbacks(this.room);

        $(this.room.state).players.onAdd((player, sessionId) => {
            if (this.room.sessionId === sessionId) {
                console.log('自分のキャラが追加されました:', player);
                // 自キャラの同期
                skillStore.setSkills(player.skills.toArray().map((skill) => skill.toJSON()));
                // todo 同じコード
                $(player).onChange(() => {
                    phaserEvents.emit(Event.PLAYER_UPDATED, { hp: player.hp, mp: player.mp });
                });
            } else {
                $(player).onChange(() => {
                    phaserEvents.emit(Event.ENEMY_UPDATED, { hp: player.hp, mp: player.mp });
                });
            }
        });
    }

    onPlayerUpdated(callback, context) {
        phaserEvents.on(Event.PLAYER_UPDATED, callback, context);
    }

    onEnemyUpdated(callback, context) {
        phaserEvents.on(Event.ENEMY_UPDATED, callback, context);
    }
}
