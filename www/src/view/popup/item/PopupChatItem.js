import BaseView from "../../BaseView.js";
import PopupDialogWithCloseItem from "./PopupDialogWithCloseItem.js";
import MainData from "../../../model/MainData.js";
import PopupItemChatOnline from "./PopupItemChatOnline.js";
import SocketController from "../../../controller/SocketController.js";
import DataCommand from "../../../model/DataCommand.js";
import Language from "../../../model/Language.js";

export default class PopupChatItem extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal()
        }

        this.itemBg = new PopupDialogWithCloseItem();
        this.itemBg.event.close.add(this.chooseClose, this);
        this.itemBg.setHeight(660 * MainData.instance().scale);
        this.addChild(this.itemBg);

        let arrChat = [{
            label: Language.instance().getData("107"),
            sprite: "01"
        }, {
            label: Language.instance().getData("108"),
            sprite: "02"
        }, {
            label: Language.instance().getData("109"),
            sprite: "03"
        }, {
            label: Language.instance().getData("110"),
            sprite: "04"
        }, {
            label: Language.instance().getData("111"),
            sprite: "05"
        }, {
            label: Language.instance().getData("112"),
            sprite: "06"
        }, {
            label: Language.instance().getData("113"),
            sprite: "07"
        }, {
            label: Language.instance().getData("114"),
            sprite: "08"
        }, {
            label: Language.instance().getData("115"),
            sprite: "09"
        }]

        let beginX = 0;
        let beginY = 26 * MainData.instance().scale;
        for (let i = 0; i < arrChat.length; i++) {
            let item = new PopupItemChatOnline(arrChat[i]);
            item.event.choose_item.add(this.chooseChat, this);
            item.x = beginX;
            item.y = beginY;
            this.addChild(item);
            beginY += item.height;

            if (i === arrChat.length - 1) {
                item.hideLine();
            }
        }
    }

    chooseChat(data) {
        this.chooseClose();

        let dataChat = new SFS2X.SFSObject();
        dataChat.putUtfString("label", data.label);
        dataChat.putUtfString("sprite", data.sprite);
        SocketController.instance().sendPublicChat(DataCommand.CHAT_ONLINE_MODE, dataChat);
    }

    chooseClose() {
        this.event.close.dispatch();
    }
}