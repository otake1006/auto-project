export function playSound(scene, key) {
    const sound = scene.sound.get(key) || scene.sound.add(key);
    sound.play();
}
