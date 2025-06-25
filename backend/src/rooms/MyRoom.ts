import { Room, Client } from '@colyseus/core';
import { ArraySchema } from '@colyseus/schema';
import { MyRoomState, Player } from './schema/MyRoomState';
import { Skill } from './schema/Skill';
import {
    SkillCard,
    conditionCards,
    ConditionCard,
    getInitialSkill,
    getSkillCard,
    selectRandomSkills,
} from '../data/card';

export class MyRoom extends Room {
    maxClients = 2;
    name: string;
    state = new MyRoomState();
    gameState = 'ready';
    winner = 'draw'; //ここから
    winCount = 0;
    drawCount = 0;
    round = 0;
    turn = 0; //ここまで新しいbattledtateを作る
    initialSkill = new ArraySchema<SkillCard>();
    player1SkillState: SkillCard[] = [];
    player2SkillState: SkillCard[] = [];

    // Called when the room is created
    onCreate() {
        this.initialSkill = getInitialSkill();
        //console.log(this.initialSkill.toJSON());
        this.onMessage('ready', (client, skillSet: any[]) => {
            if (this.gameState === 'ingame') return;
            if (this.gameState === 'endgame') return;
            const player = this.state.players.get(client.sessionId);
            const skillSets = new ArraySchema<Skill>();

            skillSet.forEach((item) => {
                const skillSet = new Skill();
                skillSet.skill = item.skill;
                skillSet.conditions = item.conditions;
                skillSets.push(skillSet);
            });
            player.skill = skillSets;
            player.ready = true;
            if (this.checkReady() && this.clients.length === 2) {
                console.log('戦闘開始');
                this.playTurn();
            }
        });

        this.onMessage('battle', (client) => {
            for (const [a, x] of this.state.players) {
                console.log(x.skills.toJSON());
            }
        });

        this.onMessage('selectSkill', (client, id: any) => {
            const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
            if (id) {
                console.log(id);
                const getSkill = getSkillCard(id);
                console.log(getSkill.toJSON());
                if (getSkill) {
                    if (client.sessionId === sessionId1) {
                        this.player1SkillState.push(getSkill);
                    }
                    if (client.sessionId === sessionId2) {
                        this.player2SkillState.push(getSkill);
                    }
                }
            }
        });
    }

    // Called when a client joins the room
    onJoin(client: Client, options: any) {
        const joinPlayer = new Player();
        // for (const initial of this.initialSkill) {
        //     joinPlayer.skills.push(initial);
        //     console.log(initial.name);
        // }
        //joinPlayer.skills = this.initialSkill;
        //console.log(joinPlayer.skills.toJSON());
        this.broadcast('action', this.initialSkill);
        this.state.players.set(client.sessionId, joinPlayer);
    }

    // Called when a client leaves the room
    onLeave(client: Client, options: any) {
        this.state.players.delete(client.sessionId);
    }

    // Called when the room is disposed
    onDispose() {}

    checkReady() {
        return this.state.players.values().every((player) => player.ready);
    }
    sleep(options: number) {
        return new Promise((resolve) => setTimeout(resolve, options));
    }
    mergeSkills(schemaSkills: ArraySchema<SkillCard>, arraySkills: SkillCard[]): SkillCard[] {
        return [...schemaSkills, ...arraySkills];
    }

    async playTurn() {
        this.gameState = 'ingame';

        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);

        while (true) {
            if (player1.hp <= 0 || player2.hp <= 0) {
                if (player1.hp <= 0 && player2.hp <= 0) this.drawCount += 1;
                if (player1.hp > 0 && player2.hp <= 0) this.winCount += 1;
                this.round += 1;
                player1.reset();
                player2.reset();
                if (this.round === 5) {
                    if (this.winCount > this.round - this.winCount - this.drawCount) {
                        this.winner = 'player1';
                    }
                    if (this.winCount < this.round - this.winCount - this.drawCount) {
                        this.winner = 'player2';
                    }
                    this.gameState = 'endgame';
                    return;
                }
                this.gameState = 'ready';
                this.broadcast('showReady');
                player1.ready = false;
                player2.ready = false;
                const player1RandomSkill = selectRandomSkills(
                    this.mergeSkills(this.initialSkill, this.player1SkillState),
                );
                const player2RandomSkill = selectRandomSkills(
                    this.mergeSkills(this.initialSkill, this.player2SkillState),
                );
                this.clients.forEach((client) => {
                    if (client.sessionId === sessionId1) {
                        client.send('giveCards', player1RandomSkill);
                    }
                    if (client.sessionId === sessionId2) {
                        client.send('giveCards', player2RandomSkill);
                    }
                });

                return;
            }
            const player1skill = player1.selectSkill();
            const player2skill = player2.selectSkill();
            player1.useSkill(player1skill, player2);
            player2.useSkill(player2skill, player1);
            this.broadcast('skillLogs', [
                { sessionId: sessionId1, skill: getSkillCard(player1skill)?.name },
                { sessionId: sessionId2, skill: getSkillCard(player2skill)?.name },
            ]);
            if (!player1skill && !player2skill) {
                player1.resetMp();
                player2.resetMp();
                this.turn++;
            }
            await this.sleep(500);
        }
    }
}

// async playTurn() {
//         if (this.gameState === 'ingame') return;
//         if (this.gameState === 'endgame') return;
//         this.gameState = 'ingame';

//         this.scene.updateSkillsets();

//         while (true) {
//             if (this.player.hp.current <= 0 || this.enemy.hp.current <= 0) {
//                 if (this.enemy.hp.current <= 0 && this.player.hp.current > 0) this.winCount += 1;
//                 this.round += 1;
//                 this.player.hp.reset();
//                 this.enemy.hp.reset();
//                 this.player.mp.reset();
//                 this.enemy.mp.reset();
//                 if (this.round === 5) {
//                     if (this.winCount >= this.round - this.winCount) this.winner = 'player';
//                     if (this.winCount <= this.round - this.winCount) this.winner = 'enemy';
//                     this.gameState = 'endgame';
//                     return;
//                 }
//                 this.scene.onTurnEnd();
//                 await this.sleep(500);
//             }
//             const playerskill = this.player.selectSkill();
//             const enemyskill = this.enemy.selectSkill();
//             const { x: enemyX, y: enemyY } = this.scene.enemyView.getPosition();
//             const { x: playerX, y: playerY } = this.scene.playerView.getPosition();

//             this.player.useSkill(playerskill, this.enemy);
//             this.enemy.useSkill(enemyskill, this.player);
//             showDamage(this.scene, enemyX, enemyY, playerskill?.damage);
//             showDamage(this.scene, playerX, playerY, enemyskill?.damage);
//             console.log(playerskill, enemyskill);
//             console.log(enemyX, enemyY, playerX, playerY);
//             if (!playerskill && !enemyskill) {
//                 this.player.mp.reset();
//                 this.enemy.mp.reset();
//             }
//             this.turn++;
//             this.scene.onTurnEnd();
//             await this.sleep(500);
//         }
//     }
