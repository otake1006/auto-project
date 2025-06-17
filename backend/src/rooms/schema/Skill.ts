import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
export class Condition extends Schema {
    @type('string') type: string;
    @type('number') value: number;
}
export class Skill extends Schema {
    @type('number') skill: number;
    @type(['number']) conditions = new ArraySchema<number>();
}
