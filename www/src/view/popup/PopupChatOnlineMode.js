import BaseView from "../BaseView.js";
import PopupChatItem from "./item/PopupChatItem.js";
import MainData from "../../model/MainData.js";

export default class PopupChatOnlineMode extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            close: new Phaser.Signal()
        }
        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popupChat = new PopupChatItem();
        this.popupChat.event.close.add(this.chooseClose, this);
        this.popupChat.x = 35 * MainData.instance().scale;
        this.popupChat.y = game.height - 900 * MainData.instance().scale;
        this.addChild(this.popupChat);
    }

    chooseClose() {
        this.event.close.dispatch();
    }
}