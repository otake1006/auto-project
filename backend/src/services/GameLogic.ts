import { MyRoom } from '../rooms/Room';
import { MyRoomState } from '../rooms/schema/MyRoomState2';
import { ArraySchema } from '@colyseus/schema';
import { SkillService } from '../services/SkillService';
import { SkillCard, selectRandomSkills } from '../data/skill';

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
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        while (true) {
            if (player1.hp <= 0 || player2.hp <= 0 || this.state.turn > 10) {
                this.checkEndGame();
                return;
            }
            this.skillService.useAllSkill();
            await this.sleep(500);
        }
    }

    public checkEndGame() {
        const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);
        this.state.turn = 1;
        if (player1.hp > 0 && player2.hp <= 0) this.state.winCount1 += 1;
        if (player2.hp > 0 && player1.hp <= 0) this.state.winCount2 += 1;
        this.state.round += 1;
        player1.reset();
        player2.reset();
        if (this.state.round >= 6) {
            this.room.broadcast('winner', this.checkWinner());
            this.state.gameState = 'endgame';
            this.room.disconnect();
            return;
        }
        this.state.gameState = 'ready';
        this.room.broadcast('showReady');
        player1.ready = false;
        player2.ready = false;
        this.randomSkills();
        return;
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

//     async playTurn() {
//         this.gameState = 'ingame';
//         this.broadcast('turn', this.turn);
//         this.broadcast('round', this.round);
//         const [[sessionId1, player1], [sessionId2, player2]] = Array.from(this.state.players);

//         while (true) {
//             if (player1.hp <= 0 || player2.hp <= 0 || this.turn > 10) {
//                 this.turn = 1;
//                 if (player1.hp > 0 && player2.hp <= 0) this.winCount1 += 1;
//                 if (player2.hp > 0 && player1.hp <= 0) this.winCount2 += 1;
//                 this.round += 1;
//                 player1.reset();
//                 player2.reset();
//                 if (this.round >= 6) {
//                     if (this.winCount1 > this.winCount2) {
//                         this.winner = 'player1';
//                     }
//                     if (this.winCount1 < this.winCount2) {
//                         this.winner = 'player2';
//                     }
//                     this.broadcast('winner', this.winner);
//                     this.gameState = 'endgame';
//                     this.disconnect();
//                     return;
//                 }
//                 this.gameState = 'ready';
//                 this.broadcast('showReady');
//                 player1.ready = false;
//                 player2.ready = false;
//                 this.player1RandomSkill = selectRandomSkills(
//                     this.mergeSkills(this.initialSkill, this.player1SkillState),
//                 );
//                 this.player2RandomSkill = selectRandomSkills(
//                     this.mergeSkills(this.initialSkill, this.player2SkillState),
//                 );
//                 this.clients.forEach((client) => {
//                     if (client.sessionId === sessionId1) {
//                         client.send('giveCards', this.player1RandomSkill);
//                     }
//                     if (client.sessionId === sessionId2) {
//                         client.send('giveCards', this.player2RandomSkill);
//                     }
//                 });

//                 return;
//             }
//             const player1skill = player1.selectSkill();
//             const player2skill = player2.selectSkill();
//             const skill = getSkillCard(player2skill);
//             if (skill.battleType === 'defense') {
//                 player2.useSkill(player2skill, player1);
//                 player1.useSkill(player1skill, player2);
//             } else {
//                 player1.useSkill(player1skill, player2);
//                 player2.useSkill(player2skill, player1);
//             }

//             this.broadcast('skillLogs', [
//                 { sessionId: sessionId1, skill: getSkillCard(player1skill)?.name },
//                 { sessionId: sessionId2, skill: getSkillCard(player2skill)?.name },
//             ]);
//             if (!player1skill && !player2skill) {
//                 player1.resetMp();
//                 player2.resetMp();
//                 player1.resetShield();
//                 player2.resetShield();
//                 this.turn++;
//                 this.broadcast('turn', this.turn);
//             }
//             await this.sleep(500);
//         }
//     }
// }
