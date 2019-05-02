import MainData from "../../model/MainData.js";


export default class SpriteBase extends Phaser.Image {
    constructor(objconfig) {
        super(game, objconfig.x * MainData.instance().scale, objconfig.y * MainData.instance().scale, objconfig.nameAtlas, objconfig.nameSprite);
        if (objconfig.hasOwnProperty("tint")) {
            this.tint = objconfig.tint;
        }
    }

    setSize(_width, _height) {
        this.width = _width;
        this.height = _height;
    }
}