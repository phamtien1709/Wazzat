export default class Head extends Phaser.Sprite {
    constructor(x, y, nameSprite, angle) {
        super(game, x, y, 'loadingNewSprites', nameSprite);
        this.anchor.set(0.5, 1);
        this.angle = angle;
        this.addShake(angle);
    }

    addShake(angle) {
        let shake = game.add.tween(this).to({ angle: -angle }, 400, "Linear", true, 0, -1);
        shake.yoyo(true, 0);
    }
}