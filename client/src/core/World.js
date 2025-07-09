export class World {
    constructor() {
        this.entities = [];
        this.systems = [];
    }
    addEntity(entity) {
        this.entities.push(entity);
        return this;
    }
    removeEntity(entity) {
        this.entities = this.entities.filter((e) => e !== entity);
    }
    addSystem(system) {
        system.world = this;
        this.systems.push(system);
        return this;
    }

    /** ゲームループから呼び出し */
    update(dt) {
        for (const sys of this.systems) {
            const targets = this.entities.filter((e) => sys.filter(e));
            sys.update(dt, targets);
        }
    }
}
