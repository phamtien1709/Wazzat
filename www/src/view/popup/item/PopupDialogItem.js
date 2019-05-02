import SpriteBase from "../../component/SpriteBase.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import TextBase from "../../component/TextBase.js";
import BaseView from "../../BaseView.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class PopupDialogItem extends BaseView {
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

        this.btnOk = new ButtonWithText(this.positionPopup.popup_confirm_button_ok_full, Language.instance().getData("102"), this.chooseOK, this);
        this.addChild(this.btnOk);

        this.txtContent = new TextBase(this.positionPopup.popup_confirm_text_content, content);
        this.txtContent.setTextBounds(0, 0, 545 * MainData.instance().scale, 278 * MainData.instance().scale);
        this.addChild(this.txtContent);

    }

    setHeight(_height) {
        this.bgText.height = _height;
        this.txtContent.setTextBounds(0, 0, 545 * MainData.instance().scale, this.bgText.height - 168 * MainData.instance().scale);
        this.btnOk.y = this.bgText.targetHeight - 103 * MainData.instance().scale;
    }

    chooseOK() {
        LogConsole.log("chooseOK");
        this.event.OK.dispatch();
    }

    setTextButton(content) {
        this.btnOk.setText(content);
    }
    setContent(content) {
        this.txtContent.setText(content);
    }

    destroy() {
        this.topBg.destroy();
        this.bgText.destroy();
        this.txtContent.destroy();
        this.btnOk.destroy();
        super.destroy();

    }
}