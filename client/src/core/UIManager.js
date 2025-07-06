import { TurnIndicator } from '@/ui/TurnIndicator';

export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.turnIndicator = new TurnIndicator(this.scene);
    }

    showTurnIndicator(turn) {
        this.turnIndicator.showTurn(turn);
    }

    cleanup() {
        this.turnIndicator.destroy();
    }
}
