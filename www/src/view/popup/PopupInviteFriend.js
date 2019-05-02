import BaseView from "../BaseView.js";
import PopupInviteFriendItem from "./item/PopupInviteFriendItem.js";
import MainData from "../../model/MainData.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import ControllInvitation from "../../controller/ControllInvitation.js";

export default class PopupInviteFriend extends BaseView {
    constructor(invitation, cmd = false) {
        super(game, null);
        this.invitation = invitation;
        this.cmd = cmd;
        this.event = {
            OK: new Phaser.Signal(),
            CANCLE: new Phaser.Signal(),
            OK_CMD: new Phaser.Signal(),
            CANCLE_CMD: new Phaser.Signal()
        }
        this.bg = new Phaser.Button(game, 0, 0, 'screen-dim');
        this.addChild(this.bg);

        this.popup = new PopupInviteFriendItem();
        this.popup.event.OK.add(this.chooseOk, this);
        this.popup.event.CANCLE.add(this.chooseCancle, this);
        this.popup.x = 35 * MainData.instance().scale;
        this.popup.y = 266 * MainData.instance().scale;
        this.addChild(this.popup);

        this.popup.y = game.height + 237 * MainData.instance().scale;
        this.tweenItemPopup(this.popup, game.height - 870 * MainData.instance().scale);

        if (cmd === false) {
            this.setContent(invitation.inviter.getVariable('user_name').value, invitation.params.getInt("room_id"));
            this.popup.setAvatar(invitation.inviter.getVariable('avatar').value, invitation.getBool('inviter_vip'));
            this.popup.setMucCuoc(invitation.params.getInt("bet_place"));
        } else {
            this.setContent(invitation.getUtfString('inviter_name'), invitation.getInt("room_id"));
            this.popup.setAvatar(invitation.getUtfString('inviter_avatar'), invitation.getBool('inviter_vip'));
            this.popup.setMucCuoc(invitation.getInt("bet_place"));
        }

        ControllSoundFx.instance().playSound(ControllSoundFx.popupinviteroom);

    }

    setContent(tenchuphong, idphong) {
        this.popup.setContent(tenchuphong, idphong);
    }

    chooseOk() {
        if (this.cmd) {
            this.event.OK_CMD.dispatch(this.invitation.getInt('room_id'), this.invitation.getInt("bet_place"))
        } else {
            this.event.OK.dispatch(this.invitation);
        }
    }

    chooseCancle() {
        if (this.cmd) {
            ControllInvitation.instance().addBlock(this.invitation.getInt("inviter_id"));
            this.event.CANCLE_CMD.dispatch();
        } else {
            this.event.CANCLE.dispatch(this.invitation);
        }
    }

}