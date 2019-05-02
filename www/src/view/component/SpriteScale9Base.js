import MainData from "../../model/MainData.js";

export default class SpriteScale9Base extends Phaser.Image {
    constructor(objConfig) {
        super(game, objConfig.x * MainData.instance().scale, objConfig.y * MainData.instance().scale, null);
        //LogConsole.log(objConfig);



        game.cache.addNinePatch(
            objConfig.name,
            objConfig.nameAtlas,
            objConfig.nameSprite,
            objConfig.left * MainData.instance().scale,
            objConfig.right * MainData.instance().scale,
            objConfig.top * MainData.instance().scale,
            objConfig.bot * MainData.instance().scale
        );


        this.bg = new Phaser.NinePatchImage(game, 0, 0, objConfig.name);
        this.bg.targetWidth = objConfig.width * MainData.instance().scale;
        this.bg.targetHeight = objConfig.height * MainData.instance().scale;
        this.bg.UpdateImageSizes();
        this.addChild(this.bg);


        /*
        this.bg = new PhaserNineSlice.NineSlice(
            game,           // Phaser.Game
            0,            // x position
            0,            // y position
            objConfig.nameAtlas,      // atlas key
            objConfig.nameSprite,// Image frame
            objConfig.width,            // expected width
            objConfig.height,            // expected height
            { //And this is the framedata, normally this is passed when preloading. Check README for details
                top: objConfig.top,    // Amount of pixels for top
                bottom: objConfig.bot, // Amount of pixels for bottom
                left: objConfig.left,   // Amount of pixels for left
                right: objConfig.right   // Amount of pixels for right
            }
        );
        */

        this.addChild(this.bg);

        // LogConsole.log(objConfig);
    }
    set tint(color) {
        if (this.bg) {
            for (let i = 0; i < this.bg.children.length; i++) {
                this.bg.children[i].tint = color;
            }
        }
    }

    set alpha(_alpha) {
        if (this.bg) {
            for (let i = 0; i < this.bg.children.length; i++) {
                this.bg.children[i].alpha = _alpha;
            }
        }
    }
    get width() {
        return this.bg.targetWidth;
        //return this.bg.width;
    }
    set width(_width) {
        this.bg.targetWidth = _width;
        this.bg.UpdateImageSizes();
        //this.bg.resize(_width, this.bg.height);
    }

    get height() {
        //return this.bg.height;
        return this.bg.targetHeight;
    }

    set height(_height) {
        this.bg.targetHeight = _height;
        this.bg.UpdateImageSizes();
        //this.bg.resize(this.bg.width, _height);
    }
}