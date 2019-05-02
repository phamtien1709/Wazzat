export default class Arm extends Phaser.Sprite {
    constructor(x, y, nameSprite, tweenPosY) {
        super(game, x, y, 'loadingNewSprites', nameSprite);
        this.addAnim(tweenPosY);
    }

    addAnim(tweenPosY) {
        let tween = game.add.tween(this).to({ y: this.position.y + tweenPosY }, 300, "Linear", true, 0, -1);
        tween.yoyo(true, 0);
    }
}