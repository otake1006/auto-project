export class BuffDisplay extends Phaser.GameObjects.Container {
    constructor(scene, x, y, isRight = false) {
        super(scene, x, y);

        this.scene = scene;
        this.isRight = isRight;
        this.buffItems = {};
        this.maxBuffsPerRow = 10; // 横に最大10個まで表示（一行のみ）
        this.buffSize = 32;
        this.buffSpacing = 32; // 一行表示用に間隔を狭く
        this.textOffset = 12;

        // バフアイコンのマッピング（assets/imagesのPNGファイルを使用）
        this.buffIconMap = {
            muscular: 'fc290', // 攻撃力アップ
            guard: 'fc2151', // 防御力アップ (shield)
            speed: 'fc1026', // 速度アップ
            heal: 'fc1107', // 回復効果
            poison: 'fc868', // 毒
            fire: 'fc1025', // 炎上
            ice: 'fc1098', // 氷結
            lightning: 'fc729', // 雷
            magic: 'fc5', // 魔法強化
            critical: 'fc2114', // クリティカル
            shield: 'fc2151', // シールド
            brittle: 'fc1699', // 再生
            poison: 'fc836', // 呪い
            blessing: 'fc998', // 祝福
            weaknes: 'fc783', // ステルス
        };

        scene.add.existing(this);
    }

    updateBuffs(buffs) {
        if (!buffs || typeof buffs !== 'object') {
            this.clearAllBuffs();
            return;
        }

        // 現在のバフをクリア
        this.clearAllBuffs();

        // 新しいバフを表示
        const buffEntries = Object.entries(buffs);
        let displayIndex = 0;

        buffEntries.forEach(([buffName, buffValue]) => {
            if (buffValue && buffValue !== 0) {
                this.createBuffItem(buffName, buffValue, displayIndex);
                displayIndex++;
            }
        });
    }

    createBuffItem(buffName, value, index) {
        // 一行のみ表示、maxBuffsPerRowを超えたバフは表示しない
        if (index >= this.maxBuffsPerRow) {
            return;
        }

        // ステータスバーの下に横一列で表示（プレイヤーを中心に左右に密着して広がる）
        const isLeft = index % 2 === 0; // 偶数番目は左側
        const position = Math.floor(index / 2); // 中心からの順番
        const offsetX = isLeft
            ? -(position + 0.5) * this.buffSpacing
            : (position + 0.5) * this.buffSpacing;
        const offsetY = 115; // より下の位置に配置

        const itemContainer = this.scene.add.container(offsetX, offsetY);

        // バフアイコン（画像スプライト、背景円なし）
        const iconKey = this.buffIconMap[buffName] || 'fc5'; // デフォルトアイコン
        const icon = this.scene.add.image(0, -6, iconKey);
        icon.setDisplaySize(24, 24); // アイコンサイズを少し大きく
        icon.setOrigin(0.5);

        // バフの数値表示
        const valueText = this.scene.add.text(0, this.textOffset, this.formatBuffValue(value), {
            fontSize: '16px',
            fontFamily: 'DotGothic16',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center',
        });
        valueText.setOrigin(0.5);

        itemContainer.add([icon, valueText]);

        // バフアイテムをコンテナに追加
        this.add(itemContainer);
        this.buffItems[buffName] = itemContainer;

        // 登場アニメーション
        itemContainer.setScale(0);
        this.scene.tweens.add({
            targets: itemContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            delay: index * 50,
        });

        // バフの種類によって特別なエフェクト（アイコンに適用）
        this.addBuffEffects(buffName, icon);
    }

    addBuffEffects(buffName, icon) {
        switch (buffName) {
            case 'power':
            case 'critical':
                // 攻撃系バフは軽い色調変化のみ
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xffcccc },
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'heal':
            case 'regen':
                // 回復系バフは緑の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xccffcc },
                    duration: 2500,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'fire':
                // 炎バフはオレンジの軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xffddaa },
                    duration: 1500,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'ice':
                // 氷バフは青の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xccddff },
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'lightning':
                // 雷バフは黄色の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xffffcc },
                    duration: 1200,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'magic':
                // 魔法バフは紫の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xffccff },
                    duration: 2200,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'poison':
            case 'curse':
                // デバフ系は軽い透明度変化のみ
                this.scene.tweens.add({
                    targets: icon,
                    alpha: { from: 1, to: 0.7 },
                    duration: 2500,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'speed':
                // 速度バフは緑の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xccffdd },
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'blessing':
            case 'shield':
                // 防御/祝福系は金の軽い色調変化
                this.scene.tweens.add({
                    targets: icon,
                    tint: { from: 0xffffff, to: 0xfffadd },
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            case 'stealth':
                // ステルスは軽い透明度変化
                this.scene.tweens.add({
                    targets: icon,
                    alpha: { from: 1, to: 0.8 },
                    duration: 2000,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });
                break;

            default:
                // その他のバフはアニメーションなし
                break;
        }
    }

    formatBuffValue(value) {
        if (typeof value === 'number') {
            return `${value}`;
        }
        return String(value);
    }

    clearAllBuffs() {
        Object.values(this.buffItems).forEach((item) => {
            if (item && item.destroy) {
                item.destroy();
            }
        });
        this.buffItems = {};
        this.removeAll(true);
    }

    // バフが追加された時のエフェクト
    onBuffAdded(buffName) {
        if (this.buffItems[buffName]) {
            const item = this.buffItems[buffName];

            // 新しいバフ追加エフェクト
            this.scene.tweens.add({
                targets: item,
                scaleX: { from: 1, to: 1.3, to: 1 },
                scaleY: { from: 1, to: 1.3, to: 1 },
                duration: 400,
                ease: 'Bounce.easeOut',
            });

            // パーティクル風エフェクト
            this.createBuffParticles(item.x, item.y, 0xffffff);
        }
    }

    // バフが削除された時のエフェクト
    onBuffRemoved(buffName) {
        if (this.buffItems[buffName]) {
            const item = this.buffItems[buffName];

            this.scene.tweens.add({
                targets: item,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 300,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    if (item && item.destroy) {
                        item.destroy();
                    }
                    delete this.buffItems[buffName];
                },
            });
        }
    }

    createBuffParticles(x, y, color) {
        // 簡単なパーティクルエフェクト
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(
                this.x + x + Phaser.Math.Between(-10, 10),
                this.y + y + Phaser.Math.Between(-10, 10),
                2,
                color,
            );

            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                y: particle.y - 20,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy(),
            });
        }
    }

    destroy() {
        this.clearAllBuffs();
        super.destroy();
    }
}
