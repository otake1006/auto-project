import { MyRoom } from '../rooms/Room';
import { MyRoomState } from '../rooms/schema/MyRoomState';
import { ArraySchema } from '@colyseus/schema';
import { SkillService } from '../services/SkillService';
import { SkillCard, selectRandomSkills } from '../data/skill';
import { GameConfig } from '../config/game';
import { selectRandomRelics } from '../data/Relics';

export class GameLogic {
    private state: MyRoomState;
    private room: MyRoom;
    private skillService: SkillService;

    constructor(room: MyRoom) {
        this.room = room;
        this.state = room.state;
        this.skillService = new SkillService(this.room);
    }

    async playTurn() {
        this.state.gameState = 'ingame';
        this.room.broadcast('turn', this.state.turn);
        this.room.broadcast('round', this.state.round);

        //ラウンド開始時のレリック発動
        this.skillService.PermanentEffectAll(GameConfig.ROUND_START);

        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        console.log(player1.buffs.toJSON());
        console.log(player2.buffs.toJSON());
        while (true) {
            if (player1.hp <= 0 || player2.hp <= 0 || this.state.turn > 10) {
                this.checkEndGame();
                return;
            }
            console.log('処理');
            await this.sleep(300);
            this.skillService.useAllSkill();
            await this.sleep(500);
        }
    }

    public checkEndGame() {
        const winner = '';
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        this.state.turn = 1;
        if (player1.hp > 0 && player2.hp <= 0) {
            this.state.winCount1 += 1;
            this.state.roundLoser = sessionId2;
        }
        if (player2.hp > 0 && player1.hp <= 0) {
            this.state.winCount2 += 1;
            this.state.roundLoser = sessionId1;
        }
        this.state.round += 1;
        player1.reset();
        player2.reset();
        player1.buffs.reset();
        player2.buffs.reset();
        if (this.state.round >= 6) {
            this.room.broadcast('winner', this.checkWinner());
            this.state.gameState = 'endgame';
            this.room.disconnect();
            return;
        }

        //ラウンド終了時のレリック発動
        this.skillService.PermanentEffectAll(GameConfig.ROUND_END);

        this.state.gameState = 'ready';
        this.room.broadcast('showReady');
        player1.ready = false;
        player2.ready = false;
        this.randomSkills();
        this.randomRelics(this.state.roundLoser);
        this.state.roundLoser = 'draw';
    }

    public checkWinner() {
        if (this.state.winCount1 > this.state.winCount2) {
            this.state.winner = 'player1';
            return this.state.winner;
        }
        if (this.state.winCount1 < this.state.winCount2) {
            this.state.winner = 'player2';
            return this.state.winner;
        }
    }

    public randomSkills() {
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        this.state.player1RandomSkill = selectRandomSkills(
            this.mergeSkills(this.state.initialSkill, this.state.player1SkillState),
        );
        this.state.player2RandomSkill = selectRandomSkills(
            this.mergeSkills(this.state.initialSkill, this.state.player2SkillState),
        );
        this.room.clients.forEach((client) => {
            if (client.sessionId === sessionId1) {
                client.send('giveCards', this.state.player1RandomSkill);
            }
            if (client.sessionId === sessionId2) {
                client.send('giveCards', this.state.player2RandomSkill);
            }
        });
    }

    public randomRelics(loser: string) {
        if (loser === 'draw') {
            const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
            this.room.clients.forEach((client) => {
                if (client.sessionId === sessionId1) {
                    this.state.player1RandomRelic = selectRandomRelics(player1.relics);
                    client.send('giveRelics', this.state.player1RandomRelic);
                }
                if (client.sessionId === sessionId2) {
                    this.state.player2RandomRelic = selectRandomRelics(player2.relics);
                    client.send('giveRelics', this.state.player2RandomRelic);
                }
            });
        } else {
            const player = this.state.players.get(loser);
            this.room.clients.getById(loser).send('giveRelics', selectRandomRelics(player.relics));
        }
    }

    public mergeSkills(
        schemaSkills: ArraySchema<SkillCard>,
        arraySkills: SkillCard[],
    ): SkillCard[] {
        return [...schemaSkills, ...arraySkills];
    }
    public sleep(options: number) {
        return new Promise((resolve) => setTimeout(resolve, options));
    }
}
