import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";

export default class PopupConfirmItem extends BaseView {
    constructor(content = "") {
        super(game, null);
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };
        this.positionPopup = MainData.instance().positionPopup;

        this.topBg = new SpriteBase(this.positionPopup.popup_confirm_top_bg);
        this.addChild(this.topBg);

        this.bgText = new SpriteScale9Base(this.positionPopup.popup_confirm_bg_text);
        this.addChild(this.bgText);

        this.btnOk = new ButtonWithText(this.positionPopup.popup_confirm_button_ok, Language.instance().getData("102"), this.chooseOK, this);
        this.addChild(this.btnOk);

        this.btnCancle = new ButtonWithText(this.positionPopup.popup_confirm_button_cancle, Language.instance().getData("117"), this.chooseCancle, this);
        this.addChild(this.btnCancle);

        this.txtContent = new TextBase(this.positionPopup.popup_confirm_text_content, content);
        this.txtContent.setTextBounds(0, 0, 545 * MainData.instance().scale, 278 * MainData.instance().scale);
        this.addChild(this.txtContent);

    }

    setHeight(_height) {
        this.bgText.height = _height;
        this.txtContent.setTextBounds(0, 0, 545 * MainData.instance().scale, this.bgText.height - 168 * MainData.instance().scale);
        this.btnCancle.y = this.bgText.height - 103 * MainData.instance().scale;
        this.btnOk.y = this.bgText.height - 103 * MainData.instance().scale;
    }

    setTextCancle(content) {
        this.btnCancle.setText(content);
    }

    setTextOk(content) {
        this.btnOk.setText(content);
    }

    setContent(content) {
        this.txtContent.setText(content);
    }

    get width() {
        return this.bgText.width;
    }



    chooseOK() {
        LogConsole.log("chooseOK");
        this.btnOk.inputEnabled = false;
        this.btnCancle.inputEnabled = false;
        this.event.OK.dispatch();
    }

    chooseCancle() {
        LogConsole.log("chooseCancle");
        this.btnOk.inputEnabled = false;
        this.btnCancle.inputEnabled = false;
        this.event.CANCLE.dispatch();
    }

    destroy() {
        this.topBg.destroy();
        this.bgText.destroy();
        this.btnOk.destroy();
        this.btnCancle.destroy();
        this.txtContent.destroy();
        super.destroy();
    }
}