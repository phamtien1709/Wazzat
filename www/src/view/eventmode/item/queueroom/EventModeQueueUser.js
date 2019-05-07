import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";

import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";
import AvatarPlayer from "../../../base/AvatarPlayer.js";

export default class EventModeQueueUser extends BaseView {
    constructor() {
        super(game, null);

        this.data = null;
        this.iconVip = null;

        this.positionEventMode = MainData.instance().positionEventMode;

        this.txtUserName = new TextBase(this.positionEventMode.queueroom_txt_username, "");
        this.txtUserName.setTextBounds(0, 0, 89 * MainData.instance().scale, 25 * MainData.instance().scale);
        this.addChild(this.txtUserName);

        this.txtScore = new TextBase(this.positionEventMode.queueroom_txt_score, "");
        this.txtScore.setTextBounds(0, 0, 89 * MainData.instance().scale, 25 * MainData.instance().scale);
        this.addChild(this.txtScore);

        this.ava = new AvatarPlayer();
        this.ava.setSize(45 * MainData.instance().scale, 45 * MainData.instance().scale);
        this.ava.x = 22 * MainData.instance().scale;
        this.ava.y = 28 * MainData.instance().scale;
        this.addChild(this.ava);

        this.bgTopAvatar = null;
        this.bgTopAvataDie = null;
    }

    setTopAvatar(idx) {
        if (idx === 0) {
            this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_rank1);
        } else if (idx === 1) {
            this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_rank2);
        } else if (idx === 2) {
            this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_rank3);
        } else {
            this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_rankn);
        }
        this.addChild(this.bgTopAvatar);
    }

    setTopAvatarMe() {
        this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_rankme);
        this.addChild(this.bgTopAvatar);
    }

    setTopAvatarDie() {
        if (this.bgTopAvataDie === null) {
            this.bgTopAvatar = new SpriteBase(this.positionEventMode.queueroom_icon_maskdie);
            this.addChild(this.bgTopAvatar);
        } else {
            this.showTopAvatarDie();
        }
    }
    showTopAvatarDie() {
        this.bgTopAvatar.visible = true;
    }
    hideTopAvatarDie() {
        this.bgTopAvatar.visible = false;
    }
    hideName() {
        this.txtUserName.visible = false;
    }
    showName() {
        this.txtUserName.visible = true;
    }

    getData() {
        return this.data;
    }

    setDataRank(data, idx) {
        if (this.data === null) {
            this.ava.setAvatar(data.avatar, idx);
            this.txtUserName.text = this.formatName(data.user_name, 10);
            this.txtScore.text = data.achieved;
        } else {
            if (this.data.user_id !== data.user_id) {
                this.ava.setAvatar(data.avatar, idx);
            }

            if (this.data.user_name !== data.user_name) {
                this.txtUserName.text = this.formatName(data.user_name, 10);
            }

            if (this.data.achieved !== data.achieved) {
                this.txtScore.text = data.achieved;
            }
        }
        if (this.data !== null) {
            if (this.data.vip === true) {
                if (this.iconVip === null) {
                    this.iconVip = new Phaser.Sprite(game, 29, 61, 'vipSource', 'Label_VIP');
                    this.iconVip.scale.set(0.6)
                    this.addChild(this.iconVip);
                } else {
                    this.iconVip.visible = true;
                }
            } else {
                if (this.iconVip !== null) {
                    this.iconVip.visible = false;
                }
            }
        }
        this.data = data;
    }

    setData(data, idx) {
        this.data = data;
        this.txtUserName.text = this.formatName(this.data.user_name, 10);
        this.ava.setAvatar(data.avatar, idx);
        if (this.data.vip === true) {
            if (this.iconVip === null) {
                this.iconVip = new Phaser.Sprite(game, 29, 61, 'vipSource', 'Label_VIP');
                this.iconVip.scale.set(0.6)
                this.addChild(this.iconVip);
            } else {
                this.iconVip.visible = true;
            }
        } else {
            if (this.iconVip !== null) {
                this.iconVip.visible = false;
            }
        }
    }

    updateData(data) {
        this.data = data;
    }

    setNameTop() {
        this.txtUserName.y = 0;
    }
    setNameBot() {
        this.txtUserName.y = 79 * MainData.instance().scale;
    }

}