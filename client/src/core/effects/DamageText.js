export function showDamage(scene, x, y, amount) {
    if (!amount) return;
    const dmgText = scene.add
        .text(x, y, `-${amount}`, {
            fontSize: '20px',
            color: '#ff0000',
        })
        .setOrigin(0.5);

    scene.tweens.add({
        targets: dmgText,
        y: y - 30,
        alpha: 0,
        duration: 800,
        onComplete: () => dmgText.destroy(),
    });
}
