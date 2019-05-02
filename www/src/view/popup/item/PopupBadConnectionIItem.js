import BaseView from "../../BaseView.js";
import PopupConfirmItem from "./PopupConfirmItem.js";
import TextBase from "../../component/TextBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class PopupBadConnectionIItem extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };

        this.popup = new PopupConfirmItem();
        this.popup.setTextOk(Language.instance().getData("102"));
        this.popup.setTextCancle(Language.instance().getData("103"));
        this.popup.event.OK.add(this.chooseOk, this);
        this.popup.event.CANCLE.add(this.chooseCancle, this);
        this.popup.setHeight(580 * MainData.instance().scale);
        this.addChild(this.popup);

        this.dia = new Phaser.Sprite(game, 0, 0, "disconnect");
        this.dia.width = 228 * MainData.instance().scale;
        this.dia.height = 228 * MainData.instance().scale;
        this.dia.x = 172 * MainData.instance().scale;
        this.dia.y = 70 * MainData.instance().scale;
        this.dia.smoothed = true;
        this.dia.animations.pause = true;
        this.anim = this.dia.animations.add('disconnect');
        this.anim.enableUpdate = true;
        this.addChild(this.dia);

        this.dia.animations.play('disconnect', 30, true);


        let lb = new TextBase(MainData.instance().positionPopup.bad_connection_label_thongbao, Language.instance().getData("101"));
        lb.setTextBounds(0, 0, this.popup.width, 30 * MainData.instance().scale);
        this.addChild(lb);

        this.lbConfirm = new TextBase(MainData.instance().positionPopup.bad_connection_label_confirm, Language.instance().getData("104"));
        this.lbConfirm.setTextBounds(0, 0, this.popup.width, 50 * MainData.instance().scale);
        this.addChild(this.lbConfirm);
    }

    setTextConfirm(str) {
        this.lbConfirm.text = str;
    }

    setTextOk(str) {
        this.popup.setTextOk(str);
    }

    setTextCancle(str) {
        this.popup.setTextCancle(str);
    }

    chooseOk() {
        this.event.OK.dispatch();
    }

    chooseCancle() {
        this.event.CANCLE.dispatch();
    }

}