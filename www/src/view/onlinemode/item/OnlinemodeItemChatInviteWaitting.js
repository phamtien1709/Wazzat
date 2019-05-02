import BaseView from "../../BaseView.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";

export default class OnlinemodeItemChatInviteWaitting extends BaseView {
    constructor(strChat, urlAva, isVip = false) {
        super(game, null);

        this.event = {
            close: new Phaser.Signal()
        }

        this.vip = isVip;

        this.positionCreateRoom = MainData.instance().positionCreateRoom;
        if (this.vip === true) {
            this.bg = new ButtonBase(this.positionCreateRoom.chat_waitting_friend_chat_bg_vip);
            this.addChild(this.bg);
        } else {
            this.bg = new ButtonBase(this.positionCreateRoom.chat_waitting_friend_chat_bg);
            this.addChild(this.bg);
        }

        this.ava = new AvatarPlayer();
        this.ava.setSize(68, 68);
        this.ava.setAvatar(urlAva, 0);
        this.ava.x = 18;
        this.ava.y = 17;
        this.addChild(this.ava);

        if (this.vip === true) {
            this.frameVip = new Phaser.Image(game, 52, 54, 'vipSource', 'Ava_Nho');
            this.frameVip.anchor.set(0.5);
            this.frameVip.scale.set(1.01);
            this.addChild(this.frameVip);
        }

        if (this.vip === true) {
            this.txtChat = new TextBase(this.positionCreateRoom.chat_waitting_friend_chat_text_vip, strChat);
            this.txtChat.y = (this.bg.height - this.txtChat.height) / 2;
            this.addChild(this.txtChat);
        } else {
            this.txtChat = new TextBase(this.positionCreateRoom.chat_waitting_friend_chat_text, strChat);
            this.txtChat.y = (this.bg.height - this.txtChat.height) / 2;
            this.addChild(this.txtChat);
        }

        this.close = new ButtonBase(this.positionCreateRoom.chat_waitting_friend_chat_close, this.chooseClose, this);
        this.addChild(this.close);
    }

    setIcon(icon) {
        this.create(this.txtChat.x + this.txtChat.width + 10, 20, "createroom", icon);
    }

    chooseClose() {
        this.event.close.dispatch();
    }
}