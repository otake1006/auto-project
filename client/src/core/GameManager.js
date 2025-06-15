import { showDamage } from '@/effects/DamageText.js';
import { playSound } from '@/utils/soundHelper';

export default class GameManager {
    constructor(player, enemy, scene) {
        this.player = player;
        this.enemy = enemy;
        this.scene = scene;
        this.turn = 0;
        this.round = 0;
        this.gameState = 'waiting';
    }

    async playTurn() {
        this.gameState = 'ingame';

        this.scene.updateSkillsets();

        while (true) {
            if (this.player.hp.current <= 0 || this.enemy.hp.current <= 0) {
            }
            const playerskill = this.player.selectSkill();
            const enemyskill = this.enemy.selectSkill();
            const { x: enemyX, y: enemyY } = this.scene.enemyView.getPosition();
            const { x: playerX, y: playerY } = this.scene.playerView.getPosition();

            this.player.useSkill(playerskill, this.enemy);
            this.enemy.useSkill(enemyskill, this.player);
            showDamage(this.scene, enemyX, enemyY, playerskill?.damage);
            showDamage(this.scene, playerX, playerY, enemyskill?.damage);
            await this.sleep(500);
            console.log(playerskill, enemyskill);
            console.log(enemyX, enemyY, playerX, playerY);
            if (!playerskill && !enemyskill) {
                this.player.mp.reset();
                this.enemy.mp.reset();
            }
            this.scene.onTurnEnd();
        }

        // if (skill) {
        //     playSound(this.scene, 'sfx_attack');

        //     const view = attacker === this.player ? this.scene.enemyView : this.scene.playerView;
        //     const { x, y } = view.getPosition();

        //     attacker.useSkill(skill, defender);
        //     showDamage(this.scene, x, y, skill.damage);

        //     console.log(`${attacker.name} used ${skill.name} on ${defender.name}`);
        // } else {
        //     console.log(`${attacker.name} has no MP! Skipped turn.`);
        // }

        // if (!defender.isAlive()) {
        //     this.scene.onTurnEnd();
        //     this.scene.onGameOver(attacker.name);
        //     return;
        // }

        // this.turn++;
        // this.scene.onTurnEnd();
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// async function battleStart() {
//     if (battlemode.value === 'battleNow') {
//         return;
//     }
//     if (battlemode.value === 'battleEnd') {
//         return;
//     }
//     battlemode.value = 'battleNow';
//     while (true) {
//         if (player.hp <= 0 || monster.hp <= 0) {
//             const winner = getWinner();
//             if (winner != null) {
//                 winner.win += 1;
//             }
//             round.value += 1;
//             resetHp('player');
//             resetHp('monster');
//             resetMp('player');
//             resetMp('monster');
//             console.log(turn.value);
//             console.log(round.value);
//             console.log(player.win);
//             console.log(monster.win);
//             if (round.value === 5) {
//                 if (player.win > monster.win) {
//                     battleWinner.value = 'player';
//                 } else {
//                     battleWinner.value = 'monster';
//                 }
//                 battlemode.value = 'battleEnd';
//                 console.log(battleWinner.value);
//                 //↓ここに終了関数を入れる
//                 return;
//             }
//             break;
//         }

//         const playerEnergy = skill.itemList[0][0].energy;
//         const monsterEnergy = enemySkills[0][0].energy;
//         const playerDamage = skill.itemList[0][0].damage;
//         const monsterDamege = enemySkills[0][0].damage;
//         if (player.mp >= playerEnergy || monster.mp >= monsterEnergy) {
//             if (player.mp >= playerEnergy) {
//                 consumMp('player', playerEnergy);
//                 attack('monster', playerDamage);
//             }
//             if (monster.mp >= monsterEnergy) {
//                 consumMp('monster', monsterEnergy);
//                 attack('player', monsterDamege);
//             }
//             await sleep(500);
//         } else {
//             turn.value += 1;
//             resetMp('player');
//             resetMp('monster');
//         }
//     }
//     battlemode.value = 'battleready';
//     // skillmove:for(const activeSkill of skill.itemList){
//     //         while(player.mp >= activeSkill[0].energy){
//     //           consumMp('player', activeSkill[0].energy)
//     //           for(count = 0;count < activeSkill[0].attackCount; count++){
//     //             if(player.hp <= 0 || monster.hp <= 0){
//     //               break skillmove
//     //             }
//     //             attack('monster', activeSkill[0].damage)
//     //           }
//     //         }
//     //     }
// }
