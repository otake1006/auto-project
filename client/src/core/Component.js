export class Component {
    /** エンティティに取り付けられた直後に呼ばれます */
    onAdd(entity) {
        this.entity = entity;
    }
    /** 取り外し時に必要ならクリーンアップ */
    onRemove() {}
}
