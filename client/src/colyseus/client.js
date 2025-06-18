import * as Colyseus from 'colyseus.js';

export class ColyseusClient {
    constructor(endpoint = 'ws://', roomName = 'my_room') {
        this.client = new Colyseus.Client(endpoint);
        this.room = null;
        this.roomName = roomName;
    }

    async join() {
        this.room = await this.client.joinOrCreate('my_room');
        return this.room;
    }

    onPlayerAdd(callback) {
        const $ = getStateCallbacks(this.room);

        this.room.state.players.onAdd = callback;
    }

    onGameStateChange(callback) {
        this.room.state.onChange = callback;
    }

    onTurnChange(callback) {
        this.room.state.onChange = (changes) => {
            for (const change of changes) {
                if (change.field === 'turn') {
                    callback(change.value);
                }
            }
        };
    }

    sendSkillSet(data) {
        this.room.send('ready', data);
    }
}
