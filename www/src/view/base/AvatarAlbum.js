import BaseView from "../BaseView.js";
import ImageLoader from "../component/ImageLoader.js";

export default class AvatarAlbum extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.ava = new ImageLoader();
        this.addChild(this.ava);

        this.maskAva = new Phaser.Graphics(game, this.ava.x, this.ava.x);
        this.maskAva.beginFill(0xFF0000, 1);
        this.maskAva.drawRoundedRect(this.ava.x, this.ava.y, this.ava.width, this.ava.height, 10);
        this.maskAva.endFill();
        this.addChild(this.maskAva);
        this.ava.mask = this.maskAva;
    }

    setSize(_width, _height) {
        this.ava.setSize(_width, _height);

        this.maskAva.clear();
        this.maskAva.beginFill(0xFF0000, 1);
        this.maskAva.drawRoundedRect(this.ava.x, this.ava.y, this.ava.width, this.ava.height, 10);
        this.maskAva.endFill();
    }

    beginLoad(url, idx) {
        this.ava.beginLoad(url, idx);
    }

    get width() {
        return this.ava.width;
    }
    get height() {
        return this.ava.height
    }
}