import BaseView from "../BaseView.js";
import PopupInviteFriendOkItem from "./item/PopupInviteFriendOkItem.js";
import MainData from "../../model/MainData.js";

export default class PopupInviteFriendOk extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupInviteFriendOkItem();
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = 444 * MainData.instance().scale;
        this.addChild(this.popup);
        this.popup.event.close.add(this.chooseClose, this);

        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 690 * MainData.instance().scale);
    }
    setTitle(_title) {
        this.popup.setTitle(_title);
    }
    setName(_name) {
        this.popup.setName(_name);
    }
    chooseClose() {
        this.event.close.dispatch();
    }
}