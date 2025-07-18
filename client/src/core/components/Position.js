import { Component } from '@/core/Component.js';

export class Position extends Component {
    constructor(scene, x = 0, y = 0) {
        super();
        this.scene = scene;
        this.x = x;
        this.y = y;
    }
}
