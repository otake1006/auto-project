import Character from '@/core/Character.js';
import CharacterView from '@/core/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';

import { ColyseusClient } from '@/colyseus/client';
import { phaserEvents, Event } from '@/events/EventCenter';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.playerEntities = {}; // sessionId => { sprite, hpBar, hpText }
        this.colyseus = new ColyseusClient();
    }

    preload() {
        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'assets/background.jpg');
    }

    async create() {
        this.add.text(20, 20, 'Press SPACE to use skill');
        const skillStore = useSkillStore();

        this.input.keyboard.on('keydown-SPACE', async () => {
            this.colyseus.sendSkillSet(
                skillStore.skillSets
                    .filter((set) => set.skill !== null)
                    .map((set) => ({
                        skill: set.skill ? set.skill.id : null,
                        conditions: set.conditions.map((condition) => condition.id),
                    })),
            );
        });

        this.add
            .image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 10;
        const spacing = 600;

        const positions = [
            { x: centerX - spacing / 2, y: centerY }, // 自分
            { x: centerX + spacing / 2, y: centerY }, // 相手
        ];

        this.player = new Character(
            this,
            positions[0].x,
            positions[0].y,
            'player',
            'player',
            100,
            50,
            true,
        );

        this.enemy = new Character(
            this,
            positions[1].x,
            positions[1].y,
            'player',
            'enemy',
            100,
            50,
            false,
        );

        this.playerView = new CharacterView(this, this.player, positions[0].x, positions[0].y);
        this.enemyView = new CharacterView(this, this.enemy, positions[1].x, positions[1].y);

        // 通信処理
        this.colyseus.onPlayerUpdated(this.handlePlayerUpdated, this);
        this.colyseus.onEnemyUpdated(this.handlePlayerEnemyUpdated, this);
    }

    // 同じコードなので何とかする
    handlePlayerUpdated(field, value, id) {
        this.player?.updatePlayer(field, value);
        this.updateStatusBars();
    }

    // todo
    handlePlayerEnemyUpdated(field, value, id) {
        this.enemy?.updatePlayer(field, value);
        this.updateStatusBars();
    }

    updateStatusBars() {
        this.playerView.updateBars();
        this.enemyView.updateBars();
    }

    onGameOver(winner) {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.add.text(centerX, centerY, `${winner} wins!`, {
            fontSize: '32px',
            color: '#ff0000',
        });
    }
}
