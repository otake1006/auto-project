// HideShowMixin.js
/**
 * ボタンなど GameObject を「見せる/隠す」共通機能を付与する Mixin
 * @param {class} Base 任意のクラス (ImageButton や SpriteButton など)
 */
export const HideShowMixin = (Base) => {
    return class extends Base {
        /** 表示して入力を有効化 */
        show() {
            const go = this.getGameObject();
            go.setVisible(true).setActive(true);
            if (go.input) go.input.enabled = true;
        }

        /** 非表示にして入力を無効化 */
        hide() {
            const go = this.getGameObject();
            go.setVisible(false).setActive(false);
            if (go.input) go.input.enabled = false;
        }
    };
};