import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import PopupBg from "../../../popup/item/PopupBg.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class EventModePopupDoneItem extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            exit: new Phaser.Signal()
        }
        this.positionPopup = MainData.instance().positionPopup;

        this.popup = new PopupBg();
        this.popup.setHeight(350 * MainData.instance().scale);
        this.popup.x = 0;
        this.popup.y = 89 * MainData.instance().scale;
        this.addChild(this.popup);

        this.icon = new SpriteBase(this.positionPopup.popup_icon_emo_done);
        this.icon.x = this.popup.x + (this.popup.width - this.icon.width) / 2;
        this.icon.y = -67 * MainData.instance().scale;
        this.addChild(this.icon);

        this.txtChucMung = new TextBase(this.positionPopup.popup_win_event_text_chucmung, Language.instance().getData("7"));
        this.txtChucMung.setTextBounds(0, 0, this.popup.width, 57 * MainData.instance().scale);
        this.addChild(this.txtChucMung);


        this.txtCountQuestion = new TextBase(this.positionPopup.popup_win_event_text_done, Language.instance().getData("8"));
        this.txtCountQuestion.setTextBounds(0, 0, 474 * MainData.instance().scale, 34 * MainData.instance().scale);
        this.addChild(this.txtCountQuestion);

        this.btnExit = new ButtonWithText(this.positionPopup.popup_done_event_button_exit, Language.instance().getData("9"), this.chooseExit, this);
        this.addChild(this.btnExit);
    }
    chooseExit() {
        this.event.exit.dispatch();
    }
}