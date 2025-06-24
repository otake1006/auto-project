import { showDamage } from '@/effects/DamageText.js';
import { playSound } from '@/utils/soundHelper';

export default class GameManager {
    constructor(player, enemy, scene) {
        this.player = player;
        this.enemy = enemy;
        this.scene = scene;
        this.winCount = 0;
        this.winner = 'draw';
        this.turn = 0;
        this.round = 0;
        this.gameState = 'waiting';
    }

    async playTurn() {
        if (this.gameState === 'ingame') return;
        if (this.gameState === 'endgame') return;
        this.gameState = 'ingame';

        this.scene.updateSkillsets();

        while (true) {
            if (this.player.hp.current <= 0 || this.enemy.hp.current <= 0) {
                if (this.enemy.hp.current <= 0 && this.player.hp.current > 0) this.winCount += 1;
                this.round += 1;
                this.player.hp.reset();
                this.enemy.hp.reset();
                this.player.mp.reset();
                this.enemy.mp.reset();
                if (this.round === 5) {
                    if (this.winCount >= this.round - this.winCount) this.winner = 'player';
                    if (this.winCount <= this.round - this.winCount) this.winner = 'enemy';
                    this.gameState = 'endgame';
                    return;
                }
                this.scene.onTurnEnd();
                await this.sleep(500);
            }
            const playerskill = this.player.selectSkill();
            const enemyskill = this.enemy.selectSkill();
            const { x: enemyX, y: enemyY } = this.scene.enemyView.getPosition();
            const { x: playerX, y: playerY } = this.scene.playerView.getPosition();

            this.player.useSkill(playerskill, this.enemy);
            this.enemy.useSkill(enemyskill, this.player);
            showDamage(this.scene, enemyX, enemyY, playerskill?.damage);
            showDamage(this.scene, playerX, playerY, enemyskill?.damage);
            console.log(playerskill, enemyskill);
            console.log(enemyX, enemyY, playerX, playerY);
            if (!playerskill && !enemyskill) {
                this.player.mp.reset();
                this.enemy.mp.reset();
            }
            this.turn++;
            this.scene.onTurnEnd();
            await this.sleep(500);
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
