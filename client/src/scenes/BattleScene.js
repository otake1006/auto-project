// BattleScene.js
import Character from '@/core/Character.js';
import CharacterView from '@/core/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';
import { ColyseusClient } from '@/colyseus/client';
import { phaserEvents, Event } from '@/events/EventCenter';

import { ReadyButton } from '@/ui/ReadyButton';
import { EffectManager } from '@/core/EffectManager.js';
import { RoundStatusUI } from '@/ui/RoundStatus.js';
import { WipeAppearDisappearText } from '@/effects/WipeAppearDisappearText.js';
import { TurnIndicator } from '@/effects/TurnIndicator';

const PLAYER_CONFIG = {
    hp: 100,
    mp: 50,
    spriteKey: 'player',
};

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.colyseus = new ColyseusClient();
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.colyseus.join();
        this.initLayout();
        this.createPlayers();
        this.setupUI();
        this.setupNetworkHandlers();
    }

    loadAssets() {
        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'assets/background.jpg');
        this.load.image('winIcon', 'assets/3302.png');
        this.load.image('shield', 'fc2151.png');
    }

    initLayout() {
        this.cameras.main.setBackgroundColor('#000');
        this.add
            .image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY - 10;
        this.positions = [
            { x: this.centerX - 300, y: this.centerY },
            { x: this.centerX + 300, y: this.centerY },
        ];
    }

    setupUI() {
        this.readyButton = new ReadyButton(this, this.centerX, this.centerY + 30, () => {
            this.sendSkillSet();
            this.readyButton.hide();
        });

        this.effectManager = new EffectManager(this);
        new WipeAppearDisappearText(this, this.centerX, this.centerY, 'Round 1!', {
            textStyle: {
                fontSize: '36px',
                fontFamily: 'Arial',
                color: '#ffcc00',
            },
            bgColor: 0x333333,
        });
        this.turnIndicator = new TurnIndicator(this);
        this.turnIndicator.showTurn(2);
        // UIの将来的な拡張用
        // this.roundUI = new RoundStatusUI(this, this.centerX, 20);
    }

    createPlayers() {
        this.player = this.createCharacter(this.positions[0], true, 'player');
        this.enemy = this.createCharacter(this.positions[1], false, 'enemy');

        this.playerView = new CharacterView(
            this,
            this.player,
            this.positions[0].x,
            this.positions[0].y,
        );
        this.enemyView = new CharacterView(
            this,
            this.enemy,
            this.positions[1].x,
            this.positions[1].y,
            true,
        );
    }

    createCharacter(position, isPlayer, id) {
        return new Character(
            this,
            position.x,
            position.y,
            PLAYER_CONFIG.spriteKey,
            id,
            PLAYER_CONFIG.hp,
            PLAYER_CONFIG.mp,
            isPlayer,
        );
    }

    setupNetworkHandlers() {
        this.colyseus.onPlayerUpdated(
            this.handlePlayerUpdate.bind(this, this.player, this.playerView),
        );
        this.colyseus.onEnemyUpdated(
            this.handlePlayerUpdate.bind(this, this.enemy, this.enemyView),
        );
        this.colyseus.onSkillLog(this.handleSkillLog, this);
        this.colyseus.onShowReady(() => this.handleShowReady());
    }

    handlePlayerUpdate(character, view, field) {
        console.log(field);
        character.updatePlayer(field);
        view.setReady(field.ready);
        view.updateBars();
    }

    handleSkillLog(isEnemy) {
        if (!isEnemy) return;
        const logText = `Used ${isEnemy.skill}`;
        console.log(`Skill log: ${logText}`);
        const view = isEnemy.isEnemy ? this.enemyView : this.playerView;
        view.showSkillLog(logText);
    }

    handleShowReady() {
        this.readyButton.show();
    }

    sendSkillSet() {
        const skillStore = useSkillStore();
        const payload = skillStore.skillSets
            .filter((set) => set.skill)
            .map((set) => ({
                skill: set.skill.id,
                conditions: set.conditions.map((c) => c.id),
            }));

        this.colyseus.sendSkillSet(payload);
    }

    onGameOver(winner) {
        this.add.text(this.centerX, this.centerY, `${winner} wins!`, {
            fontSize: '32px',
            color: '#ff0000',
        });
    }
}
