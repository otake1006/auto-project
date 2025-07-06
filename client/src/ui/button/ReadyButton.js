// ReadyButton.js
import { ImageButton } from './ImageButton.js';
import { HideShowMixin } from './HideShowMixin.js';

/**
 * ReadyButton
 * - クリックされたら自動で hide()
 * - コンストラクタ第 4 引数 onReady コールバックを実行
 * - 外部から show()/hide() で状態制御
 */
class HideShowImageButton extends HideShowMixin(ImageButton) {}

export class ReadyButton extends HideShowImageButton {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {Function} onReady クリック後に実行されるコールバック
     * @param {object} [options] 追加オプション（画像キーや SE・Tween など）
     */
    constructor(scene, x, y, onReady, options = {}) {
        super(
            scene,
            x,
            y,
            options.defaultKey || 'ready_default', // 基本画像キー
            {
                hoverImageKey:  options.hoverImageKey  || 'ready_hover',
                downImageKey:   options.downImageKey   || 'ready_pressed',
                sounds:         options.sounds,        // { click: 'se-click' } 等
                tweens:         options.tweens,        // bounceTween など
                onClick: () => {
                    this.hide();      // 自動で非表示
                    onReady?.();      // 呼び出し元の処理を実行
                },
            },
        );

        if (options.startHidden) this.hide();
    }
}