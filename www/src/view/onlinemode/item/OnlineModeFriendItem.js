import BaseView from "../../BaseView.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import MainData from "../../../model/MainData.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import DataFriend from "../../../model/user/DataFriend.js";
import Language from "../../../model/Language.js";

export default class OnlineModeFriendItem extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.positionCreateRoom = MainData.instance().positionDefaultSource;

        this.event = {
            invite: new Phaser.Signal()
        }

        this.data = new DataFriend();

        this.ava = new AvatarPlayer();
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.chooseInfo, this);
        this.ava.setSize(68 * MainData.instance().scale, 68 * MainData.instance().scale);
        this.ava.x = 36 * MainData.instance().scale;
        this.ava.y = 27 * MainData.instance().scale;

        this.addChild(this.ava);

        this.txtName = new TextBase(this.positionCreateRoom.listfriend_txt_name, "");
        this.addChild(this.txtName);

        this.btnInvite = new ButtonWithText(this.positionCreateRoom.listfriend_btn_invite, Language.instance().getData("47"), this.chooseInvite, this);
        this.addChild(this.btnInvite);

        this.inviteDone = new SpriteBase(this.positionCreateRoom.friend_invite_done);
        this.inviteDone.x = this.btnInvite.x + (this.btnInvite.width - this.inviteDone.width) / 2;
        this.inviteDone.y = this.btnInvite.y + (this.btnInvite.height - this.inviteDone.height) / 2;
        this.inviteDone.kill();
        this.addChild(this.inviteDone);

        this.frameAva = new Phaser.Image(game, 70, 65, 'vipSource', 'Ava_Opponents_Nho');
        this.frameAva.anchor.set(0.5);
        this.frameAva.visible = false;
        this.addChild(this.frameAva);

        this.iconOnline = new SpriteBase(this.positionCreateRoom.listfriend_icon_online);
        this.iconOnline.visible = false;
        this.addChild(this.iconOnline);

        this.iconOffline = new SpriteBase(this.positionCreateRoom.listfriend_icon_offline);
        this.addChild(this.iconOffline);


        this.line = new SpriteBase(this.positionCreateRoom.listfriend_bg_line);
        this.addChild(this.line);
    }

    chooseInfo(sprite, pointer, isOver) {
        if (isOver) {
            ControllScreenDialog.instance().addUserProfile(this.data.id);
        }
    }

    get width() {
        return game.width;
    }
    get height() {
        return 110 * MainData.instance().scale;
    }

    setData(buddy, idx, ktFriend = false) {

        LogConsole.log(buddy);

        this.data = Object.assign({}, this.data, buddy);

        this.txtName.text = this.data.user_name;

        if (ktFriend === true) {
            if (this.data.is_online === true) {
                this.iconOnline.visible = true;
                this.iconOffline.visible = false;
            } else {
                this.iconOnline.visible = false;
                this.iconOffline.visible = true;
            }
            this.btnInvite.visible = false;
        } else {
            if (this.data.is_online === true) {
                this.iconOnline.visible = true;
                this.iconOffline.visible = false;
                this.btnInvite.visible = true;
            } else {
                this.iconOnline.visible = false;
                this.iconOffline.visible = true;
                this.btnInvite.visible = false;
            }
        }

        this.ava.setAvatar(this.data.avatar, idx);

        this.x = game.width;

        if (this.data.vip === true) {
            this.frameAva.visible = true;
        }

        game.add.tween(this).to({
            x: 0
        }, 150, Phaser.Easing.Power1, true, 80 * (idx + 1));

    }

    chooseInvite() {
        LogConsole.log("chooseInvite");
        this.btnInvite.kill();
        this.btnInvite.inputEnabled = false;
        this.inviteDone.revive();
        this.event.invite.dispatch(this.data);
    }

}