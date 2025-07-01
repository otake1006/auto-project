import { Room, Client } from '@colyseus/core';
import { ArraySchema } from '@colyseus/schema';
import { MyRoomState, Player } from './schema/MyRoomState';
import { Skill, Condition } from './schema/Skill';
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
    winCount1 = 0;
    winCount2 = 0;
    drawCount = 0;
    round = 1;
    turn = 1; //ここまで新しいbattledtateを作る
    initialSkill = new ArraySchema<SkillCard>();
    player1SkillState: SkillCard[] = [];
    player2SkillState: SkillCard[] = [];
    player1RandomSkill: SkillCard[] = [];
    player2RandomSkill: SkillCard[] = [];

    // Called when the room is created
    onCreate() {
        this.initialSkill = getInitialSkill();
        //console.log(this.initialSkill.toJSON());
        this.onMessage('ready', (client, skills: any[]) => {
            if (this.gameState === 'ingame') return;
            if (this.gameState === 'endgame') return;
            console.log(skills);
            const player = this.state.players.get(client.sessionId);
            const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
            const skillSets = new ArraySchema<Skill>();
            skills.forEach((item) => {
                const skillSet = new Skill();
                skillSet.skill = item.skill;
                skillSet.conditions = new ArraySchema<Condition>(
                    ...item.conditions.map((c: any) => {
                        const condition = new Condition();
                        condition.id = c.id;
                        condition.value = c.value;
                        console.log(c);
                        return condition;
                    }),
                );
                skillSets.push(skillSet);
            });
            const skillSetId = this.extractIds(Array.from(skillSets));
            if (
                client.sessionId === sessionId1 &&
                this.extractIds(this.player1SkillState).every((item) => skillSetId.includes(item))
            ) {
                player.skill = skillSets;
                player.ready = true;
            }
            if (
                client.sessionId === sessionId2 &&
                this.extractIds(this.player2SkillState).every((item) => skillSetId.includes(item))
            ) {
                player.skill = skillSets;
                player.ready = true;
            }

            if (this.checkReady() && this.clients.length === 2) {
                console.log('戦闘開始');
                this.playTurn();
            }
        });

        this.onMessage('selectSkill', (client, id: any) => {
            const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
            if (id) {
                console.log(id);
                const getSkill = getSkillCard(id);
                console.log(getSkill.toJSON());
                if (getSkill) {
                    if (
                        client.sessionId === sessionId1 &&
                        this.player1RandomSkill.some((skill) => skill.id === id)
                    ) {
                        this.player1SkillState.push(getSkill);
                    }
                    if (
                        client.sessionId === sessionId2 &&
                        this.player2RandomSkill.some((skill) => skill.id === id)
                    ) {
                        this.player2SkillState.push(getSkill);
                    }
                }
            }
        });
    }

    // Called when a client joins the room
    onJoin(client: Client, options: any) {
        const joinPlayer = new Player();
        client.send('action', this.initialSkill);
        client.send('condition', conditionCards);
        this.state.players.set(client.sessionId, joinPlayer);
    }

    // Called when a client leaves the room
    onLeave(client: Client, options: any) {
        this.state.players.delete(client.sessionId);
    }

    // Called when the room is disposed
    onDispose() {
        console.log('ルームが削除されました');
    }

    checkReady() {
        return this.state.players.values().every((player) => player.ready);
    }
    sleep(options: number) {
        return new Promise((resolve) => setTimeout(resolve, options));
    }
    mergeSkills(schemaSkills: ArraySchema<SkillCard>, arraySkills: SkillCard[]): SkillCard[] {
        return [...schemaSkills, ...arraySkills];
    }
    extractIds(items: any[]): number[] {
        return items.map((item) => item.id);
    }

    async playTurn() {
        this.gameState = 'ingame';
        this.broadcast('turn', this.turn);
        this.broadcast('round', this.round);
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);

        while (true) {
            if (player1.hp <= 0 || player2.hp <= 0 || this.turn > 10) {
                this.turn = 1;
                if (player1.hp > 0 && player2.hp <= 0) this.winCount1 += 1;
                if (player2.hp > 0 && player1.hp <= 0) this.winCount2 += 1;
                this.round += 1;
                player1.reset();
                player2.reset();
                if (this.round >= 6) {
                    if (this.winCount1 > this.winCount2) {
                        this.winner = 'player1';
                        this.broadcast('winner', sessionId1);
                    }
                    if (this.winCount1 < this.winCount2) {
                        this.winner = 'player2';
                        this.broadcast('winner', sessionId2);
                    }
                    this.broadcast('winner', this.winner);
                    this.gameState = 'endgame';
                    this.disconnect();
                    return;
                }
                this.gameState = 'ready';
                this.broadcast('showReady');
                player1.ready = false;
                player2.ready = false;
                this.player1RandomSkill = selectRandomSkills(
                    this.mergeSkills(this.initialSkill, this.player1SkillState),
                );
                this.player2RandomSkill = selectRandomSkills(
                    this.mergeSkills(this.initialSkill, this.player2SkillState),
                );
                this.clients.forEach((client) => {
                    if (client.sessionId === sessionId1) {
                        client.send('giveCards', this.player1RandomSkill);
                    }
                    if (client.sessionId === sessionId2) {
                        client.send('giveCards', this.player2RandomSkill);
                    }
                });

                return;
            }
            const player1skill = player1.selectSkill();
            const player2skill = player2.selectSkill();
            const skill = getSkillCard(player2skill);
            if (skill.battleType === 'defense') {
                player2.useSkill(player2skill, player1);
                player1.useSkill(player1skill, player2);
            } else {
                player1.useSkill(player1skill, player2);
                player2.useSkill(player2skill, player1);
            }

            this.broadcast('skillLogs', [
                { sessionId: sessionId1, skill: getSkillCard(player1skill)?.name },
                { sessionId: sessionId2, skill: getSkillCard(player2skill)?.name },
            ]);
            if (!player1skill && !player2skill) {
                player1.resetMp();
                player2.resetMp();
                player1.resetShield();
                player2.resetShield();
                this.turn++;
                this.broadcast('turn', this.turn);
            }
            await this.sleep(500);
        }
    }
}
