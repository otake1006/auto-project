import * as Colyseus from 'colyseus.js';

class NetworkManager {
    constructor() {
        this.client = null;
        this.room = null;
        this.mySessionId = null;
    }

    async connect(serverUrl = import.meta.env.VITE_COLYSEUS_URL || 'ws://localhost') {
        this.client = new Colyseus.Client(serverUrl);
    }

    async joinOrCreateRoom(roomName = import.meta.env.VITE_COLYSEUS_ROOM_NAME || 'debug_room') {
        this.room = await this.client.joinOrCreate(roomName);
        this.mySessionId = this.room.sessionId;
        return this.room;
    }

    onMessage(type, callback) {
        this.room?.onMessage(type, callback);
    }

    onStateChange(callback) {
        this.room?.onStateChange(callback);
    }

    send(type, data) {
        this.room?.send(type, data);
    }

    leave() {
        this.room?.leave();
        this.room = null;
    }

    isConnected() {
        return !!this.room && this.room.connection?.readyState === WebSocket.OPEN;
    }

    getRoom() {
        return this.room;
    }

    getSessionId() {
        return this.mySessionId;
    }
}

export const networkManager = new NetworkManager();
