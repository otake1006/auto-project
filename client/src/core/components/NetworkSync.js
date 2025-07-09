import { Component } from '@/core/Component.js';

export class NetworkSync extends Component {
    /**
     * @param {string} netId  サーバが振ったエンティティID
     * @param {'server'|'local'} authority  真実がどちらにあるか
     */
    constructor(netId, authority = 'server') {
        super();
        this.netId = netId;
        this.authority = authority;
        this._dirty = false; // ローカル変更フラグ
    }
}
