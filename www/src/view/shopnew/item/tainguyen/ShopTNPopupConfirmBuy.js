import BaseView from "../../../BaseView.js";
import ShopTNPopupConfirmBuyItem from "./ShopTNPopupConfirmBuyItem.js";
import MainData from "../../../../model/MainData.js";

export default class ShopTNPopupConfirmBuy extends BaseView {
    constructor(data, icon, isSup) {
        super(game, null);
        this.event = {
            exit: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new ShopTNPopupConfirmBuyItem(data, icon, isSup);
        this.popup.event.exit.add(this.chooseExit, this);
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = game.height;
        this.addChild(this.popup);

        this.tweenItemPopup(this.popup, 275 * MainData.instance().scale)
    }
    chooseExit() {
        this.event.exit.dispatch();
    }
}