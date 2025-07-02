import { BaseSpriteButton } from './BaseSpriteButton';

export class AnimatedSpriteButton extends BaseSpriteButton {
    constructor(scene, x, y, texture, idleFrame, hoverFrame, downFrame) {
        super(scene, x, y, texture, idleFrame);
        this.idleFrame = idleFrame;
        this.hoverFrame = hoverFrame;
        this.downFrame = downFrame;
    }

    onHoverIn() {
        this.setFrame(this.hoverFrame);
    }

    onHoverOut() {
        this.setFrame(this.idleFrame);
    }

    onPress() {
        this.setFrame(this.downFrame);
    }

    onRelease() {
        this.setFrame(this.hoverFrame);
        this.emit('clicked');
    }
}
