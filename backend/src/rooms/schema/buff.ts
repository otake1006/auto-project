import { Schema, type } from '@colyseus/schema';
export class buff extends Schema {
    @type('number') muscular: number = 0; //筋肉
    @type('number') guard: number = 0; //ガード値
    @type('boolean') brittle: boolean = false; //脆い
    @type('boolean') Weak: boolean = false; //弱体
    @type('number') poison: number = 0; //毒
}
