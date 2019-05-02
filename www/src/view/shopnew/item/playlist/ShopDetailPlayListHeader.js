import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import EventGame from "../../../../controller/EventGame.js";
import MainData from "../../../../model/MainData.js";

export default class ShopDetailPlayListHeader extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.eventBack = new Phaser.Signal();

        this.positionShop = MainData.instance().positionDetailPlaylist;
        this.bg = new SpriteBase(this.positionShop.sort_play_list_bg_top_menu);
        this.addChild(this.bg);

        this.btnBack = new ButtonBase(this.positionShop.sort_play_list_bg_back_top_menu, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.btnDiamond = new ButtonWithText(this.positionShop.sort_play_list_bg_diamond_top_menu, SocketController.instance().dataMySeft.diamond);
        this.addChild(this.btnDiamond);

        EventGame.instance().event.backButton.add(this.chooseBack, this);
    }
    chooseBack() {
        //console.log('HERE HERE HERE');
        LogConsole.log("chooseBack");
        this.dispatchEventBack();
    }

    addEventBack(callback, scope) {
        this.eventBack.add(callback, scope);
    }
    removeEventBack(callback, scope) {
        this.eventBack.remove(callback, scope);
    }
    dispatchEventBack() {
        this.eventBack.dispatch();
    }
    destroy() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        super.destroy();
    }
}