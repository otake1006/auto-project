// BattleManager.js
import { AnimationQueue } from './AnimationQueue.js';
import { CastEffectAnimation } from './animations/CastEffectAnimation.js';

export class BattleManager {
    constructor(scene, player, enemy) {
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;
        this.turnCount = 0;
        this.isAnimationPlaying = false;
    }

    async handleSkillLog(skillData) {
        const targetView = skillData.isEnemy
            ? this.playerManager.enemyView
            : this.playerManager.playerView;
        targetView.showSkillLog(`${skillData.skill} を使った！`);
        await startTurn(skillData.isEnemy);
    }

    async startTurn(isEnemy) {
        this.turnCount++;
        this.isAnimationPlaying = true;

        const queue = new AnimationQueue();

        if (!isEnemy) {
            // プレイヤーから敵への波動攻撃
            const playerPos = this.player.getPosition();
            const enemyPos = this.enemy.getPosition();

            queue.add(
                new CastEffectAnimation(
                    this.scene,
                    playerPos.x + 60, // 発射位置（プレイヤーの少し前）
                    playerPos.y - 10, // 発射位置（プレイヤーの少し上）
                    enemyPos.x - 40, // 着弾位置（敵の手前）
                    enemyPos.y + 10, // 着弾位置（敵の中央）
                    'cast_effect',
                    'cast_anim',
                    {
                        speed: 1500,
                        waveType: 'energy',
                        impactEffect: true,
                        damage: Math.floor(Math.random() * 50) + 25, // 25-74のランダムダメージ
                    },
                ),
            );
        } else {
            // 敵からプレイヤーへの波動攻撃
            const playerPos = this.player.getPosition();
            const enemyPos = this.enemy.getPosition();

            queue.add(
                new CastEffectAnimation(
                    this.scene,
                    enemyPos.x - 60, // 発射位置（敵の少し前）
                    enemyPos.y - 10, // 発射位置（敵の少し上）
                    playerPos.x + 40, // 着弾位置（プレイヤーの手前）
                    playerPos.y + 10, // 着弾位置（プレイヤーの中央）
                    'cast_effect',
                    'cast_anim',
                    {
                        speed: 1500,
                        waveType: 'dark',
                        impactEffect: true,
                        damage: Math.floor(Math.random() * 40) + 30, // 30-69のランダムダメージ
                    },
                ),
            );
        }

        // 再生
        await queue.playAll();

        // アニメーション完了フラグ更新
        this.isAnimationPlaying = false;

        // 演出完了イベントを発火
        this.scene.events.emit('animation:complete', { isEnemy, turnCount: this.turnCount });

        // 次のターン処理へ（自動またはユーザー入力待ち）
        // e.g. this.scene.events.emit('turn:end');
    }
}
