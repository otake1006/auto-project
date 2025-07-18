import { Component } from '@/core/Component.js';

export class Health extends Component {
    constructor(max) {
        super();
        this.max = max;
        this.current = max;
    }
    damage(v) {
        this.current = Math.max(0, this.current - v);
    }
    heal(v) {
        this.current = Math.min(this.max, this.current + v);
    }
}
