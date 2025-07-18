export class RoundStatusUI extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maxRounds = 5) {
        super(scene, x, y);

        this.scene = scene;
        this.maxRounds = maxRounds;

        this.playerWins = 0;
        this.enemyWins = 0;

        // 左右のアイコンコンテナ
        this.leftContainer = scene.add.container(-150, 0);
        this.rightContainer = scene.add.container(150, 0);

        this.add(this.leftContainer);
        this.add(this.rightContainer);

        // 初期状態アイコン
        this._createPlaceholders(this.leftContainer, 'left');
        this._createPlaceholders(this.rightContainer, 'right');

        scene.add.existing(this);
    }

    _createPlaceholders(container, side) {
        const spacing = 25;
        const isLeft = side === 'left';

        for (let i = 0; i < this.maxRounds; i++) {
            const icon = this.scene.add.image(i * spacing * (isLeft ? 1 : -1), 0, 'winIcon');
            icon.setAlpha(0.7);
            icon.setScale(0.8);
            container.add(icon);
        }
    }

    /**
     * 勝利数を設定
     * @param {'player'|'enemy'} side
     * @param {number} count
     */
    setWinCount(side, count) {
        const container = side === 'player' ? this.leftContainer : this.rightContainer;
        const icons = container.list;

        for (let i = 0; i < this.maxRounds; i++) {
            const icon = icons[i];
            if (i < count) {
                // 勝利したアイコンにアニメーション付与
                if (icon.alpha < 1) {
                    this.scene.tweens.add({
                        targets: icon,
                        alpha: 1,
                        scale: { from: 1.4, to: 1 },
                        ease: 'Bounce.easeOut',
                        duration: 500,
                    });
                }
            } else {
                icon.setAlpha(0.2);
                icon.setScale(0.8);
            }
        }
    }
}
