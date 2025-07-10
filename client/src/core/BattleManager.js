// BattleManager.js
import { AnimationQueue } from './AnimationQueue.js';
import { CastEffectAnimation } from './animations/CastEffectAnimation.js';

export class BattleManager {
    constructor(scene, player, enemy) {
        this.scene = scene;
        this.player = player;
        this.enemy = enemy;
        this.turnCount = 0;
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

        const queue = new AnimationQueue();

        if (!isEnemy) {
            queue.add(
                new CastEffectAnimation(
                    this.scene,
                    this.enemy.getPosition().x - 80,
                    this.enemy.getPosition().y + 20,
                    'cast_effect',
                    'cast_anim',
                ),
            );
        } else {
            queue.add(
                new CastEffectAnimation(
                    this.scene,
                    this.player.getPosition().x + 80,
                    this.player.getPosition().y + 20,
                    'cast_effect',
                    'cast_anim',
                ),
            );
        }

        // 再生
        await queue.playAll();

        // 次のターン処理へ（自動またはユーザー入力待ち）
        // e.g. this.scene.events.emit('turn:end');
    }
}
