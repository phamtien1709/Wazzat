import BaseView from "../../BaseView.js";
import PopupDialogWithCloseItem from "./PopupDialogWithCloseItem.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import EventGame from "../../../controller/EventGame.js";

import ControllScreenDialog from "../../ControllScreenDialog.js";
import Language from "../../../model/Language.js";

export default class PopupLevelUpItem extends BaseView {
    constructor(level = 0) {
        super(game, null);
        this.event = {
            close: new Phaser.Signal()
        }
        this.tweenAlphaText = null;
        this.level = level;
        this.dialog = new PopupDialogWithCloseItem();
        this.dialog.event.close.add(this.chooseClose, this);
        this.dialog.setHeight(420 * MainData.instance().scale);
        this.addChild(this.dialog);

        this.levelUp = new Phaser.Sprite(game, 0, 0, "LevelUp");
        this.levelUp.width = 444 * MainData.instance().scale;
        this.levelUp.height = 270.47 * MainData.instance().scale;
        this.levelUp.x = 62 * MainData.instance().scale;
        this.levelUp.y = 29 * MainData.instance().scale;
        this.levelUp.animations.add('playLevelUp');
        this.levelUp.animations.play('playLevelUp', 30, false);
        this.addChild(this.levelUp);



        let objText = {
            x: 0,
            y: 0,
            style: {
                fontSize: 32,
                wordWrap: true,
                wordWrapWidth: 388,
                align: "center",
                boundsAlignH: "center",
                boundsAlignV: "middle",
                fill: "#000000",
                font: "GilroyBold"
            }
        };

        this.txtLeveUp = new TextBase(objText, Language.instance().getData("120") + " " + level);
        this.txtLeveUp.setTextBounds(0, 0, 568 * 0.7 * MainData.instance().scale, 118 * MainData.instance().scale);
        this.txtLeveUp.lineSpacing = 12 * MainData.instance().scale;
        this.txtLeveUp.y = 296 * MainData.instance().scale;
        this.txtLeveUp.x = ((568 - 568 * 0.7) * MainData.instance().scale) / 2;
        this.addChild(this.txtLeveUp);

        this.addEvent();
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseClose, this);
    }

    removeEvent() {
        this.levelUp.animations.stop();
        EventGame.instance().event.backButton.remove(this.chooseClose, this);
    }


    animationUpdate() {
        console.log("animationUpdate: " + this.levelUp.animations.frame)
        if (this.levelUp.animations.frame === 59) {
            this.levelUp.animations.stop();
        }
    }

    chooseClose() {
        //console.log('HERE HERE HERE');         
        this.event.close.dispatch();
    }

    setData(level) {

        this.level = level;

        this.txtLeveUp.text = Language.instance().getData("120") + " " + level + "";
        this.levelUp.animations.play('playLevelUp', 30, true);
        /*
        this.txtLeveUp.alpha = 0.2;
        this.tweenAlphaText = game.add.tween(this.txtLeveUp).to({
            alpha: 1
        }, 1000, Phaser.Easing.Power1, true);
        this.tweenAlphaText.repeat(99999, 1000);*/

    }



    destroy() {
        this.removeEvent();
        if (this.tweenAlphaText !== null) {
            this.tweenAlphaText.stop();
            game.tweens.remove(this.tweenAlphaText);
            this.tweenAlphaText = null;
        }

        super.destroy();
    }
}