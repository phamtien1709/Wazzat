import BaseView from "../../BaseView.js";
import PopupDialogWithCloseItem from "./PopupDialogWithCloseItem.js";
import TextBase from "../../component/TextBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class PopupInviteFriendOkItem extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            close: new Phaser.Signal()
        }

        this.positionPopup = MainData.instance().positionPopup;

        this.popup = new PopupDialogWithCloseItem();
        this.popup.event.close.add(this.chooseClose, this);
        this.popup.setHeight(189 * MainData.instance().scale);
        this.addChild(this.popup)

        this.txtTitle = new TextBase(this.positionPopup.popup_invite_friend_ok_txt_title, Language.instance().getData("119"));
        this.txtTitle.setTextBounds(0, 0, 568 * MainData.instance().scale, 60 * MainData.instance().scale);
        this.addChild(this.txtTitle);

        this.txtName = new TextBase(this.positionPopup.popup_invite_friend_ok_txt_name, "");
        this.txtName.setTextBounds(0, 0, 568 * MainData.instance().scale, 80 * MainData.instance().scale);
        this.addChild(this.txtName);
    }

    setTitle(_title) {
        this.txtTitle.text = _title;
    }
    setName(_name) {
        this.txtName.text = _name;
    }

    chooseClose() {
        LogConsole.log("chooseClose");
        this.event.close.dispatch();
    }
}