import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
import { Skill } from './Skill';
import { buff } from './buff';
import { GameConfig } from '../../confug/game';
import { SkillCard } from '../../data/card';

export class Player extends Schema {
    @type('string') name: string = 'player';
    @type('number') hp: number = 0;
    @type('number') mp: number = 0;
    @type('number') shield: number = 0;
    @type('number') maxhp: number = GameConfig.PLAYER_MAX_HP;
    @type('number') maxmp: number = GameConfig.PLAYER_MAX_MP;
    @type('number') maxshield: number = GameConfig.PLAYER_MAX_SHIELD;
    @type('number') ratiohp: number = GameConfig.PLAYER_RATIO_HP;
    @type('number') ratiomp: number = GameConfig.PLAYER_RATIO_MP;
    @type('boolean') ready: boolean = false;
    @type([Skill]) skill = new ArraySchema<Skill>();
    @type(buff) buffs = new buff();
    reset() {
        this.hp = this.maxhp;
        this.mp = this.maxmp;
        this.shield = 0;
    }
    delete() {
        this.hp = 0;
        this.mp = 0;
        this.shield = 0;
    }

    resetMp() {
        this.mp = this.maxmp;
    }

    resetShield() {
        this.shield = 0;
    }
}
export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type('string') gameState: string = 'waiting';
    @type('string') winner: string = 'draw';
    @type('number') winCount1: number = 0;
    @type('number') winCount2: number = 0;
    @type('number') drawCount: number = 0;
    @type('number') round: number = 1;
    @type('number') turn: number = 1;
    @type([SkillCard]) initialSkill = new ArraySchema<SkillCard>();
    @type([SkillCard]) player1SkillState: SkillCard[] = [];
    @type([SkillCard]) player2SkillState: SkillCard[] = [];
    @type([SkillCard]) player1RandomSkill: SkillCard[] = [];
    @type([SkillCard]) player2RandomSkill: SkillCard[] = [];
}
