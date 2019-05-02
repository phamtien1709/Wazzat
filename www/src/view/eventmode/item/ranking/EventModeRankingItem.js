import BaseView from "../../../BaseView.js";

import TextBase from "../../../component/TextBase.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import EventModeRoomWinItem from "../selectroom/EventModeRoomWinItem.js";
import MainData from "../../../../model/MainData.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import AvatarPlayer from "../../../base/AvatarPlayer.js";


export default class EventModeRankingItem extends BaseView {
    constructor(data, idx, dataReward = null, isMe = false) {
        super(game, null);
        this.idx = idx;
        this.data = data;
        this.isMe = isMe;
        this._width = 140 * MainData.instance().scale;
        this.positionEventMode = MainData.instance().positionEventMode;

        this.ava = new AvatarPlayer();
        this.ava.setSize(64 * MainData.instance().scale, 64 * MainData.instance().scale);
        this.ava.x = 137 * MainData.instance().scale;
        this.ava.y = 41 * MainData.instance().scale;
        this.addChild(this.ava);

        this.btnMaskAva = new Phaser.Button(game, this.ava.x, this.ava.y, null, this.chooseAva, this)
        this.btnMaskAva.width = this.ava.width;
        this.btnMaskAva.height = this.ava.height;
        this.addChild(this.btnMaskAva);

        this.line = new SpriteBase(this.positionEventMode.item_ranking_line_space);
        this.addChild(this.line);

        if (idx === 0) {
            this.bgTopAvata = new SpriteBase(this.positionEventMode.item_ranking_avatar_top1);
        } else if (idx === 1) {
            this.bgTopAvata = new SpriteBase(this.positionEventMode.item_ranking_avatar_top2);
        } else if (idx === 2) {
            this.bgTopAvata = new SpriteBase(this.positionEventMode.item_ranking_avatar_top3);
        } else {
            this.ava.x = 137 * MainData.instance().scale;
            this.ava.y = 26 * MainData.instance().scale;
            this.bgTopAvata = new SpriteBase(this.positionEventMode.item_ranking_avatar_top4);
            this._width = 130 * MainData.instance().scale;
            this.line.y = this._width - 2;
        }
        this.addChild(this.bgTopAvata);


        this.iconTrophy = new SpriteBase(this.positionEventMode.item_ranking_trophy_item);
        this.addChild(this.iconTrophy);

        if (idx < 3) {

            this.txtStt = new TextBase(this.positionEventMode.item_ranking_text_top123, (idx + 1));
            this.txtStt.setTextBounds(0, 0, 28 * MainData.instance().scale, 27 * MainData.instance().scale);
            this.txtUserName = new TextBase(this.positionEventMode.item_ranking_text_user_name123, this.formatName(data.user_name, 15));
            this.txtScore = new TextBase(this.positionEventMode.item_ranking_text_score123, data.achieved);

        } else {
            this.iconTrophy.y = 43;
            this.txtStt = new TextBase(this.positionEventMode.item_ranking_text_top4, (idx + 1));
            this.txtUserName = new TextBase(this.positionEventMode.item_ranking_text_user_name4, this.formatName(data.user_name, 15));
            this.txtScore = new ButtonWithText(this.positionEventMode.item_ranking_text_score4, data.achieved);
        }

        this.addChild(this.txtScore);
        this.addChild(this.txtStt);
        this.addChild(this.txtUserName);

        this.iconVip = new Phaser.Sprite(game, 143, 88, 'vipSource', 'Label_VIP');
        this.iconVip.visible = false;
        this.addChild(this.iconVip);
        if (idx > 2) {
            this.iconVip.y = 74
        }

        if (isMe) {
            this.ava.setAvatar(data.avatar, 0);
        } else {
            this.ava.setAvatar(data.avatar, idx);
        }

        if (data.vip === true) {
            this.iconVip.visible = true;
        }
        if (dataReward === null) {

        } else {
            this.dataWin = new EventModeRoomWinItem(dataReward, true);
            // this.dataWin.hideBg();
            this.dataWin.x = this.width - this.dataWin.width - 12 * MainData.instance().scale;
            this.dataWin.y = (this.height - this.dataWin.height) / 2;
            this.addChild(this.dataWin);
        }

    }

    chooseAva() {
        console.log("clickAva");
        console.log(this.data)
        ControllScreenDialog.instance().addUserProfile(this.data.user_id);
    }

    hideLine() {
        this.line.visible = false;
    }

    beginTween(idx = 0) {
        /*
        if (this.isMe === true) {
            this.x = 0;
        } else {
            if (idx < 8) {
                this.x = game.width;
                game.add.tween(this).to({
                    x: 0
                }, 150, Phaser.Easing.Power1, true, 80 * (this.idx + 1));
            } else {
                this.x = 0;
            }
        }*/
        this.x = 0;
    }

    get width() {
        return game.width;
    }
    get height() {
        return this._width;
    }
}