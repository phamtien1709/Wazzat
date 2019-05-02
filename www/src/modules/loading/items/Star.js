export default class Star extends Phaser.Sprite {
    constructor(x, y) {
        super(game, x, y, 'loadStar');
        var runAnim = this.animations.add("run_anim");
        this.anchor.set(0.5);
        this.kill();
        //
        let timeRnd = 0.5 + Math.random() * 3;
        this.timeTween = game.time.events.add(Phaser.Timer.SECOND * timeRnd, () => {
            this.revive();
            this.animations.play("run_anim", 22, true);
        }, this);
    }

    destroy() {
        game.time.events.remove(this.timeTween);
        super.destroy();
    }
}