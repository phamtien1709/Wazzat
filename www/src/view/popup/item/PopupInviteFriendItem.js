import BaseView from "../../BaseView.js";
import PopupConfirmItem from "./PopupConfirmItem.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import MainData from "../../../model/MainData.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import Language from "../../../model/Language.js";

export default class PopupInviteFriendItem extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        }

        this.positionPopup = MainData.instance().positionPopup;

        this.popup = new PopupConfirmItem();
        this.popup.setHeight(562 * MainData.instance().scale);
        this.popup.y = 59 * MainData.instance().scale;
        this.popup.event.OK.add(this.chooseOk, this);
        this.popup.event.CANCLE.add(this.chooseCancle, this);
        this.addChild(this.popup);

        this.ava = new AvatarPlayer();
        this.ava.setSize(197 * MainData.instance().scale, 197 * MainData.instance().scale);
        this.ava.x = 185 * MainData.instance().scale;
        this.ava.y = 0;
        this.addChild(this.ava);

        this.txtName = new TextBase(this.positionPopup.popup_invite_friend_txt_name, "");
        this.txtName.setTextBounds(0, 0, 568 * MainData.instance().scale, 47 * MainData.instance().scale);
        this.addChild(this.txtName);

        this.txtDes = new TextBase(this.positionPopup.popup_invite_friend_txt_des, "");
        this.txtDes.setTextBounds(0, 0, 568 * MainData.instance().scale, 77 * MainData.instance().scale);
        this.addChild(this.txtDes);

        this.txtMucCuoc = new TextBase(this.positionPopup.popup_invite_friend_txt_muccuoc, Language.instance().getData("43"));
        this.txtMucCuoc.setTextBounds(0, 0, 568 * MainData.instance().scale, 35 * MainData.instance().scale);
        this.addChild(this.txtMucCuoc);

        this.btnMucCuoc = new ButtonWithText(this.positionPopup.popup_invite_friend_btn_muccuoc, 1000);
        this.addChild(this.btnMucCuoc);
    }

    setAvatar(url, vip = false) {
        this.ava.setAvatar(url, 1);
        if (vip === true) {
            this.frameVip = new Phaser.Sprite(game, this.ava.x + 98, this.ava.y + 101.5, 'vipSource', 'Ava_Popup')
            this.frameVip.anchor.set(0.5);
            this.addChild(this.frameVip);
        }
    }

    setContent(tenchuphong, idphong) {
        this.txtName.text = tenchuphong;
        this.txtDes.text = tenchuphong + " " + Language.instance().getData("118") + " " + idphong;
        this.txtDes.addColor("#FEAC4F", 0);
        this.txtDes.addColor("#333333", tenchuphong.length);
        this.txtDes.addColor("#FEAC4F", (tenchuphong.length + Language.instance().getData("118").length + 1));
    }

    setMucCuoc(muccuoc) {
        this.btnMucCuoc.setText(muccuoc);
    }

    chooseOk() {
        this.event.OK.dispatch();
    }

    chooseCancle() {
        this.event.CANCLE.dispatch();
    }
}