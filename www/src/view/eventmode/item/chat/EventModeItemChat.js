import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";

import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";
import AvatarPlayer from "../../../base/AvatarPlayer.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import KeyBoard from "../../../component/KeyBoard.js";

export default class EventModeItemChat extends BaseView {
    constructor(dataChat = null) {
        super(game, null);

        this.data = dataChat;
        //
        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));

        this.bgVip = new Phaser.Image(game, 0, 0, 'vipSource', 'Vip_BG');
        this.addChild(this.bgVip);

        this.ava = new AvatarPlayer();
        this.ava.setSize(47 * MainData.instance().scale, 47 * MainData.instance().scale);
        this.ava.x = 35 * MainData.instance().scale;
        this.ava.y = 10 * MainData.instance().scale;
        this.addChild(this.ava);

        this.btnMaskAva = new Phaser.Button(game, this.ava.x, this.ava.y, null, this.chooseAva, this)
        this.btnMaskAva.width = this.ava.width;
        this.btnMaskAva.height = this.ava.height;
        this.addChild(this.btnMaskAva);

        this.txtChat = new TextBase(this.positionEventMode.queueroom_text_chat_vip, "");
        this.txtChat.setTextBounds(0, 0, 450 * MainData.instance().scale, 55 * MainData.instance().scale);
        this.addChild(this.txtChat);


        this.txtChatStr = new TextBase(this.positionEventMode.queueroom_text_chat_vip_str, "");
        this.txtChatStr.setTextBounds(0, 0, 450 * MainData.instance().scale, 55 * MainData.instance().scale);
        this.addChild(this.txtChatStr);

        this.txtTime = new TextBase(this.positionEventMode.queueroom_text_chat_time_vip, "");
        this.txtTime.setTextBounds(0, 0, 518 * MainData.instance().scale, 55 * MainData.instance().scale);
        this.addChild(this.txtTime)

        this.line = new SpriteBase(this.positionEventMode.item_ranking_line_space);
        this.line.y = 73 * MainData.instance().scale;
        this.addChild(this.line);

        this.frameAva = new Phaser.Image(game, 58, 35, 'vipSource', 'Ava_Nho');
        this.frameAva.anchor.set(0.5);
        this.frameAva.scale.set(0.7);
        this.addChild(this.frameAva);

        this.changeData(this.data);
    }

    changeData(data, idx = 0) {
        this.data = data;
        let str = "";
        if (this.data !== null) {
            str = this.data.message;
        }

        let arrString = str.split(" ");
        str = "";
        for (let i = 0; i < arrString.length; i++) {
            if (MainData.instance().silentchat.hasOwnProperty(arrString[i])) {
                str += " " + arrString[i].replace(MainData.instance().silentchat[arrString[i]], "***");
            } else {
                str += " " + arrString[i];
            }
        }

        if (this.data.vip === true) {
            this.bgVip.revive();            //
            this.ava.x = 35 * MainData.instance().scale;
            this.ava.y = 10 * MainData.instance().scale;

            this.txtChat.text = this.data.user_name + ": ";
            this.txtChat.addColor("#ffffff", 0);
            this.txtChatStr.text = str
            this.txtChatStr.x = this.txtChat.x + this.txtChat.width + 5;

            this.frameAva.revive();
        } else {
            this.bgVip.kill();
            this.ava.x = 35 * MainData.instance().scale;
            this.ava.y = 16 * MainData.instance().scale;

            this.txtChat.text = this.data.user_name + ": " + str;
            this.txtChat.addColor("#ffa33a", 0);
            this.txtChat.addColor("#ffffff", this.data.user_name.length);

            this.txtChatStr.text = "";

            this.frameAva.kill();
        }

        this.setData(idx);
    }


    chooseAva() {
        KeyBoard.instance().hide();
        ControllScreenDialog.instance().addUserProfile(this.data.user_id);
    }

    setData(idx) {
        // this.data = data;

        // console.log(this.data);

        this.ava.setAvatar(this.data.avatar, idx);


        let dateStart = new Date(this.data.sent_at);
        let hourStart = dateStart.getHours();
        let minuteStart = dateStart.getMinutes();
        let strHour = "00";
        let strMinute = "00";
        if (hourStart > 9) {
            strHour = hourStart;
        } else {
            strHour = "0" + hourStart;
        }

        if (minuteStart > 9) {
            strMinute = minuteStart;
        } else {
            strMinute = "0" + minuteStart;
        }

        this.txtTime.text = strHour + ":" + strMinute;

    }

    get height() {
        return 68 * MainData.instance().scale;
    }
}