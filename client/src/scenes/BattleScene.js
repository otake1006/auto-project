import Character from '@/core/Character.js';
import Skill from '@/core/Skill.js';
import GameManager from '@/core/GameManager.js';
import CharacterView from '@/core/CharacterView.js';
import { useSkillStore } from '@/stores/skillStore';
import { watch, toRaw } from 'vue';

export class BattleScene extends Phaser.Scene {
    preload() {
        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'assets/background.jpg');
    }

    create() {
        this.add.text(20, 20, 'Press SPACE to use skill');

        this.input.keyboard.on('keydown-SPACE', () => {
            this.manager.playTurn();
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
            100,
            true,
        );

        this.enemy = new Character(
            this,
            positions[1].x,
            positions[1].y,
            'player',
            'enemy',
            100,
            100,
            false,
        );

        this.playerView = new CharacterView(this, this.player, positions[0].x, positions[0].y);
        this.enemyView = new CharacterView(this, this.enemy, positions[1].x, positions[1].y);

        this.manager = new GameManager(this.player, this.enemy, this);

        this.updateSkillsets();
        this.updateStatusBars();
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
