import { AnimationBase } from '../AnimationBase.js';
import { showDamage } from '../effects/DamageText.js';

export class CastEffectAnimation extends AnimationBase {
    constructor(scene, sourceX, sourceY, targetX, targetY, textureKey, animKey, options = {}) {
        super(scene);
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.textureKey = textureKey;
        this.animKey = animKey;

        // 波動エフェクトオプション
        this.options = {
            speed: options.speed || 300, // 波動の移動速度
            waveType: options.waveType || 'energy', // 'energy', 'magic', 'fire', 'ice'
            particleCount: options.particleCount || 20,
            trailLength: options.trailLength || 8,
            impactEffect: options.impactEffect !== false,
            damage: options.damage || 0, // ダメージ値
            ...options,
        };
    }

    async play() {
        return new Promise((resolve) => {
            this.createWaveProjectile(resolve);
        });
    }

    createWaveProjectile(resolve) {
        // 波動の軌道計算
        const distance = Phaser.Math.Distance.Between(
            this.sourceX,
            this.sourceY,
            this.targetX,
            this.targetY,
        );
        const duration = (distance / this.options.speed) * 1000;
        console.log(duration);

        // 波動発射音（遅延なし）
        this.playLaunchSound();

        // メイン波動エフェクト
        const waveSprite = this.scene.add.sprite(this.sourceX, this.sourceY, this.textureKey);
        waveSprite.play(this.animKey);
        waveSprite.setScale(0.8);

        // 波動の軌道設定（少し曲線を描く）
        const midX = (this.sourceX + this.targetX) / 2;
        const midY = (this.sourceY + this.targetY) / 2 - 30; // 少し上に弧を描く

        // パーティクルトレイル
        this.createParticleTrail(waveSprite);

        // 波動の移動トゥイーン
        this.scene.tweens.add({
            targets: waveSprite,
            x: [
                { value: midX, duration: duration * 0.4 },
                { value: this.targetX, duration: duration * 0.6 },
            ],
            y: [
                { value: midY, duration: duration * 0.4 },
                { value: this.targetY, duration: duration * 0.6 },
            ],
            scaleX: [
                { value: 1.2, duration: duration * 0.3 },
                { value: 0.9, duration: duration * 0.7 },
            ],
            scaleY: [
                { value: 1.2, duration: duration * 0.3 },
                { value: 0.9, duration: duration * 0.7 },
            ],
            ease: 'Power2',
            duration: duration,
            onComplete: () => {
                // 着弾エフェクト
                if (this.options.impactEffect) {
                    this.createImpactEffect();
                }

                // 波動スプライトを削除
                waveSprite.destroy();
                resolve();
            },
        });

        // 波動の回転エフェクト
        this.scene.tweens.add({
            targets: waveSprite,
            rotation: Math.PI * 2,
            duration: duration,
            ease: 'Linear',
        });

        // 波動の発光エフェクト
        this.createGlowEffect(waveSprite, duration);
    }

    createParticleTrail(waveSprite) {
        // パーティクルエミッター作成
        const particles = this.scene.add.particles(0, 0, this.textureKey, {
            follow: waveSprite,
            quantity: 2,
            scale: { start: 0.3, end: 0.1 },
            alpha: { start: 0.8, end: 0.1 },
            speed: { min: 20, max: 50 },
            lifespan: 300,
            blendMode: 'ADD',
            tint: this.getWaveColor(),
        });

        // 波動が消える時にパーティクルも停止
        this.scene.time.delayedCall(1000, () => {
            particles.destroy();
        });
    }

    createGlowEffect(waveSprite, duration) {
        // 発光エフェクト用の背景スプライト
        const glowSprite = this.scene.add.sprite(waveSprite.x, waveSprite.y, this.textureKey);
        glowSprite.setTint(this.getWaveColor());
        glowSprite.setAlpha(0.4);
        glowSprite.setScale(1.5);
        glowSprite.setBlendMode(Phaser.BlendModes.ADD);

        // 発光の位置同期
        this.scene.tweens.add({
            targets: glowSprite,
            x: waveSprite.x,
            y: waveSprite.y,
            duration: duration,
            ease: 'Power2',
            onUpdate: () => {
                glowSprite.x = waveSprite.x;
                glowSprite.y = waveSprite.y;
            },
            onComplete: () => {
                glowSprite.destroy();
            },
        });

        // 発光の脈動エフェクト
        this.scene.tweens.add({
            targets: glowSprite,
            scaleX: { from: 1.2, to: 1.8 },
            scaleY: { from: 1.2, to: 1.8 },
            alpha: { from: 0.6, to: 0.2 },
            duration: 200,
            yoyo: true,
            repeat: Math.floor(duration / 400),
        });
    }

