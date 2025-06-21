import { TextButton } from '@/ui/TextButton';

export class ReadyButton extends TextButton {
    constructor(scene, x, y, onReady, onCancel) {
        super(scene, x, y, 'Ready!', {
            width: 160,
            height: 50,
            borderColor: '#00cc00',
            bgColor: '#ffffff',
            textColor: '#ffffff',
            hoverColor: '#66ff66',
            activeColor: '#00cc00',
            onClick: () => this.handleClick(),
        });

        this.onReady = onReady;
        this.onCancel = onCancel;
        this.isReady = false;
    }

    handleClick() {
        this.isReady = !this.isReady;
        if (this.isReady) {
            this.label.setText('Waiting...');
            this.onReady?.();
        } else {
            this.label.setText('Ready!');
            this.onCancel?.();
        }
        this._onRest(); // optional: reset button state
    }

    setReadyState(isReady) {
        this.isReady = isReady;
        if (isReady) {
            this.label.setText('Waiting...');
        } else {
            this.label.setText('Ready!');
        }
        this._onRest?.();
    }
}
