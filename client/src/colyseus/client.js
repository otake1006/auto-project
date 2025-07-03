// src/colyseus/ColyseusClient.js
import * as Colyseus from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';
import { setupMessageHandlers } from './messageHandlers';
import { phaserEvents, Event } from '@/events/EventCenter';

export class ColyseusClient {
    client;
    room;
    mySessionId;

    constructor(
        endpoint = import.meta.env.VITE_COLYSEUS_URL,
        roomName = import.meta.env.VITE_COLYSEUS_ROOM_NAME,
    ) {
        this.client = new Colyseus.Client(endpoint);
        this.room = null;
        this.roomName = roomName;
    }

    /**
     * Colyseusルームに参加して初期化処理を行う
     */
    async join(onJoinedCallback) {
        try {
            this.room = await this.client.joinOrCreate(this.roomName);
            this.mySessionId = this.room.sessionId;
            console.log('[Colyseus] Joined Room:', this.roomName, 'Session ID:', this.mySessionId);

            this.initialize();

            if (onJoinedCallback) {
                onJoinedCallback();
            }
        } catch (e) {
            console.error('[Colyseus] Failed to join room:', e);
        }
    }

    /**
     * サーバーにスキル選択を送信
     * @param {Object} data
     */
    sendSkillSet(data) {
        if (this.room) {
            console.log(data);
            this.room.send('ready', data);
        }
    }

    sendSelectSkill(cardId) {
        if (this.room) {
            this.room.send('selectSkill', cardId);
        }
    }

    /**
     * ルームの初期化処理
     */
    initialize() {
        if (!this.room) return;

        const $ = getStateCallbacks(this.room);

        // プレイヤーの状態監視
        $(this.room.state).players.onAdd((player, sessionId) => {
            const isMyself = this.room.sessionId === sessionId;
            const event = isMyself ? Event.PLAYER_UPDATED : Event.ENEMY_UPDATED;

            console.log(`[Colyseus] ${isMyself ? 'My' : 'Enemy'} player added`, player);

            // HP/MP/Ready状態が変更されたらPhaserに通知
            $(player).onChange(() => {
                phaserEvents.emit(event, player);
            });
        });

        // メッセージハンドラを登録
        setupMessageHandlers(this.room);
        phaserEvents.on('selectCard', this.sendSelectSkill);
    }

    /**
     * Phaser側のイベント購読API
     */
    onPlayerUpdated(callback, context) {
        phaserEvents.on(Event.PLAYER_UPDATED, callback, context);
    }

    onEnemyUpdated(callback, context) {
        phaserEvents.on(Event.ENEMY_UPDATED, callback, context);
    }

    onSkillLog(callback, context) {
        phaserEvents.on('useSkill', callback, context);
    }

    onShowReady(callback) {
        phaserEvents.on('showReady', callback);
    }

    onTurn(callback, context) {
        phaserEvents.on('turn', callback, context);
    }

    onRound(callback, context) {
        phaserEvents.on('round', callback, context);
    }

    onSceneChanged(callback, context) {
        phaserEvents.on('resultScene', callback, context);
    }
}
