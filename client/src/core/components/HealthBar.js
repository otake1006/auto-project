// components/HealthBar.js
import { Component } from '@/core/Component.js';

export class HealthBar extends Component {
    constructor(width = 50, height = 6, { offsetY = -20, bg = 0x222222, fg = 0x22ee22 } = {}) {
        super();
        this.maxWidth = width;
        this.height = height;
        this.offsetY = offsetY;
        this.bgColor = bg;
        this.fgColor = fg;

        this.bgRect = null; // Phaser.GameObjects.Rectangle
        this.fgRect = null;
    }
}
