import * as Colyseus from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';
import { phaserEvents, Event } from '@/events/EventCenter';
import { useSkillStore } from '@/stores/skillStore';

export class ColyseusClient {
    mySessionId;

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

        this.mySessionId = this.room.sessionId;
        console.log(this.mySessionId);
        const $ = getStateCallbacks(this.room);

        $(this.room.state).players.onAdd((player, sessionId) => {
            if (this.room.sessionId === sessionId) {
                console.log('自分のキャラが追加されました:', player);
                // 自キャラの同期
                // $(player.skills).onAdd((test) => {
                //     console.log(test);
                // });

                // todo 同じコード
                $(player).onChange(() => {
                    phaserEvents.emit(Event.PLAYER_UPDATED, {
                        hp: player.hp,
                        mp: player.mp,
                        ready: player.ready,
                    });
                });
            } else {
                $(player).onChange(() => {
                    phaserEvents.emit(Event.ENEMY_UPDATED, {
                        hp: player.hp,
                        mp: player.mp,
                        ready: player.ready,
                    });
                });
            }

            // $(player.ready).onChange(() => {
            //     phaserEvents.emit('player-ready');
            // });
        });

        this.room.onMessage('action', (skills) => {
            skillStore.setSkills(skills);
        });

        this.room.onMessage('randomSkill', (skills) => {
            console.log(skills);
            skillStore.addSkills(skills);
        });

        this.room.onMessage('skillLogs', (logs) => {
            logs.forEach(({ sessionId, skill }) => {
                const isEnemy = mySessionId === sessionId;
                phaserEvents.emit('useSkill', {
                    isEnemy,
                    skill,
                });
            });
        });
    }

    onPlayerUpdated(callback, context) {
        phaserEvents.on(Event.PLAYER_UPDATED, callback, context);
    }

    onEnemyUpdated(callback, context) {
        phaserEvents.on(Event.ENEMY_UPDATED, callback, context);
    }

    onSkillLog(callback, context) {
        phaserEvents.on('useSkill', callback, context);
    }
}
