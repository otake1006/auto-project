import { MyRoom } from '../rooms/Room';
import { Client } from 'colyseus';
import { MyRoomState } from '../rooms/schema/MyRoomState';
import { Skill, Condition } from '../rooms/schema/Skill';
import { ArraySchema } from '@colyseus/schema';
import { GameConfig } from '../config/game';
import { GameLogic } from '../services/GameLogic';
import { SkillCard, getSkillCard } from '../data/skill';
import { conditionCards } from '../data/condition';
import { RelicCards, getRelicCard } from '../data/Relics';

export class ActionHandler {
    private state: MyRoomState;
    private room: MyRoom;
    private gameLogic: GameLogic;

    constructor(room: MyRoom) {
        this.room = room;
        this.state = room.state;
        this.gameLogic = new GameLogic(this.room);
    }

    public handleReady(client: Client, payload: any) {
        const player = this.state.players.get(client.sessionId);
        console.log(player.buffs.toJSON(), 'はじめ');
        if (this.state.gameState === 'ingame') return;
        if (this.state.gameState === 'endgame') return;
        const skillSets = this.skillsToArraySchema(payload);
        const skillSetId = this.extractIds([...skillSets]);
        if (this.checkSkill(skillSetId, client)) {
            player.skill = skillSets;
            player.ready = true;
        }
        console.log(player.buffs.toJSON());
        if (this.checkReady() && this.state.players.size === GameConfig.MAX_CLIENTS) {
            console.log('戦闘開始');
            this.gameLogic.playTurn();
        }
    }

    public handleRequestPlayer() {
        // for (const [sessionId, player] of this.state.players) {
        //     player.delete();
        //     player.reset();
        // }
        this.room.broadcast('condition', conditionCards);
        this.room.broadcast('action', this.state.initialSkill);
    }

    public handleSelectSkill(client: Client, payload: any) {
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        if (payload) {
            //console.log(id);
            const getSkill = getSkillCard(payload);
            //console.log(getSkill.toJSON());
            if (getSkill) {
                if (
                    client.sessionId === sessionId1 &&
                    this.state.player1RandomSkill.some((skill) => skill.id === payload)
                ) {
                    this.state.player1SkillState.push(getSkill);
                }
                if (
                    client.sessionId === sessionId2 &&
                    this.state.player2RandomSkill.some((skill) => skill.id === payload)
                ) {
                    this.state.player2SkillState.push(getSkill);
                }
            }
        }
    }

    public handleSetPlayerName(client: Client, payload: { name: string }) {
        const player = this.state.players.get(client.sessionId);
        if (player && payload.name) {
            player.name = payload.name.trim();
            console.log(`Player ${client.sessionId} name set to: ${player.name}`);

            // クライアントにプレイヤー名の更新を通知
            this.room.broadcast('playerName', {
                sessionId: client.sessionId,
                name: player.name,
            });
        }
    }

    public handleSelectRelic(client: Client, payload: any) {
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        if (payload) {
            //console.log(id);
            const getRelic = getRelicCard(payload);
            //console.log(getSkill.toJSON());
            if (getRelic) {
                if (
                    client.sessionId === sessionId1 &&
                    this.state.player1RandomRelic.some((skill) => skill.id === payload)
                ) {
                    player1.relics.push(getRelic);
                }
                if (
                    client.sessionId === sessionId2 &&
                    this.state.player2RandomRelic.some((skill) => skill.id === payload)
                ) {
                    player2.relics.push(getRelic);
                }
            }
        }
    }

    public skillsToArraySchema(payload: any[]): ArraySchema<Skill> {
        const skillSets = new ArraySchema<Skill>();
        payload.forEach((item: any) => {
            const skillSet = new Skill();
            skillSet.skill = item.skill;
            skillSet.conditions = new ArraySchema<Condition>(
                ...item.conditions.map((c: any) => {
                    const condition = new Condition();
                    condition.id = c.id;
                    condition.value = c.value;
                    return condition;
                }),
            );
            skillSets.push(skillSet);
        });
        return skillSets;
    }

    public pushSelectSkill(sessionId: string) {}
    checkReady() {
        return this.state.players.values().every((player) => player.ready);
    }
    mergeSkills(schemaSkills: ArraySchema<SkillCard>, arraySkills: SkillCard[]): SkillCard[] {
        return [...schemaSkills, ...arraySkills];
    }
    extractIds(items: any[]): number[] {
        return items.map((item) => item.skill ?? item.id);
    }
    checkSkill(skillSetId: number[], client: Client) {
        const [[sessionId1, player1]] = Array.from(this.state.players);

        if (
            skillSetId.every((item) =>
                this.extractIds(
                    this.mergeSkills(
                        this.state.initialSkill,
                        client.sessionId === sessionId1
                            ? this.state.player1SkillState
                            : this.state.player2SkillState,
                    ),
                ).includes(item),
            )
        ) {
            return true;
        }
        return false;
    }
}
