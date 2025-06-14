import { showDamage } from '@/effects/DamageText.js';
import { playSound } from '@/utils/soundHelper';

export default class GameManager {
    constructor(player, enemy, scene) {
        this.player = player;
        this.enemy = enemy;
        this.scene = scene;
        this.turn = 0;
    }

    playTurn() {
        this.scene.updateSkillsets();

        const attacker = this.turn % 2 === 0 ? this.player : this.enemy;
        const defender = this.turn % 2 === 0 ? this.enemy : this.player;
        const skill = attacker.selectSkill();

        if (skill) {
            playSound(this.scene, 'sfx_attack');

            const view = attacker === this.player ? this.scene.enemyView : this.scene.playerView;
            const { x, y } = view.getPosition();

            attacker.useSkill(skill, defender);
            showDamage(this.scene, x, y, skill.damage);

            console.log(`${attacker.name} used ${skill.name} on ${defender.name}`);
        } else {
            console.log(`${attacker.name} has no MP! Skipped turn.`);
        }

        if (!defender.isAlive()) {
            this.scene.onTurnEnd();
            this.scene.onGameOver(attacker.name);
            return;
        }

        this.turn++;
        this.scene.onTurnEnd();
    }
}
