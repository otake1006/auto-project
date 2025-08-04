# 👨‍💻 AUTA - フロントエンド担当ポートフォリオ

> リアルタイム対戦型ゲームのUI/UX全般を主導。演出・状態同期・操作性を融合した体験をVue + Phaserで構築。

## 🎮 プロジェクト概要

- 2人対戦のリアルタイム戦略ゲーム（Webベース）
- **Vue.js + Phaser.js + Colyseus** を用いて開発
- 主に以下のフロントエンド領域を担当：

| 担当領域           | 内容                                                     |
| ------------------ | -------------------------------------------------------- |
| UI設計             | デッキ構築・スキル選択・ターゲット指定UIの設計と実装     |
| 状態管理           | Piniaによる状態同期と再描画制御                          |
| アニメ・SE制御     | 演出制御の抽象化・汎用ボタン部品の設計                   |
| データ駆動アセット | JSON定義による画像・音声・アニメーション読み込みの自動化 |

---

## 🎮 制作背景・モチベーション

本プロジェクトは、**リアルタイム通信・UI演出・状態管理**など、フロントエンドを中心とした幅広い技術を横断的に学べる題材として、対戦型のWebゲームを選定しました。  
特にゲームは、**ユーザー体験を意識した設計・演出が求められる**ため、技術習得に加えて実践的な設計力・表現力の向上にもつながると考えました。

また、**Unityなどの既成ゲームエンジンには頼らず、Vue.jsとPhaser.jsを用いてゼロからゲームシステムを構築**しています。  
これは、「用意された仕組みに依存せず、実装を通じて本質的な技術理解を深めたい」という目的からです。

ゲームエンジンを使わないことで、**リアルタイム通信・状態同期・UI描画の各レイヤーをフレームワークレベルで自ら設計・統合**する必要があり、抽象化や責務分離といった設計面での実践的な学びを得ることができました。

---

## ✨ 技術的工夫・設計思想

### 疎結合設計

機能ごとに責務を明確化し、状態管理（Pinia）、UIコンポーネント、ゲームロジック（Phaser）を分離。たとえば、状態更新ロジックを外部のStoreに集約することで、同一機能のコード重複を削減し、修正コストを最小化しました。

### UIボタンの部品化・カスタマイズ設計

ゲーム内で繰り返し利用するボタンUIをPhaser + JavaScriptで部品化し、以下のような
**再利用可能なUIコンポーネント（ImageButton）** を設計しました

#### 設計のポイント

| 項目                 | 内容                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------- |
| コンポーネント基盤   | `UIButtonBase` を継承した `ImageButton` クラス                                            |
| 視覚演出の柔軟性     | `hoverImageKey`, `downImageKey`, `tweens`, `sounds` などのオプションで演出を動的に制御    |
| イベントハンドリング | `onHover`, `onClick`, `onOut` をPropsとして受け取り、ゲーム固有ロジックとUIロジックを分離 |
| 汎用的制御Mixin      | `HideShowMixin` により `show()` / `hide()` の表示制御を共通化                             |

<details> <summary>📦 使用コード例（Readyボタン）</summary>

```js
this.readyButton = new ReadyButton(
    this,
    this.centerX,
    this.centerY + 30,
    () => {
        phaserEvents.emit('ready');
    },
    {
        defaultKey: 'ready-button',
        hoverImageKey: 'ready-button',
        downImageKey: 'ready-button',
        sounds: { click: 'click.mp3' },
        tweens: [bounceTween],
    },
);
```

</details><details> <summary>🧠 カスタムButtonの構造概要（ImageButton）</summary>

```js
export class ImageButton extends UIButtonBase {
    _setup() {
        this.button = this.scene.add.image(this.x, this.y, this.key);
        this.applyInteractive({
            onHover: (btn) => {
                if (this.options.hoverImageKey) btn.setTexture(this.options.hoverImageKey);
                this.options.onHover?.(btn);
            },
            onOut: (btn) => {
                btn.setTexture(this.key);
                this.options.onOut?.(btn);
            },
            onClick: (btn) => {
                if (this.options.downImageKey) btn.setTexture(this.options.downImageKey);
                this.options.onClick?.(btn);
            },
        });
        if (this.options.tweens) this.applyTweens();
    }
}
```

</details><details><summary>⚙️ 共通表示制御Mixin（HideShowMixin）</summary>

```js
export const HideShowMixin = (Base) => {
    return class extends Base {
        show() {
            const go = this.getGameObject();
            go.setVisible(true).setActive(true);
            if (go.input) go.input.enabled = true;
        }

        hide() {
            const go = this.getGameObject();
            go.setVisible(false).setActive(false);
            if (go.input) go.input.enabled = false;
        }
    };
};
```

</details>

### データ駆動によるアセット管理

アセット定義をすべて JSON に集約し、開発者以外でも拡張・変更が可能な仕組みを構築しました。画像・音声・アニメーション定義をプログラムから切り離すことで、以下のメリットを実現：

- 新規アセット追加時にコード改修不要
- デザイナーなど非エンジニアでも差し替え作業が可能
- アニメーション定義も JSON によってデータ化し、一貫性ある登録処理を実装

<details> <summary>🧠 AssetLoader クラス（JSONを元に動的ロード）</summary>

