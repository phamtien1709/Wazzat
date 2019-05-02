export default class PracticePopupListPlaylistParentSprite extends Phaser.Sprite {
    constructor(x, y) {
        super(game, x, y, null);
    }

    add(sprite) {
        this.addChild(sprite);
    }

    set height(_height) {
        this._height = _height;
    }

    get height() {
        return this._height;
    }
}