import { ReadyButton } from '@/ui/ReadyButton';
import { TurnIndicator } from '@/ui/TurnIndicator';

export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.readyButton = new ReadyButton(this.scene);
        this.turnIndicator = new TurnIndicator(this.scene);
    }

    showReadyButton() {
        this.readyButton.show();
    }

    showTurnIndicator(turn) {
        this.turnIndicator.showTurn(turn);
    }

    cleanup() {
        this.readyButton.destroy();
        this.turnIndicator.destroy();
    }
}
