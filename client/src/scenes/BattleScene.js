import Character from '@/core/Character.js';
import Skill from '@/core/Skill.js';
import GameManager from '@/core/GameManager.js';
import CharacterView from '@/core/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';
import { watch, toRaw } from 'vue';

import { Client, Room } from 'colyseus.js';
import { getStateCallbacks } from 'colyseus.js';
import { ColyseusClient } from '@/colyseus/client';

// (...)

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.playerEntities = {}; // sessionId => { sprite, hpBar, hpText }
        this.colyseus = new ColyseusClient();
    }
    client = new Client('https://cd59c5mw-2567.asse.devtunnels.ms');
    room;

    preload() {
        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'assets/background.jpg');
    }

    async create() {
        console.log('joining room...');
        try {
            this.room = await this.client.joinOrCreate('my_room');
            console.log('Joined successfully!');
        } catch (e) {
            console.error(e);
        }

        this.add.text(20, 20, 'Press SPACE to use skill');

        this.input.keyboard.on('keydown-SPACE', async () => {
            const skillStore = useSkillStore();
            this.room.send(
                'ready',
                skillStore.skillSets.map((set) => ({
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

        this.manager = new GameManager(this.player, this.enemy, this);

        this.updateSkillsets();
        this.updateStatusBars();

        const $ = getStateCallbacks(this.room);

        $(this.room.state).players.onAdd((player, sessionId) => {
            if (this.room.sessionId === sessionId) {
                console.log('自分のキャラが追加されました:', player);
                // 自キャラの同期

                $(player).onChange(() => {
                    // update local position immediately
                    this.player.hp.current = player.hp;
                    this.player.mp.current = player.mp;
                    this.updateStatusBars();
                });
            } else {
                $(player).onChange(() => {
                    // update local position immediately
                    this.enemy.hp.current = player.hp;
                    this.enemy.mp.current = player.mp;
                    this.updateStatusBars();
                });
            }
        });
    }

    updateSkillsets() {
        const skillStore = useSkillStore();
        const rawSets = toRaw(skillStore.skillSets);

        this.player.updateSkillSets(rawSets);
        this.enemy.updateSkillSets(rawSets);
    }

    updateStatusBars() {
        this.playerView.updateBars();
        this.enemyView.updateBars();
    }

    onTurnEnd() {
        this.updateStatusBars();
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
