import { AnimatedSpriteButton } from './AnimatedSpriteButton';
import { sm } from '../core/SoundManager';

export class SoundSpriteButton extends AnimatedSpriteButton {
    constructor(scene, x, y, texture, idleFrame, hoverFrame, downFrame) {
        super(scene, x, y, texture, idleFrame, hoverFrame, downFrame);
    }

    onPress() {
        super.onPress();
        sm.play('click');
    }
}
