// core/ui/StatusIndicator.js
export class StatusIndicator {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {number} x - 中央X座標
     * @param {number} y - 中央Y座標
     */
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.entries = [];
        this.offsetY = 0;
    }

    /**
     * ステータスを表示し、チェックマークをあとで追加可能にする
     * @param {string} message
     * @returns {Phaser.GameObjects.Image} - チェックマーク用
     */
    addStatus(message) {
        const text = this.scene.add
            .text(this.x, this.y + this.offsetY, message, {
                fontSize: '20px',
                color: '#fff',
            })
            .setOrigin(0.5);

        // テキストの幅を取得してチェックアイコンの位置を計算
        const textWidth = text.width;
        const check = this.scene.add
            .image(this.x + textWidth / 2 + 20, this.y + this.offsetY, 'check-icon')
            .setOrigin(0.5)
            .setScale(0.5)
            .setVisible(false);

        this.entries.push({ text, check });
        this.offsetY += 32;
        return check;
    }

    /**
     * チェックマークを表示
     * @param {number} index
     */
    markDone(index) {
        const entry = this.entries[index];
        if (entry) {
            entry.check.setVisible(true);
        }
    }

    /**
     * 失敗などに差し替えたい場合（オプション）
     */
    markFailed(index) {
        const entry = this.entries[index];
        if (entry) {
            entry.check.setTexture('cross-icon').setVisible(true); // 別のアイコンに差し替え
        }
    }
}
