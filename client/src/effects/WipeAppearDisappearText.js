export class WipeAppearDisappearText extends Phaser.GameObjects.Container {
    constructor(
        scene,
        x,
        y,
        text,
        {
            textStyle = {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
            },
            bgColor = 0x000000,
            padding = 20,
            appearDuration = 100,
            holdDuration = 800,
            disappearDuration = 100,
        } = {},
    ) {
        super(scene, x, y);
        this.scene = scene;

        // --- テキスト ---
        const textObj = scene.add
            .text(0, 0, text, {
                fontSize: '18px',
                fontFamily: 'DotGothic16',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
            })
            .setOrigin(0.5);

        // --- 背景 ---
        const boxWidth = textObj.width + padding;
        const boxHeight = textObj.height + padding;
        const bg = scene.add.rectangle(0, 0, boxWidth, boxHeight, bgColor, 0.85).setOrigin(0.5);

        // --- コンテナに追加してシーンに配置 ---
        this.add([bg, textObj]);
        scene.add.existing(this);

        // --- マスク矩形（左→右に表示、右→左に非表示） ---
        const maskRect = scene.add
            .rectangle(x - boxWidth / 2, y, boxWidth, boxHeight, bgColor)
            .setOrigin(0, 0.5)
            .setVisible(false);
        const mask = maskRect.createGeometryMask();
        this.setMask(mask);

        // 初期状態：非表示（scaleX: 0）
        maskRect.scaleX = 0;

        // --- 表示アニメーション（左→右） ---
        scene.tweens.add({
            targets: maskRect,
            scaleX: 1,
            duration: appearDuration,
            ease: 'Linear',
            onComplete: () => {
                // --- 一定時間保持 ---
                scene.time.delayedCall(holdDuration, () => {
                    // マスク原点を右に変更 → 右→左に縮小
                    maskRect.setOrigin(1, 0.5);
                    maskRect.x = x + boxWidth / 2;

                    // --- 非表示アニメーション（右→左） ---
                    scene.tweens.add({
                        targets: maskRect,
                        scaleX: 0,
                        duration: disappearDuration,
                        ease: 'Linear',
                        onComplete: () => {
                            this.destroy();
                            maskRect.destroy();
                        },
                    });
                });
            },
        });
    }
}
