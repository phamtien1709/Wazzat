import SpriteBase from "./SpriteBase.js";
import TextBase from "./TextBase.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import ButtonBase from "./ButtonBase.js";
import MainData from "../../model/MainData.js";

export default class ButtonWithText extends ButtonBase {
    constructor(objConfig, lbContent, callback, scope) {
        super(objConfig, callback, scope);

        this.objConfig = objConfig;
        //  LogConsole.log(this.objConfig);
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

        let _width = 0;
        let _height = 0;
        let paddingLeft = 0;
        let paddingRight = 0;
        let paddingTop = 0;
        let paddingBot = 0;
        if (objConfig.configText.hasOwnProperty("paddingLeft")) {
            paddingLeft = objConfig.configText.paddingLeft * MainData.instance().scale;
        }
        if (objConfig.configText.hasOwnProperty("paddingRight")) {
            paddingRight = objConfig.configText.paddingRight * MainData.instance().scale;
        }
        if (objConfig.configText.hasOwnProperty("paddingTop")) {
            paddingTop = objConfig.configText.paddingTop * MainData.instance().scale;
        }
        if (objConfig.configText.hasOwnProperty("paddingBot")) {
            paddingBot = objConfig.configText.paddingBot * MainData.instance().scale;
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

            if (objConfig.hasOwnProperty("alignAll")) {
                this.setKCTextCenter();
            } else {
                this.lbBtn.setTextBounds(0, 0, _width, _height);

                if (this.objConfig.icon.align == "right") {
                    if (paddingRight > 0) {
                        this.lbBtn.x = this.width - paddingRight;
                    } else if (paddingLeft > 0) {
                        this.lbBtn.x = paddingLeft;
                    } else {
                        this.lbBtn.x = this.icon.x - _width - 6 * MainData.instance().scale;
                    }
                } else {

                    if (paddingRight > 0) {
                        this.lbBtn.x = this.width - paddingRight;
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

        this.addChild(this.lbBtn);
    }



    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    setKCTextCenter() {
        // LogConsole.log("setKCTextCenter");
        let paddingTop = 0;
        let paddingBot = 0;
        if (this.objConfig.configText.hasOwnProperty("paddingTop")) {
            paddingTop = this.objConfig.configText.paddingTop;
        }
        if (this.objConfig.configText.hasOwnProperty("paddingBot")) {
            paddingBot = this.objConfig.configText.paddingBot;
        }

        let kcTextAndIcon = 6 * MainData.instance().scale;
        if (this.objConfig.hasOwnProperty("kc")) {
            kcTextAndIcon = this.objConfig.hasOwnProperty("kc");
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

    setText(content) {
        // LogConsole.log(content);
        this.lbBtn.text = content;
        if (this.objConfig.hasOwnProperty("alignAll")) {
            this.setKCTextCenter();
        }
    }
}