import BaseView from "../BaseView.js";
import PopupConfirmBuyPlayListItem from "./item/PopupConfirmBuyPlayListItem.js";
import ShopPlayList from "../../model/shop/data/ShopPlayList.js";
import MainData from "../../model/MainData.js";
export default class PopupConfirmBuyPlayList extends BaseView {
    constructor() {

        super(game, null);
        this.data = new ShopPlayList();
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal()
        };

        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');

        this.addChild(this.bg);

        this.itemConfirm = new PopupConfirmBuyPlayListItem();
        this.itemConfirm.event.OK.add(this.chooseOk, this);
        this.itemConfirm.event.CANCLE.add(this.chooseCancle, this);
        this.itemConfirm.x = 35 * MainData.instance().scale;
        this.itemConfirm.y = game.height + 237 * MainData.instance().scale;
        //this.itemConfirm.y = 550;
        this.addChild(this.itemConfirm);
    }
    setContent(content) {
        this.itemConfirm.setContent(content);
    }

    setData(data) {

        //data la ShopPlayList;
        this.data = Object.assign({}, this.data, data);
        this.itemConfirm.setData(data);

        this.tweenItemPopup(this.itemConfirm, game.height - 900 * MainData.instance().scale);
    }

    chooseOk() {
        this.event.OK.dispatch(this.data);
    }

    chooseCancle() {
        this.event.CANCLE.dispatch();
    }
    destroy() {
        this.bg.destroy();
        this.itemConfirm.destroy();
        super.destroy();
    }
}