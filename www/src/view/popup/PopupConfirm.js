import BaseView from "../BaseView.js";
import PopupConfirmItem from "./item/PopupConfirmItem.js";
import MainData from "../../model/MainData.js";
import EventGame from "../../controller/EventGame.js";

export default class PopupConfirm extends BaseView {
    constructor(content = "", tryNo = "") {
        super(game, null);

        this.tryNo = tryNo;

        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupConfirmItem(content);
        this.popup.x = 35 * MainData.instance().scale;
        //this.popup.y = 550;
        this.addChild(this.popup);
        this.popup.event.OK.add(this.chooseOk, this);
        this.popup.event.CANCLE.add(this.chooseCancle, this);

        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 900 * MainData.instance().scale);
    }

    setContent(content) {
        this.popup.setContent(content);
    }

    chooseOk() {
        this.event.OK.dispatch();
    }

    chooseCancle() {
        EventGame.instance().event.chooseNoPopupConfirm.dispatch(this.tryNo);
        this.event.CANCLE.dispatch();
    }
}