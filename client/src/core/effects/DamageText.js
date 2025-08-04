export function showDamage(scene, x, y, amount, options = {}) {
    if (!amount) return;

    // ダメージタイプに応じた色とスタイル
    const damageTypes = {
        normal: { color: '#ff4444', fontSize: '20px' },
        critical: { color: '#ffff44', fontSize: '28px' },
        magic: { color: '#ff44ff', fontSize: '22px' },
        fire: { color: '#ff8844', fontSize: '22px' },
        ice: { color: '#44ddff', fontSize: '22px' },
        dark: { color: '#8844ff', fontSize: '22px' },
        heal: { color: '#44ff44', fontSize: '20px' },
    };

    const type = 'normal';
    const isCritical = options.critical || Math.random() < 0.15; // 15%クリティカル
    const style = isCritical ? damageTypes.critical : damageTypes[type];

    // ダメージテキスト作成
    const prefix = type === 'heal' ? '+' : '-';
    const text = isCritical ? `${prefix}${amount}!` : `${prefix}${amount}`;

    const dmgText = scene.add
        .text(x, y, text, {
            fontSize: style.fontSize,
            color: style.color,
            fontStyle: isCritical ? 'bold' : 'normal',
            stroke: '#000000',
            strokeThickness: 2,
        })
        .setOrigin(0.5);

    // クリティカル時の追加エフェクト
    if (isCritical) {
        dmgText.setScale(1.5);
        scene.tweens.add({
            targets: dmgText,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 200,
            ease: 'Back',
        });
    }

    // ランダムな横移動
    const randomX = x + (Math.random() - 0.5) * 40;

    scene.tweens.add({
        targets: dmgText,
        x: randomX,
        y: y - 50,
        alpha: 0,
        duration: isCritical ? 1200 : 800,
        ease: 'Power2',
        onComplete: () => dmgText.destroy(),
    });

    // ダメージタイプ別の追加エフェクト
    if (type === 'fire') {
        createFireEffect(scene, x, y);
    } else if (type === 'ice') {
        createIceEffect(scene, x, y);
    } else if (type === 'magic') {
        createMagicEffect(scene, x, y);
    }
}

function createFireEffect(scene, x, y) {
    // 火のパーティクル
    const fireParticles = scene.add.particles(x, y, 'cast_effect', {
        quantity: 3,
        scale: { start: 0.2, end: 0.05 },
        alpha: { start: 0.8, end: 0.0 },
        speed: { min: 30, max: 60 },
        lifespan: 400,
        tint: 0xff4400,
        blendMode: 'ADD',
    });

    fireParticles.explode(3, x, y);
    scene.time.delayedCall(500, () => fireParticles.destroy());
}

function createIceEffect(scene, x, y) {
    // 氷の結晶エフェクト
    const iceParticles = scene.add.particles(x, y, 'cast_effect', {
        quantity: 4,
        scale: { start: 0.15, end: 0.3 },
        alpha: { start: 1.0, end: 0.0 },
        speed: { min: 20, max: 40 },
        lifespan: 600,
        tint: 0x88ddff,
        blendMode: 'ADD',
    });

    iceParticles.explode(4, x, y);
    scene.time.delayedCall(700, () => iceParticles.destroy());
}

function createMagicEffect(scene, x, y) {
    // 魔法の星エフェクト
    const magicParticles = scene.add.particles(x, y, 'cast_effect', {
        quantity: 5,
        scale: { start: 0.1, end: 0.2 },
        alpha: { start: 0.9, end: 0.0 },
        speed: { min: 40, max: 80 },
        lifespan: 500,
        tint: 0xff44ff,
        blendMode: 'ADD',
    });

    magicParticles.explode(5, x, y);
    scene.time.delayedCall(600, () => magicParticles.destroy());
}
