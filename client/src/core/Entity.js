let nextId = 0;

export class Entity {
    constructor() {
        this.id = nextId++;
        this._components = new Map(); // key: コンポーネントのクラス, value: インスタンス
    }

    add(component) {
        this._components.set(component.constructor, component);
        component.onAdd?.(this);
        return this;
    }
    remove(ComponentClass) {
        const c = this._components.get(ComponentClass);
        c?.onRemove?.();
        this._components.delete(ComponentClass);
        return this;
    }
    get(ComponentClass) {
        return this._components.get(ComponentClass);
    }
    has(ComponentClass) {
        return this._components.has(ComponentClass);
    }
}
