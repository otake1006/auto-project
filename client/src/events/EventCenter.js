import Phaser from 'phaser';

export const phaserEvents = new Phaser.Events.EventEmitter();

export const Event = {
    PLAYER_UPDATED: 'player-updated',
    ENEMY_UPDATED: 'enemy-updated',
    MY_PLAYER_READY: 'my-player-ready',
};
