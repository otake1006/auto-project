export class AnimationQueue {
    constructor() {
        this.queue = [];
    }

    add(animationInstance) {
        this.queue.push(animationInstance);
    }

    async playAll() {
        for (const anim of this.queue) {
            await anim.play();
        }
        this.queue = [];
    }
}