    createImpactEffect() {
        // 着弾音
        this.playImpactSound();

        // 着弾時の爆発エフェクト
        const impactSprite = this.scene.add.sprite(this.targetX, this.targetY, this.textureKey);
        impactSprite.setScale(0.5);

        // 爆発アニメーション
        this.scene.tweens.add({
            targets: impactSprite,
            scaleX: 2.0,
            scaleY: 2.0,
            alpha: { from: 1.0, to: 0.0 },
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                impactSprite.destroy();
            },
        });

        // 着弾パーティクル
        const impactParticles = this.scene.add.particles(
            this.targetX,
            this.targetY,
            this.textureKey,
            {
                quantity: 15,
                scale: { start: 0.4, end: 0.1 },
                alpha: { start: 1.0, end: 0.0 },
                speed: { min: 100, max: 200 },
                lifespan: 500,
                blendMode: 'ADD',
                tint: this.getWaveColor(),
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 30), quantity: 15 },
            },
        );

        // パーティクルを一度だけ放出して停止
        impactParticles.explode(15, this.targetX, this.targetY);

        this.scene.time.delayedCall(600, () => {
            impactParticles.destroy();
        });

        // 画面震動エフェクト
        this.scene.cameras.main.shake(200, 0.01);

        // ダメージテキスト表示（遅延短縮）
        if (this.options.damage > 0) {
            this.scene.time.delayedCall(50, () => {
                showDamage(this.scene, this.targetX, this.targetY - 20, this.options.damage, {
                    type: this.options.waveType,
                });
            });
        }
    }

    getWaveColor() {
        // 波動タイプに応じた色を返す
        const colors = {
            energy: 0x00ffff, // シアン
            magic: 0xff00ff, // マゼンタ
            fire: 0xff4400, // オレンジ赤
            ice: 0x88ddff, // 氷青
            lightning: 0xffff00, // 黄色
            dark: 0x8800ff, // 紫
            light: 0xffffaa, // 明るい黄色
        };

        return colors[this.options.waveType] || colors.energy;
    }

    playLaunchSound() {
        // 波動タイプに応じた発射音
        const launchSounds = {
            energy: 'cast_energy_launch',
            magic: 'cast_magic_launch',
            fire: 'cast_fire_launch',
            ice: 'cast_ice_launch',
            lightning: 'cast_lightning_launch',
            dark: 'cast_dark_launch',
            light: 'cast_light_launch',
        };

        const soundKey = launchSounds[this.options.waveType] || 'cast_energy_launch';
        if (this.scene.sound && this.scene.sound.sounds.find((s) => s.key === soundKey)) {
            this.scene.sound.play(soundKey, {
                volume: 0.6,
                rate: 1.0 + (Math.random() - 0.5) * 0.2, // 音程を少し変化させる
            });
        }
    }

    playImpactSound() {
        // 波動タイプに応じた着弾音
        const impactSounds = {
            energy: 'impact_energy_hit',
            magic: 'impact_magic_hit',
            fire: 'impact_fire_explosion',
            ice: 'impact_ice_shatter',
            lightning: 'impact_lightning_crack',
            dark: 'impact_dark_boom',
            light: 'impact_light_flash',
        };

        const soundKey = impactSounds[this.options.waveType] || 'impact_energy_hit';

        //if (this.scene.sound && this.scene.sound.sounds.find((s) => s.key === soundKey)) {
        this.scene.sound.play(soundKey, {
            volume: 0.8,
            rate: 1.0 + (Math.random() - 0.5) * 0.3, // 着弾音も音程変化
        });
        //}

        // 追加の環境音（オプション）
        if (this.options.waveType === 'fire') {
            this.scene.time.delayedCall(100, () => {
                this.scene.sound.play('fire_crackle', { volume: 0.3, duration: 200 });
            });
        } else if (this.options.waveType === 'ice') {
            this.scene.time.delayedCall(50, () => {
                this.scene.sound.play('ice_ambient', { volume: 0.4, duration: 300 });
            });
        }
    }
}
