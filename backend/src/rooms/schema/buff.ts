import { Schema, type } from '@colyseus/schema';
export class buff extends Schema {
    @type('number') muscular: number = 0; //筋肉
    @type('number') guard: number = 0; //ガード値
    @type('number') brittle: number = 0; //脆い
    @type('number') weaknes: number = 0; //弱体
    @type('number') poison: number = 0; //毒
}