```js
export class AssetLoader extends Phaser.Plugins.BasePlugin {
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

    async loadAnims(scene, animDir = 'assets/anims') {
        const list = await (await fetch(`${animDir}/index.json`)).json();
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
```

</details> <details> <summary>🗂 アセット定義ファイル（例: data.json）</summary>

```json
{
    "images": [
        { "key": "background", "url": "assets/images/battleback.png" },
        { "key": "ready-button", "url": "assets/images/ready-button.png" },
        { "key": "check-icon", "url": "assets/images/check-icon.png" }
    ],
    "spritesheets": [
        {
            "key": "player",
            "url": "assets/sheets/player.png",
            "frameWidth": 69,
            "frameHeight": 44
        }
    ],
    "audio": [{ "key": "bgm_battle", "urls": "assets/sounds/Future_1.mp3" }],
    "version": 1720690000000
}
```

</details>

---

## 🧠 苦労した点と乗り越えたこと

### 1. フロント演出とバックエンドの同期

**課題**：ColyseusのSchemaによりHPなどの状態が即時反映される一方で、演出（攻撃アニメーションなど）とのタイミングがずれてしまい、ユーザーにとって不自然な表示になる問題が発生。

**解決策**：

- **アニメーション処理をキューに登録**し、1つずつ再生・完了後に次へ進むよう制御
- サーバー側の状態とは別に、クライアント側で**「演出完了フラグ」**を持ち、演出終了後に状態同期を進めるフローを構築
- 後付け実装だったため、既存のロジックを整理しながら**演出と状態更新の責務を明確に分離**

**結果**：

- 表示と実際の状態が一致するようになり、ユーザー体験の違和感が解消
- コード構成の見直しにより、保守性・再利用性の高い演出処理が実現

### 2. ボタン演出の部品化と多様な要件の吸収

「レディーボタンは一度だけ表示」「ミュートボタンはトグルでアイコン変更」など、ボタンごとに異なる要件があり、共通化が難航しました。

**対応策**として、共通演出を抽象クラスにまとめ、用途ごとの派生クラスでUIロジックをオーバーライド。VueコンポーネントとPhaserオブジェクトの橋渡しとして設計することで、各ボタンの実装工数を削減しました。

### 3. クラスの汎用化・抽象化の難しさ

再利用性を高めるため、状態管理クラスやアニメーション管理クラスなどを抽象化し、汎用的に使えるよう工夫しました。

**工夫点**は、共通部分と個別要件を明確に分離し、継承ではなくコンポジション（合成）を一部で活用したこと。これにより依存を減らし、複数シーンでの共通動作を実現しました。

---

## 🎓 得られた学びと気づき

- **技術選定は仮説であり、途中で見直す柔軟さが必要**だと実感しました。  
  当初はVueだけで演出まで完結できると考えていましたが、複雑なアニメーション制御を実装する過程で、Phaser.jsの導入が必要と判断。  
  手段に固執せず、目的に応じて技術を選ぶ重要性を学びました。

- **先を見越した設計が、保守性とチーム内の理解促進につながる**ことを体感しました。  
   状態管理やUI設計をあらかじめ分離・整理し、繰り返し使うUI要素を部品化することで構造を明確にしました。
  これにより、他のメンバーがコード全体を把握するための理解コストが下がり、設計の意図が伝わりやすくなったため、実装スピードの向上にもつながりました。

- **リモート開発では、設計意図や変更背景を「言語化」して共有することが必須**だと感じました。  
   対面での空気感に頼れない分、設計コメントの記述やGitのPRレビューの活用を通じて、意図や背景をできるだけ明文化するように努めました。
  また、Discordでの画面共有やMiroを用いた図解コミュニケーションなど、ツールを活かした可視化にも取り組み、伝え方の精度と相互理解の速度を高める工夫を行いました。

- **将来的な拡張を見据えて「人が管理しやすい仕組み」を考える楽しさ**を知りました。  
   将来的な拡張やチーム内の調整を見据えて、「人が管理しやすい設計とは何か」を意識するようになりました。
  特にスプレッドシート連携を想定したアセット管理では、非エンジニアでも簡単に調整できる構造を取り入れ、チーム全体の作業効率向上にもつながることを実感しました。
  単に動くものを作るだけでなく、「誰が、どう使うか」まで考える視点が身につきました。

- **コードが増えるほど、構造や命名、責務分離が開発効率に直結する**と実感しました。  
  ディレクトリ構成やクラスの責務を整理しきれなかった箇所では、後から自分でも読み解くのに時間がかかることがあり、構成力の重要性を痛感しました。

-

## 📁 関連リンク

- 🔗 [プロジェクト全体のREADMEへ](../README.md)
- 📹 [ゲーム紹介動画（準備中）](#)

---

## 🙋‍♂️ 自己紹介

| 項目   | 内容                                   |
| ------ | -------------------------------------- |
| 名前   | えい（大学生 / ITエンジニア志望）      |
| GitHub | [@Elic0de](https://github.com/Elic0de) |

---

> 開発では通信・UI・演出が密接に絡む仕様を扱う中で、構造的に考える力と再利用性を意識した実装力を培いました。
> 今後もユーザーに寄り添った体験設計を追求し、技術で価値を届けられる開発者を目指して取り組んでいきます。
