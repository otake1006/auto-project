import Character from '../entities/Character';
import CharacterView from '../entities/CharacterView';

export class PlayerManager {
    constructor(scene) {
        this.scene = scene;
        this.positions = [
            { x: scene.cameras.main.centerX - 300, y: scene.cameras.main.centerY },
            { x: scene.cameras.main.centerX + 300, y: scene.cameras.main.centerY },
        ];
        this.createPlayers();
    }

    createPlayers() {
        this.player = this.createCharacter(this.positions[0], true, 'player');
        this.enemy = this.createCharacter(this.positions[1], false, 'enemy');

        this.playerView = new CharacterView(
            this.scene,
            this.player,
            this.positions[0].x,
            this.positions[0].y,
        );
        this.enemyView = new CharacterView(
            this.scene,
            this.enemy,
            this.positions[1].x,
            this.positions[1].y,
            true,
        );
    }

    createCharacter(position, isPlayer, id) {
        return new Character(this.scene, position.x, position.y, 'player', id, 100, 50, isPlayer);
    }

    updatePlayer(data) {
        this.player.updateFromServer(data);
        this.playerView.update(data);
    }

    updateEnemy(data) {
        this.enemy.updateFromServer(data);
        this.enemyView.update(data);
    }

    cleanup() {
        this.player.destroy();
        this.enemy.destroy();
        this.playerView.destroy();
        this.enemyView.destroy();
    }
}
