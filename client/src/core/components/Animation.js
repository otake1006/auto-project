import { Component } from '@/core/Component.js';

export class Animation extends Component {
    constructor(initialKey = 'idle') {
        super();
        this.key = initialKey; // 再生したいアニメーション名
        this._playing = null; // 現在スプライトに再生中のアニメ
    }
}
