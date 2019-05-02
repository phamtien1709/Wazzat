import ImageLoader from "../component/ImageLoader.js";
import MainData from "../../model/MainData.js";

export default class AvatarPlayer extends Phaser.Image {
    constructor() {
        super(game, null);
        this.maskAva = null;
        this.ava = new ImageLoader("songDetailSprites", "ava-default");
        this.addChild(this.ava);
        this.createMask();
    }

    setSize(_width, _height) {
        this.ava.setSize(_width, _height);
        this.createMask();
    }
    setAvatar(url, idx = 0) {
        this.ava.beginLoad(url, idx);
    }

    createMask() {
        this.removeMask();

        this.maskAva = new Phaser.Graphics(game, this.ava.x, this.ava.y);
        this.maskAva.beginFill(0xFF0000, 1);
        this.maskAva.drawCircle(this.ava.width / 2, this.ava.height / 2, this.ava.width - 4 * MainData.instance().scale);
        this.maskAva.endFill();
        this.addChild(this.maskAva);

        this.ava.mask = this.maskAva;
    }
    removeMask() {
        if (this.maskAva !== null) {
            this.maskAva.clear();
            this.maskAva.destroy();
            this.maskAva = null;
        }
    }

    get width() {
        return this.ava.width;
    }

    get height() {
        return this.ava.height;
    }
}