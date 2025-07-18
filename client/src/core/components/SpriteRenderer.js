import { Component } from '@/core/Component.js';

export class SpriteRenderer extends Component {
    constructor(scene, textureKey) {
        super();
        this.scene = scene;
        this.textureKey = textureKey;
        this.sprite = null;
    }

    onAdd(entity) {
        super.onAdd(entity);
        this.sprite = this.scene.add.sprite(0, 0, this.textureKey);
    }

    onRemove() {
        this.sprite?.destroy();
    }
}
