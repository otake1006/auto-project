import Character from '@/core/Character.js';
import GameManager from '@/core/GameManager.js';
import CharacterView from '@/core/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';

import { ColyseusClient } from '@/colyseus/client';
import { phaserEvents, Event } from '@/events/EventCenter';

import { ReadyButton } from '@/ui/ReadyButton';
import { EffectManager } from '@/core/EffectManager.js';
import { TextEffect } from '@/effects/TextEffect.js';
import { RoundStatusUI } from '@/ui/RoundStatus.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.colyseus = new ColyseusClient();
    }

    preload() {
        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('winIcon', 'assets/3302.png');
    }

    async create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY - 10;
        const spacing = 600;

        const positions = [
            { x: centerX - spacing / 2, y: centerY }, // 自分
            { x: centerX + spacing / 2, y: centerY }, // 相手
        ];

        this.add
            .image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.roundUI = new RoundStatusUI(this, centerX, 20);

        this.readyButton = new ReadyButton(this, centerX, centerY + 30, () => {
            console.log('Ready clicked');
        });

        this.effectManager = new EffectManager(this);

        // this.effectManager.add(
        //     new TextEffect(this, this.cameras.main.centerX, this.cameras.main.centerY, 'ROUND 1!', {
        //         fontSize: '80px',
        //         color: '#FFD700',
        //         stroke: '#000000',
        //         duration: 1500,
        //         onComplete: () => {
        //             // 次の演出などの処理
        //         },
        //     }),
        // );

        this.initPlayers(positions);
        this.playerView.showSkillLog('ファイアを唱えた！');
        this.playerView.showSkillLog('ファイアを唱えた！');
        this.playerView.showSkillLog('オートローグマジシャンを唱えた！');

        // 通信処理
        this.colyseus.onPlayerUpdated(this.handlePlayerUpdated, this);
        this.colyseus.onEnemyUpdated(this.handlePlayerEnemyUpdated, this);

        this.updateStatusBars();
    }

    updateClickCountText() {
        const skillStore = useSkillStore();

        this.colyseus.sendSkillSet(
            skillStore.skillSets
                .filter((set) => set.skill !== null)
                .map((set) => ({
                    skill: set.skill ? set.skill.id : null,
                    conditions: set.conditions.map((condition) => condition.id),
                })),
        );
    }

    handleReady() {
        phaserEvents.emit(Event.MY_PLAYER_READY);
    }

    // 同じコードなので何とかする
    handlePlayerUpdated(field, value, id) {
        this.player?.updatePlayer(field);
        this.updateStatusBars();
    }

    // todo
    handlePlayerEnemyUpdated(field, value, id) {
        this.enemy?.updatePlayer(field);
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

    initPlayers(positions) {
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
    }
}
