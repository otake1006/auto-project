import Phaser from 'phaser';

export class AssetLoader extends Phaser.Plugins.BasePlugin {
    /** assets.json を読んでロード */
    async loadManifest(scene, manifestUrl) {
        const manifest = await fetch(manifestUrl).then((r) => r.json());

        manifest.images?.forEach(({ key, url }) => scene.load.image(key, url));
        manifest.spritesheets?.forEach(({ key, url, frameWidth, frameHeight }) =>
            scene.load.spritesheet(key, url, { frameWidth, frameHeight }),
        );
        manifest.audio?.forEach(({ key, urls }) => scene.load.audio(key, urls));

        manifest.audioSprites?.forEach(({ key, textureURL, jsonURL }) =>
            scene.load.audioSprite(key, textureURL, jsonURL),
        );

        return new Promise((res) => {
            scene.load.once(Phaser.Loader.Events.COMPLETE, () => res());
            scene.load.start();
        });
    }

    /** animations/*.json をまとめて登録 */
    async loadAnims(scene, animDir = 'assets/anims') {
        const list = await (await fetch(`${animDir}/index.json`)).json(); // ← index.json にファイル一覧を書き出す想定
        for (const file of list) {
            const defs = await fetch(`${animDir}/${file}`).then((r) => r.json());
            defs.forEach((def) => this._createAnim(scene, def));
        }
    }

    _createAnim(scene, def) {
        const { key, sheet, type, numbers, names, frameRate, repeat } = def;
        let frames;
        if (type === 'sheetNumbers') frames = scene.anims.generateFrameNumbers(sheet, numbers);
        else if (type === 'sheetNames') frames = scene.anims.generateFrameNames(sheet, names);

        scene.anims.create({ key, frames, frameRate, repeat });
    }
}
