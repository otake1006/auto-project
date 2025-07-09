// components/NameTag.js
import { Component } from '@/core/Component.js';

export class NameTag extends Component {
    constructor(name, { offsetY = -40, fontSize = 14 } = {}) {
        super();
        this.name = name;
        this.offsetY = offsetY;
        this.fontSize = fontSize;
        this.textObj = null; // Phaser.Text を保持
    }
}
