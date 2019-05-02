import PopupLevelUpItem from "../popup/item/PopupLevelUpItem.js";
import MainData from "../../model/MainData.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import BaseView from "../BaseView.js";

export default class LevelUp extends BaseView {
    constructor(level_up) {
        super(game, null);
        this.level_up = level_up;
        this.event = {
            close: new Phaser.Signal()
        }

        this.level = null;

        this.bg = new Phaser.Button(game, 0, 0, "screen-dim", this.closeLevelUp, this);
        //this.bg.alpha = 0;
        this.addChild(this.bg);

        this.level = new PopupLevelUpItem(this.level_up);
        this.level.event.close.add(this.closeLevelUp, this);
        this.level.x = 35 * MainData.instance().scale;
        this.addChild(this.level);

        this.level.y = game.height - 89 * MainData.instance().scale;

        this.tweenItemPopup(this.level, 385 * MainData.instance().scale);

        ControllSoundFx.instance().playSound(ControllSoundFx.popuplevelup);
    }

    closeLevelUp() {
        console.log("closeLevelUp---------");
        this.event.close.dispatch();
        //ControllSoundFx.instance().removeSound();
    }

    destroy() {
        super.destroy();
    }


}