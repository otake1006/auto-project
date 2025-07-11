import { Room, Client } from '@colyseus/core';
import { MyRoomState, Player } from './schema/MyRoomState2';
import { ActionHandler } from '../services/ActionHandler';
import { getInitialSkill } from '../data/skill';
import { GameConfig } from '../config/game';

export class MyRoom extends Room {
    maxClients = GameConfig.MAX_CLIENTS;
    name: string;
    state = new MyRoomState();
    private actionHandler: ActionHandler;
    onCreate() {
        this.actionHandler = new ActionHandler(this);
        this.state.initialSkill = getInitialSkill();
        //this.gameLoopService = new GameLoopService(this.state);

        this.onMessage('*', (client, type, payload) => {
            switch (type) {
                case 'ready':
                    this.actionHandler.handleReady(client, payload);
                    break;
                case 'requestPlayer':
                    this.actionHandler.handleRequestPlayer();
                    break;
                case 'selectSkill':
                    this.actionHandler.handleSelectSkill(client, payload);
            }
        });
    }

    onJoin(client: Client, options: any) {
        const joinPlayer = new Player();
        this.state.players.set(client.sessionId, joinPlayer);
        if (this.state.players.size === 2) {
            this.broadcast('matching');
        }
    }

    // Called when a client leaves the room
    onLeave(client: Client, options: any) {
        if (this.state.gameState !== 'endgame') this.broadcast('leave');
        this.disconnect();
    }

    // Called when the room is disposed
    onDispose() {
        console.log('ルームが削除されました');
    }
}
