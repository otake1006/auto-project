import { bgmMap } from '@/core/sounds/bgmMap';
import { networkManager } from '../../core/NetworkManager';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        const { width, height } = this.cameras.main;

        this.add.sprite(0, 0, 'load').setOrigin(0).play('loading');

        Object.values(bgmMap).forEach(({ key, file }) => {
            this.load.audio(key, `assets/sounds/${file}`);
        });
    }

    async create() {
        const loader = this.plugins.get('AssetLoader');

        await loader.loadManifest(this, 'assets/data/assets.json');
        await loader.loadAnims(this);

        try {
            this.scene.start('StartScene');
        } catch (err) {
            console.error('Colyseus connect error:', err);
            this.add.text(20, 20, 'サーバ接続に失敗しました', { color: '#ff4444' });
        }
    }
}
