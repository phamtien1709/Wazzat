import BaseView from "../../../BaseView.js";
import OnlineModeQuickChatItem from "./OnlineModeQuickChatItem.js";
import SocketController from "../../../../controller/SocketController.js";
import DataCommand from "../../../../model/DataCommand.js";
import Language from "../../../../model/Language.js";

export default class OnlineModeChooseQuickChat extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal(),
            show_chat: new Phaser.Signal()
        }

        this.bg = this.create(0, 0, "createroom", "White_Tab");
        this.bg.width = game.width;
        this.bg.height = 545;

        this.bgSearch = this.create(0, 0, "createroom", "Tab_Chat");

        this.bgBoxChat = game.make.button(21, 20, "createroom", this.chooseChat, this, "Box_Chat", "Box_Chat", "Box_Chat", "Box_Chat");
        this.addChild(this.bgBoxChat);
        this.textChat = game.add.text(32, 50, Language.instance().getData("82"), {
            fill: "#333333",
            font: "Gilroy",
            fontSize: 23
        }, this);
        this.addChild(this.textChat);

        this.btnClose = game.make.button(0, 20, "createroom", this.chooseClose, this, "chatquickX", "chatquickX", "chatquickX", "chatquickX");
        this.btnClose.x = game.width - this.btnClose.width - 20;
        this.addChild(this.btnClose);

        this.btnChatText = game.make.button(0, 30, "createroom", this.chooseChat, this, "chatquickButton_Text", "chatquickButton_Text", "chatquickButton_Text", "chatquickButton_Text");
        this.btnChatText.x = this.btnClose.x - this.btnChatText.width - 30;
        this.addChild(this.btnChatText);

        let arrData = [
            { label: Language.instance().getData("83"), icon: "chatquick1" },
            { label: Language.instance().getData("84"), icon: "chatquick2" },
            { label: Language.instance().getData("85"), icon: "chatquick3" },
            { label: Language.instance().getData("86"), icon: "chatquick4" },
            { label: Language.instance().getData("87"), icon: "chatquick5" },
            { label: Language.instance().getData("88"), icon: "chatquick6" },
            { label: Language.instance().getData("89"), icon: "chatquick7" },
            { label: Language.instance().getData("90"), icon: "chatquick8" },
            { label: Language.instance().getData("91"), icon: "chatquick9" },
            { label: Language.instance().getData("92"), icon: "chatquick10" }
        ]

        let beginX = 0;
        let beginY = 120;
        let idx = 0;
        for (let i = 0; i < arrData.length; i++) {
            idx++;
            let itemChat = new OnlineModeQuickChatItem(arrData[i].label, arrData[i].icon);
            itemChat.event.choose_item.add(this.sendText, this);
            itemChat.x = beginX;
            itemChat.y = beginY;
            if (idx % 2 === 0) {
                beginX = 0;
                beginY += 85;
                this.create(beginX, beginY, "createroom", "chatquickLine_01");
            } else {
                beginX += 320;
                this.create(beginX, beginY + 20, "createroom", "chatquickLine_02");
            }
            this.addChild(itemChat);
        }
    }

    sendText(label, icon) {
        console.log("label : " + label);
        console.log("icon : " + icon);


        let dataChat = new SFS2X.SFSObject();
        dataChat.putUtfString("label", label);
        dataChat.putUtfString("sprite", icon);
        dataChat.putUtfString("atlas", "createroom");
        SocketController.instance().sendPublicChat(DataCommand.CHAT_ONLINE_MODE, dataChat);

        this.chooseClose();
    }

    chooseClose() {
        this.event.close.dispatch();
    }

    chooseChat() {
        this.event.show_chat.dispatch();
    }
}