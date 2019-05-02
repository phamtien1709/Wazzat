export default class Girl extends Phaser.Sprite {
    constructor(x, y, nameSprite) {
        super(game, x, y, nameSprite);
        var runAnim = this.animations.add("run_anim" + nameSprite);
        this.anchor.set(0.5);
        this.animations.play("run_anim" + nameSprite, 32, true);
    }

    tweenPosX(x, time) {
        let tween = game.add.tween(this).to({ x: x }, time, "Linear", true);
        tween.start();
    }
}