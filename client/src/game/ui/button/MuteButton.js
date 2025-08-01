import { HideShowMixin } from './HideShowMixin';
import { ImageButton } from './ImageButton';

/**
 * 汎用的なミュートボタンクラス
 * ベースのアイコン画像の上にX画像を重ねてミュート状態を表示
 */
export class MuteButton extends HideShowMixin(ImageButton) {
    constructor(scene, x, y, baseTexture, options = {}) {
        const {
            muteTexture = 'mute_x', // X画像のテクスチャキー
            isMuted = false,
            onToggle = null,
            scale = 1.2, // アイコンのスケール
            muteScale = 1.5, // X画像のスケール
            ...buttonOptions
        } = options;

        // onClickを上書きしてトグル機能を追加
        const originalOnClick = buttonOptions.onClick;
        buttonOptions.onClick = (btn) => {
            this.toggleMute();
            if (originalOnClick) originalOnClick(btn);
        };

        super(scene, x, y, baseTexture, buttonOptions);
        
        this.baseTexture = baseTexture;
        this.muteTexture = muteTexture;
        this.isMuted = isMuted;
        this.onToggle = onToggle;
        this.scale = scale;
        this.muteScale = muteScale;
        
        // ベースアイコンのサイズを調整
        if (this.button) {
            this.button.setScale(scale);
        }
        
        // X画像を作成（初期状態では非表示）
        this.muteIcon = scene.add.image(x, y, muteTexture);
        this.muteIcon.setScale(muteScale);
        this.muteIcon.setVisible(isMuted);
        this.muteIcon.setDepth((this.button?.depth || 0) + 1); // ベースアイコンより前面に表示
        
        this.updateVisual();
    }
    
    /**
     * ミュート状態を切り替え
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVisual();
        
        if (this.onToggle) {
            this.onToggle(this.isMuted);
        }
    }
    
    /**
     * ミュート状態を設定
     * @param {boolean} muted - ミュート状態
     */
    setMuted(muted) {
        this.isMuted = muted;
        this.updateVisual();
    }
    
    /**
     * 表示を更新
     */
    updateVisual() {
        this.muteIcon.setVisible(this.isMuted);
    }
    
    
    /**
     * 位置を設定（X画像も一緒に移動）
     */
    setPosition(x, y) {
        if (this.button) {
            this.button.setPosition(x, y);
        }
        if (this.muteIcon) {
            this.muteIcon.setPosition(x, y);
        }
        return this;
    }
    
    /**
     * 深度を設定（X画像も一緒に調整）
     */
    setDepth(depth) {
        if (this.button) {
            this.button.setDepth(depth);
        }
        if (this.muteIcon) {
            this.muteIcon.setDepth(depth + 1);
        }
        return this;
    }
    
    /**
     * スケールを設定（X画像も一緒に調整）
     */
    setScale(scaleX, scaleY) {
        this.scale = scaleX;
        if (this.button) {
            this.button.setScale(scaleX * this.scale, scaleY ? scaleY * this.scale : scaleX * this.scale);
        }
        if (this.muteIcon) {
            this.muteIcon.setScale(scaleX * this.muteScale, scaleY ? scaleY * this.muteScale : scaleX * this.muteScale);
        }
        return this;
    }
    
    /**
     * 透明度を設定（X画像も一緒に調整）
     */
    setAlpha(alpha) {
        if (this.button) {
            this.button.setAlpha(alpha);
        }
        if (this.muteIcon) {
            this.muteIcon.setAlpha(alpha);
        }
        return this;
    }
    
    /**
     * 破棄処理
     */
    destroy() {
        if (this.muteIcon) {
            this.muteIcon.destroy();
            this.muteIcon = null;
        }
        if (super.destroy) {
            super.destroy();
        }
    }
}