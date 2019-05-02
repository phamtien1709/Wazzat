import MainData from "../../model/MainData.js";
import SpriteBase from "./SpriteBase.js";
import TextBase from "./TextBase.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";

export default class ButtonScale9WithText extends Phaser.Button {
    constructor(objConfig, lbContent, callBack, scope) {
        super(game, objConfig.x * MainData.instance().scale, objConfig.y * MainData.instance().scale, null, callBack, scope);
        this.objConfig = objConfig;
        //LogConsole.log(this.objConfig);



        game.cache.addNinePatch(objConfig.name,
            objConfig.nameAtlas,
            objConfig.nameSprite,
            objConfig.left * MainData.instance().scale,
            objConfig.right * MainData.instance().scale,
            objConfig.top * MainData.instance().scale,
            objConfig.bot * MainData.instance().scale);


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
        );*/

        this.addChild(this.bg);


        this.icon = null;

        if (objConfig.icon) {
            this.icon = new SpriteBase(objConfig.icon);
            if (objConfig.icon.width) {
                this.icon.width = objConfig.icon.width * MainData.instance().scale;
            }
            if (objConfig.icon.height) {
                this.icon.height = objConfig.icon.height * MainData.instance().scale;
            }
            this.addChild(this.icon);
        }

        this.lbBtn = new TextBase(objConfig.configText, lbContent);
        this.reSize();
        this.addChild(this.lbBtn);
    }
    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    reSize() {
        let _width = 0;
        let _height = 0;
        let paddingLeft = 0;
        let paddingRight = 0;
        let paddingTop = 0;
        let paddingBot = 0;
        if (this.objConfig.configText.hasOwnProperty("paddingLeft")) {
            paddingLeft = this.objConfig.configText.paddingLeft * MainData.instance().scale;
        }
        if (this.objConfig.configText.hasOwnProperty("paddingRight")) {
            paddingRight = this.objConfig.configText.paddingRight * MainData.instance().scale;
        }
        if (this.objConfig.configText.hasOwnProperty("paddingTop")) {
            paddingTop = this.objConfig.configText.paddingTop * MainData.instance().scale;
        }
        if (this.objConfig.configText.hasOwnProperty("paddingBot")) {
            paddingBot = this.objConfig.configText.paddingBot * MainData.instance().scale;
        }
        if (this.icon == null) {
            if (this.objConfig.configText.width) {
                _width = this.objConfig.configText.width * MainData.instance().scale - paddingRight - paddingLeft;
            } else {
                _width = this.width - paddingRight - paddingLeft;
            }

            if (this.objConfig.configText.height) {
                _height = this.objConfig.configText.height * MainData.instance().scale - paddingTop - paddingBot;
            } else {
                _height = this.height - paddingTop - paddingBot;
            }

            this.lbBtn.setTextBounds(0, 0, _width, _height);

            if (paddingRight > 0) {
                this.lbBtn.x = this.width - paddingRight - _width;
            } else if (paddingLeft > 0) {
                this.lbBtn.x = paddingLeft;
            } else {
                this.lbBtn.x = (this.width - _width) / 2;
            }

            if (paddingTop > 0) {
                this.lbBtn.y = paddingTop;
            } else if (paddingBot > 0) {
                this.lbBtn.y = this.height - paddingBot;
            } else {
                this.lbBtn.y = (this.height - _height) / 2;
            }
        } else {
            if (this.objConfig.configText.width) {
                _width = this.objConfig.configText.width * MainData.instance().scale - paddingRight - paddingLeft;
            } else {
                if (this.objConfig.icon.align == "right") {
                    _width = this.width - this.icon.x - 6 * MainData.instance().scale - paddingRight - paddingLeft;
                } else {
                    _width = this.width - this.icon.x - this.icon.width - 6 * MainData.instance().scale - paddingRight - paddingLeft;
                }
            }

            if (this.objConfig.configText.height) {
                _height = this.objConfig.configText.height * MainData.instance().scale - paddingTop - paddingBot;
            } else {
                _height = this.height - paddingTop - paddingBot;
            }

            if (this.objConfig.hasOwnProperty("alignAll")) {
                this.setKCTextCenter();
            } else {
                this.lbBtn.setTextBounds(0, 0, _width, _height);

                if (this.objConfig.icon.align == "right") {
                    if (paddingRight > 0) {
                        this.lbBtn.x = this.width - paddingRight - _width;
                    } else if (paddingLeft > 0) {
                        this.lbBtn.x = paddingLeft;
                    } else {
                        this.lbBtn.x = this.icon.x - _width - 6 * MainData.instance().scale;
                    }
                } else {

                    if (paddingRight > 0) {
                        this.lbBtn.x = this.width - paddingRight - _width;
                    } else if (paddingLeft > 0) {
                        this.lbBtn.x = paddingLeft;
                    } else {
                        this.lbBtn.x = this.icon.x + this.icon.width + 6 * MainData.instance().scale;
                    }
                }
                if (paddingTop > 0) {
                    this.lbBtn.y = paddingTop;
                } else if (paddingBot > 0) {
                    this.lbBtn.y = this.height - paddingBot;
                } else {
                    this.lbBtn.y = (this.height - _height) / 2;
                }
            }
        }
    }

    setKCTextCenter() {
        // LogConsole.log("setKCTextCenter");
        let paddingTop = 0;
        let paddingBot = 0;
        if (this.objConfig.configText.hasOwnProperty("paddingTop")) {
            paddingTop = this.objConfig.configText.paddingTop * MainData.instance().scale;
        }
        if (this.objConfig.configText.hasOwnProperty("paddingBot")) {
            paddingBot = this.objConfig.configText.paddingBot * MainData.instance().scale;
        }

        let kcTextAndIcon = 6 * MainData.instance().scale;
        if (this.objConfig.hasOwnProperty("kc")) {
            kcTextAndIcon = this.objConfig.hasOwnProperty("kc") * MainData.instance().scale;
        }
        if (this.objConfig.icon.align == "right") {
            this.lbBtn.x = (this.width - (this.lbBtn.width + kcTextAndIcon + this.icon.width)) / 2;
            this.icon.x = this.lbBtn.x + this.lbBtn.width + kcTextAndIcon;
        } else {
            this.icon.x = (this.width - (this.lbBtn.width + kcTextAndIcon + this.icon.width)) / 2;
            this.lbBtn.x = this.icon.x + this.icon.width + kcTextAndIcon;
        }

        if (paddingTop > 0) {
            this.lbBtn.y = paddingTop;
        } else if (paddingBot > 0) {
            this.lbBtn.y = this.height - paddingBot;
        } else {
            this.lbBtn.y = (this.height - this.lbBtn.height) / 2;
        }

    }

    set text(lbContent) {
        this.lbBtn.text = lbContent;
        this.reSize();
    }

    get width() {
        return this.bg.targetWidth;
        // return this.bg.width;
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