import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";
import PopupBg from "../../../popup/item/PopupBg.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import MainData from "../../../../model/MainData.js";

import SocketController from "../../../../controller/SocketController.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import Language from "../../../../model/Language.js";

export default class EventModePopupWinItem extends BaseView {
    constructor(countQuestion = 1) {
        super(game, null);
        this.event = {
            exit: new Phaser.Signal(),
            continute: new Phaser.Signal()
        }
        this.positionPopup = MainData.instance().positionPopup;

        this.popup = new PopupBg();
        this.popup.setHeight(350 * MainData.instance().scale);
        this.popup.x = 0;
        this.popup.y = 89 * MainData.instance().scale;
        this.addChild(this.popup);

        this.icon = new SpriteBase(this.positionPopup.popup_icon_emo_win);
        this.icon.x = this.popup.x + (this.popup.width - this.icon.width) / 2;
        this.icon.y = 0
        this.addChild(this.icon);

        this.txtChucMung = new TextBase(this.positionPopup.popup_win_event_text_chucmung, Language.instance().getData("16") + "!!!");
        this.txtChucMung.setTextBounds(0, 0, this.popup.width, 57 * MainData.instance().scale);
        this.addChild(this.txtChucMung);


        this.txtCountQuestion = new TextBase(this.positionPopup.popup_win_event_text_count_question, Language.instance().getData("17") + " " + countQuestion + " " + Language.instance().getData("18"));
        this.txtCountQuestion.addColor("#ffa33a", Language.instance().getData("17").length);
        this.txtCountQuestion.addColor("#000000", (Language.instance().getData("17").length + 1 + countQuestion.toString().length));
        this.txtCountQuestion.setTextBounds(0, 0, this.popup.width, 34 * MainData.instance().scale);
        this.addChild(this.txtCountQuestion);

        this.btnExit = new ButtonWithText(this.positionPopup.popup_win_event_button_exit, Language.instance().getData("9"), this.chooseExit, this);
        this.addChild(this.btnExit);

        this.btnContinute = new ButtonWithText(this.positionPopup.popup_win_event_button_continute, Language.instance().getData("19") + "  -1", this.chooseContinute, this);
        this.addChild(this.btnContinute);
    }

    chooseExit() {
        this.event.exit.dispatch();
    }

    chooseContinute() {
        if (SocketController.instance().dataMySeft.ticket < 1) {
            ControllScreenDialog.instance().addDialogConfirnTicket(Language.instance().getData("20"));
            this.chooseExit();
        } else {
            this.event.continute.dispatch();
        }
    }

}