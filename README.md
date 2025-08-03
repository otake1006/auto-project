# 🎮 AU-TA

<img width="720" alt="image" src="https://github.com/user-attachments/assets/766d8327-d6f8-4cf2-b27b-c44c143fd8cc" />

---

## 📌 概要 / Overview

このプロジェクトは Vue.js / Phaser / Colyseus を用いて開発した、1vs1のリアルタイム対戦型カードバトルゲームです。
プレイヤーはスキルカード・条件カードを組み合わせて独自の戦略を構築し、ターン制の戦いを通じて勝利を目指します。

---

## 🚀 デモ / Demo

- 💻 [オンラインで遊べるURL](https://auto-project-1.onrender.com/)

---

## 🔗 個人ポートフォリオ

このプロジェクトは2人で開発しました。  
各メンバーの技術的な工夫・貢献内容は以下のリンクからご覧いただけます。

- 👨‍🎨 [Elic0deのフロントエンドREADME](./docs/readme_elic0de.md)
- 🧠 [otake1006のバックエンドREADME](./docs/readme_otake.md)

---

## 👥 チームメンバー

| 名前      | 担当領域                             | GitHub                                     |
| --------- | ------------------------------------ | ------------------------------------------ |
| Elicode   | フロントエンド（UI/UX・演出）        | [@Elic0de](https://github.com/Elic0de)     |
| otake1006 | バックエンド（通信・ゲームロジック） | [@otake1006](https://github.com/otake1006) |

## 🛠️ 技術スタック / Tech Stack

| 技術   | 採用理由                       |
| ------ | ------------------------------ |
| Vue 3  | 柔軟なUI設計と再利用性の高さ   |
| Pinia  | 状態の一元管理と再現性の高いUI |
| Phaser | 表現力の高い2Dアニメーション   |

---

## 🔍 詳細解説

<details>
<summary>Vue 3 の技術的な工夫・選定理由</summary>

- Composition API による責務分離
- `useXxx()` composable 化でロジックを整理
- Phaserとの同期を `nextTick` で制御

📚 [Vue 3 Docs](https://vuejs.org/guide/introduction.html)

</details>

<details>
<summary>Pinia の技術的な工夫・選定理由</summary>

- 状態の責務ごとにStoreを分離
- watchEffect + socket イベントで状態同期
- グローバル状態に依存せずテストしやすい設計

📚 [Pinia Docs](https://pinia.vuejs.org/introduction.html)

</details>
| 技術       | 用途               |
| ---------- | ------------------ |
| Vue.js     | UI構築             |
| Phaser     | ゲームエンジン     |
| Colyseus   | マルチプレイ通信   |
| Pinia      | 状態管理           |
| TypeScript | 型安全・保守性向上 |

## 🔍 開発で工夫した点 / Key Points

- ### 🎯 責務分離と保守性
    - ゲームロジック、描画、エフェクト演出を**独立したクラス構成**で管理
    - 例：`Character.ts`・`EffectManager.ts`・`BattleSystem.ts` など

- ### 🎲 拡張可能なゲーム設計
    - スキル・バフ・レリックなどを**データ駆動で実装**（JSON or データベース）
    - 「〇〇の条件で□□が発動」のような複雑な挙動を**汎用的に記述可能**

- ### 🌐 マルチプレイ対応
    - Colyseusを使ってリアルタイム同期
    - 再接続・観戦・セッション管理にも対応

## 🗂️ ディレクトリ構成 / Project Structure

```bash
├── src/
│   ├── core/              # ゲームのロジック層
│   ├── components/        # Vueコンポーネント
│   ├── stores/            # 状態管理 (Pinia)
│   ├── scenes/            # Phaserのシーン管理
│   └── assets/            # 画像や音声
├── server/                # Colyseusサーバー
└── README.md              # このファイル
```
