export default class SkillLog {
    constructor(scene, x, y, isRight = true) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.logs = [];
        this.isRight = isRight;

        this.container = scene.add.container(this.isRight ? x + 60 : x - 60, y + 20);
    }

    showLog(text) {
        const logText = this.scene.add
            .text(0, 0, text, {
                fontSize: '16px',
                fontFamily: 'DotGothic16',
                color: '#ffff88',
                backgroundColor: '#000000aa',
                padding: { x: 6, y: 2 },
            })
            .setOrigin(this.isRight ? 0 : 1, 0); // 右か左に寄せる

        // 既存のログを上にずらす
        this.logs.forEach((log) => {
            this.scene.tweens.add({
                targets: log,
                y: log.y - 22,
                duration: 200,
                ease: 'Power2',
            });
        });

        // ログ追加
        this.container.add(logText);
        logText.setY(0);
        this.logs.push(logText);

        // 一定時間後にフェードアウト＆削除
        // this.scene.time.delayedCall(500, () => {
        //     this.scene.tweens.add({
        //         targets: logText,
        //         alpha: 0,
        //         duration: 200,
        //         onComplete: () => {
        //             this.container.remove(logText, true);
        //             this.logs = this.logs.filter((l) => l !== logText);
        //         },
        //     });
        // });
    }

    destroy() {
        this.container.destroy(true);
        this.logs = [];
    }
}
