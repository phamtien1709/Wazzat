import MainData from "../../../model/MainData.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import SpriteBase from "../../component/SpriteBase.js";
import TextBase from "../../component/TextBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";

export default class OnlineModeButtonMenuGenres extends Phaser.Button {
    constructor(lbContent, callback, scope) {
        super(game, 0, 0, null, callback, scope);

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.defaultBg = new SpriteScale9Base(this.positionCreateRoom.quickplay_tab_btn_default);
        this.addChild(this.defaultBg);

        this.activeBg = new SpriteScale9Base(this.positionCreateRoom.quickplay_tab_btn_active);
        this.addChild(this.activeBg);


        this.lineActive = new SpriteBase(this.positionCreateRoom.quickplay_tab_line);
        this.addChild(this.lineActive);

        this.lb = new TextBase(this.positionCreateRoom.quickplay_tab_btn_label, lbContent);
        this.lb.setTextBounds(0, 0, this.defaultBg.width, this.defaultBg.height);
        this.addChild(this.lb);
    }

    setActiveBet() {

        this.activeBg.width = game.width;
        this.activeBg.height = 100 * MainData.instance().scale;

        this.lb.setTextBounds(0, 0, this.activeBg.width, this.activeBg.height);

        this.lineActive.width = this.activeBg.targetWidth;
        this.activeBg.visible = true;
        this.lineActive.visible = true;
        this.defaultBg.visible = false;
    }

    get width() {
        return this.activeBg.width;
    }

    get height() {
        return this.activeBg.height;
    }

    setActive() {
        this.activeBg.visible = true;
        this.lineActive.visible = true;
        this.defaultBg.visible = false;
    }

    setDefault() {
        this.activeBg.visible = false;
        this.lineActive.visible = false;
        this.defaultBg.visible = true;
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

}