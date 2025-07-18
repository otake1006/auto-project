export default class SkillLog {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {boolean} isRight  trueなら右側、falseなら左側に表示
     * @param {number} maxLogs 最大ログ件数（デフォルト5）
     */
    constructor(scene, x, y, isRight = true, maxLogs = 5) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.isRight = isRight;
        this.maxLogs = maxLogs;

        this.logs = [];

        this.container = scene.add.container(this.isRight ? x + 60 : x - 60, y + 20);
    }

    /**
     * ログを表示する
     * @param {string} text 表示するテキスト
     * @param {'skill' | 'damage' | 'heal'} type ログのタイプ
     */
    showLog(text, type = 'skill') {
        const style = this.getStyleByType(type);

        const logText = this.scene.add
            .text(0, 0, text, {
                fontSize: '14px',
                fontFamily: 'DotGothic16',
                color: style.color,
                backgroundColor: style.background,
                padding: { x: 6, y: 2 },
            })
            .setOrigin(this.isRight ? 0 : 1, 0);

        // ログを上にずらす
        this.logs.forEach((log) => {
            this.scene.tweens.add({
                targets: log,
                y: log.y - 22,
                duration: 200,
                ease: 'Power2',
            });
        });

        // コンテナに追加
        this.container.add(logText);
        logText.setY(0);
        this.logs.push(logText);

        // 最大件数を超えたら古いログを削除
        if (this.logs.length > this.maxLogs) {
            const oldest = this.logs.shift();
            this.scene.tweens.add({
                targets: oldest,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.container.remove(oldest, true);
                },
            });
        }

        // 一定時間後にフェードアウトして削除
        this.scene.time.delayedCall(3000, () => {
            if (!logText.active) return; // すでに消えてたら無視
            this.scene.tweens.add({
                targets: logText,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.container.remove(logText, true);
                    this.logs = this.logs.filter((l) => l !== logText);
                },
            });
        });
    }

    /**
     * ログの種類によってスタイルを決定
     */
    getStyleByType(type) {
        switch (type) {
            case 'damage':
                return { color: '#ff4444', background: '#000000aa' }; // 赤
            case 'heal':
                return { color: '#44ff44', background: '#000000aa' }; // 緑
            case 'skill':
            default:
                return { color: '#ffff88', background: '#000000aa' }; // 黄色
        }
    }

    destroy() {
        this.container.destroy(true);
        this.logs = [];
    }
}
