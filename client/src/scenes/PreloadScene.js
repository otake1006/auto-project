import { bgmMap } from '@/core/sounds/bgmMap';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const { width, height } = this.cameras.main;

        this.add.sprite(0, 0, 'load').setOrigin(0).play('loading');

        // ローディングバー
        // const progressBox = this.add.graphics();
        // const progressBar = this.add.graphics();
        // progressBox.fillStyle(0x222222, 0.8);
        // progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // this.load.on('progress', (value) => {
        //     progressBar.clear();
        //     progressBar.fillStyle(0xffffff, 1);
        //     progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        // });

        this.load.on('complete', () => {
            // progressBox.destroy();
            // progressBar.destroy();

            // プレイヤー歩行アニメーション
            this.anims.create({
                key: 'player_walk',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 6,
                repeat: -1,
            });

            // キャストエフェクト
            this.anims.create({
                key: 'cast_effect',
                frames: this.anims.generateFrameNumbers('cast_effect', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: 0,
            });

            this.anims.create({
                key: 'loop',
                frames: this.anims.generateFrameNumbers('result'),
                frameRate: 8, // フレーム速度
                repeat: -1, // ループ
            });

            this.anims.create({
                key: 'match',
                frames: this.anims.generateFrameNumbers('matching'),
                frameRate: 8, // フレーム速度
                repeat: -1, // ループ
            });

            this.scene.start('StartScene');
        });

        Object.values(bgmMap).forEach(({ key, file }) => {
            this.load.audio(key, `assets/sounds/${file}`);
        });

        this.load.spritesheet('player', 'assets/Slime_Blue.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('matching', 'matching.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });
        this.load.audio('sfx_attack', 'assets/sfx/attack.mp3');
        this.load.image('background', 'battleback.png');
        this.load.image('winIcon', 'assets/3302.png');
        this.load.image('shield', 'fc2151.png');
        this.load.spritesheet('cast_effect', '674.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet('cast_air', 'Air_Burst.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.audio('bgm_battle', 'Future_1.mp3');

        this.load.spritesheet('result', 'result2.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });

        this.load.spritesheet('bgAnim', 'UntitledArtwork2.png', {
            frameWidth: 1440,
            frameHeight: 810,
        });
        this.load.image('button_bg', 'batlestartbottan.png');
    }

    create() {}
}
