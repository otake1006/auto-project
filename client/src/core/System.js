export class System {
    /** @returns true を返すエンティティだけ update に渡される */
    filter(entity) {
        return false;
    }
    /** @param {number} dt deltaTime(ms) */
    update(dt, entities) {}

    destory() {}
}
