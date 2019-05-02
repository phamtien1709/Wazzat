import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import SpriteBase from "../../component/SpriteBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlinemodeItemChatWaitting extends BaseView {
    constructor(strChat, id, isVip = false) {
        super(game, null);
        this.id = id;
        this.vip = isVip;
        this.event = {
            destroy: new Phaser.Signal()
        }

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        if (this.vip === true) {
            this.bgChat = new SpriteScale9Base(this.positionCreateRoom.chat_waitting_bg_chat_vip);
            this.lbChat = new TextBase(this.positionCreateRoom.chat_waitting_text_chat_vip, strChat);
        } else {
            this.bgChat = new SpriteScale9Base(this.positionCreateRoom.chat_waitting_bg_chat);
            this.lbChat = new TextBase(this.positionCreateRoom.chat_waitting_text_chat, strChat);
        }

        // console.log("this.lbChat.width : " + this.lbChat.width);
        // console.log("this.lbChat.height : " + this.lbChat.height);

        if (this.lbChat.height < 47) {
            this.bgChat.height = 67;
        } else {
            this.bgChat.height = this.lbChat.height + 20;
        }

        if (this.lbChat.width < 35) {
            this.bgChat.width = 65;
        } else {
            this.bgChat.width = this.lbChat.width + 30;
        }

        this.addChild(this.bgChat);

        this.lbChat.x = (this.bgChat.width - this.lbChat.width) / 2;
        this.lbChat.y = (this.bgChat.height - this.lbChat.height) / 2;
        this.addChild(this.lbChat);

        if (this.vip === true) {
            this.iconArrow = new SpriteBase(this.positionCreateRoom.chat_waitting_icon_arrow_vip);
            this.iconArrow.x = (this.bgChat.width - this.iconArrow.width) / 2 + 5;
            this.iconArrow.y = this.bgChat.height;
            this.addChild(this.iconArrow);
        } else {
            this.iconArrow = new SpriteBase(this.positionCreateRoom.chat_waitting_icon_arrow);
            this.iconArrow.x = (this.bgChat.width - this.iconArrow.width) / 2 + 5;
            this.iconArrow.y = this.bgChat.height;
            this.addChild(this.iconArrow);
        }

        this.idtimeout = setTimeout(() => {
            this.event.destroy.dispatch(this.id);
        }, 3500);
    }

    get width() {
        return this.bgChat.width;
    }

    get height() {
        return this.bgChat.height + this.iconArrow.height;
    }

    destroy() {
        clearTimeout(this.idtimeout);
        super.destroy();
    }
}