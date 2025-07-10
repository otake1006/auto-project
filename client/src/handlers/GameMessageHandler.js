// handlers/GameMessageHandler.ts
export class GameMessageHandler {
    scene;
    room;

    constructor(scene, room) {
        this.scene = scene;
        this.room = room;
        this.registerHandlers();
    }

    registerHandlers() {
        this.room.onMessage('action', (payload) => {
            console.log('[GameMessageHandler] action:', payload);
            this.scene.events.emit('player:attack', payload);
        });

        this.room.onMessage('randomSkill', (payload) => {
            console.log('[GameMessageHandler] randomSkill:', payload);
            this.scene.events.emit('randomSkill', payload);
        });

        this.room.onMessage('skillLogs', (payload) => {
            this.scene.events.emit('skillLogs', payload);
        });

        this.room.onMessage('giveCards', (payload) => {
            this.scene.events.emit('giveCards', payload);
        });

        this.room.onMessage('showReady', (payload) => {
            this.scene.events.emit('showReady', payload);
        });

        this.room.onMessage('winner', (payload) => {
            this.scene.events.emit('resultScene', payload);
        });

        this.room.onMessage('turn', (payload) => {
            this.scene.events.emit('turn', payload);
        });

        this.room.onMessage('round', (payload) => {
            this.scene.events.emit('round', payload);
        });

        this.room.onMessage('condition', (payload) => {
            this.scene.events.emit('condition', payload);
        });
    }

    /**
     * 明示的にリスナーを解除（再接続などを考慮）
     */
    unregisterAll() {
        this.room.removeAllListeners();
    }
}
