import BaseView from "../../BaseView.js";
import ButtonBase from "../../component/ButtonBase.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class PopupDialogWithCloseItem extends BaseView {
    constructor(content = "") {
        super(game, null);
        this.event = {
            close: new Phaser.Signal()
        }
        this.positionPopup = MainData.instance().positionPopup;

        this.topBg = new SpriteBase(this.positionPopup.popup_confirm_top_bg);
        this.addChild(this.topBg);

        this.bgText = new SpriteScale9Base(this.positionPopup.popup_confirm_bg_text);
        this.addChild(this.bgText);

        this.txtContent = new TextBase(this.positionPopup.popup_confirm_text_content, content);
        this.txtContent.setTextBounds(0, 0, 920 * MainData.instance().scale, this.bgText.height);
        this.addChild(this.txtContent);

        this.btnClose = new ButtonBase(this.positionPopup.popup_close_btn_exit, this.chooseClose, this);
        this.btnClose.x = this.topBg.width - this.btnClose.width / 2;
        this.btnClose.y = -this.btnClose.height / 3;
        this.addChild(this.btnClose);
    }

    setHeight(_height) {
        this.bgText.height = _height;
        this.txtContent.setTextBounds(0, 0, 920 * MainData.instance().scale, this.bgText.height - 30 * MainData.instance().scale);
    }

    chooseClose() {
        LogConsole.log("chooseClose");
        this.event.close.dispatch();
    }
}