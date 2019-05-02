import BaseView from "../BaseView.js";
import PopupBadConnectionIItem from "./item/PopupBadConnectionIItem.js";
import MainData from "../../model/MainData.js";

export default class PopupBadConnection extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupBadConnectionIItem();
        this.popup.event.OK.add(this.chooseOk, this);
        this.popup.event.CANCLE.add(this.chooseCancle, this);
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 810 * MainData.instance().scale);
        this.addChild(this.popup);

    }

    setTextOk(str) {
        this.popup.setTextOk(str);
    }

    setTextCancle(str) {
        this.popup.setTextCancle(str);
    }

    setTextConfirm(str) {
        this.popup.setTextConfirm(str);
    }

    chooseOk() {
        this.event.OK.dispatch();
    }
    chooseCancle() {
        this.event.CANCLE.dispatch();
    }
}