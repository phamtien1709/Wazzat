import BaseView from "../../BaseView.js";
import PlayerCRData from "../../../model/onlinemodecreatroom/data/PlayerCRData.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import MainData from "../../../model/MainData.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import ButtonBase from "../../component/ButtonBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import OnlineModeAvatarLoading from "./OnlineModeAvatarLoading.js";
import OnlineModeTrueFailAnswer from "./OnlineModeTrueFailAnswer.js";
import SocketController from "../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import SendOnlineModeCRKick from "../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRKick.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import OnlineModeIconChat from "./OnlineModeIconChat.js";
import DataCommand from "../../../model/DataCommand.js";
import Language from "../../../model/Language.js";

export default class OnlineModeUser extends BaseView {
    constructor() {
        super(game, null);
    }

    afterCreate() {
        this.event = {
            kick: new Phaser.Signal(),
            click_avatar: new Phaser.Signal(),
            choose_invite: new Phaser.Signal()
        }

        this.data = new PlayerCRData();
        this.ktEmpty = true;
        this.idMaster = -1;
        this.idx = 0;
        this.tween = null;
        this.ktShowKich = false;
        this.ktShowLoading = false;
        this.btnWin = null;
        this.ktDisConnect = false;
        this.ktPlay = false;

        this.iconChat = null;

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new ButtonBase({
            x: 0,
            y: 0,
            nameAtlas: "createroom",
            nameSprite: "bg_header_playlist_suggest"
        }, this.choosePlayer, this);

        this.bg.alpha = 0;
        this.addChild(this.bg);

        this.txtName = new TextBase(this.positionCreateRoom.waitting_user_txt_name, "Viet PV");
        this.txtName.setTextBounds(0, 0, 155 * MainData.instance().scale, 34 * MainData.instance().scale);
        this.addChild(this.txtName);

        this.btnKick = new ButtonWithText(this.positionCreateRoom.waitting_user_btn_kick_trai, Language.instance().getData("54"), this.chooseKick, this);
        this.btnKick.visible = false;
        this.btnKick.x = 130 * MainData.instance().scale;
        this.btnKick.y = (this.positionCreateRoom.waitting_user_btn_kick_trai.y - 28) * MainData.instance().scale;
        this.addChild(this.btnKick);

        this.btnProfile = new ButtonWithText(this.positionCreateRoom.waitting_user_btn_kick_trai, Language.instance().getData("55"), this.chooseProfile, this);
        this.btnProfile.visible = false;
        this.btnProfile.x = 130 * MainData.instance().scale;
        this.btnProfile.y = (this.positionCreateRoom.waitting_user_btn_kick_trai.y + 28) * MainData.instance().scale;
        this.addChild(this.btnProfile);


        this.btnKickPhai = new ButtonWithText(this.positionCreateRoom.waitting_user_btn_kick_phai, Language.instance().getData("54"), this.chooseKick, this);
        this.btnKickPhai.visible = false;
        this.btnKickPhai.x = -78 * MainData.instance().scale;
        this.btnKickPhai.y = (this.positionCreateRoom.waitting_user_btn_kick_phai.y - 28) * MainData.instance().scale;
        this.addChild(this.btnKickPhai);

        this.btnProfilePhai = new ButtonWithText(this.positionCreateRoom.waitting_user_btn_kick_phai, Language.instance().getData("55"), this.chooseProfile, this);
        this.btnProfilePhai.visible = false;
        this.btnProfilePhai.x = -78 * MainData.instance().scale;
        this.btnProfilePhai.y = (this.positionCreateRoom.waitting_user_btn_kick_phai.y + 28) * MainData.instance().scale;
        this.addChild(this.btnProfilePhai);

        this.ava = new AvatarPlayer();
        this.ava.setSize(150 * MainData.instance().scale, 150 * MainData.instance().scale);
        this.ava.x = 2.5 * MainData.instance().scale;
        this.ava.y = 51.5 * MainData.instance().scale;
        this.addChild(this.ava);

        this.bg.width = this.ava.width;
        this.bg.height = this.ava.height;
        this.bg.x = this.ava.x;
        this.bg.y = this.ava.y;

        this.btnWaitting = new ButtonBase(this.positionCreateRoom.waitting_user_bg_player_waiting, this.chooseWaitting, this);
        this.btnWaitting.visible = false;
        this.addChild(this.btnWaitting);

        this.khungAva = new SpriteBase(this.positionCreateRoom.waitting_user_khungava);
        this.addChild(this.khungAva);


        this.frameAva = new Phaser.Image(game, 77.5, 131, 'defaultSource', 'Ava_Vip');
        this.frameAva.anchor.set(0.5);
        this.frameAva.scale.set(1.015);
        this.frameAva.visible = false;
        this.addChild(this.frameAva);

        this.laurel = new Phaser.Image(game, 77.5, 154, 'defaultSource', 'Laurel');
        this.laurel.anchor.set(0.5);
        this.laurel.visible = false;
        this.addChild(this.laurel);

        this.loading = new OnlineModeAvatarLoading();
        this.loading.y = 49 * MainData.instance().scale;
        this.loading.visible = false;
        this.addChild(this.loading);

        this.txtSanSang = new TextBase(this.positionCreateRoom.waitting_user_txt_sansang, "");
        this.txtSanSang.setTextBounds(0, 0, 155 * MainData.instance().scale, 29 * MainData.instance().scale);
        this.addChild(this.txtSanSang);

        this.trueFailAnswer = new OnlineModeTrueFailAnswer();
        this.trueFailAnswer.setSize(330 * MainData.instance().scale, 330 * MainData.instance().scale);
        this.trueFailAnswer.x = -87 * MainData.instance().scale;
        this.trueFailAnswer.y = -35 * MainData.instance().scale;
        this.addChild(this.trueFailAnswer);

        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onPublicMessage.add(this.onPublicMessage, this);
    }

    removeEvent() {
        SocketController.instance().events.onPublicMessage.remove(this.onPublicMessage, this);
    }

    onPublicMessage(event) {
        let command = event.message;
        if (command === DataCommand.CHAT_ONLINE_MODE) {
            let sender = event.sender;
            let id = parseInt(sender.name);
            if (event.data.containsKey("typeicon") && this.data.user_id === id) {
                this.removeIconChat();
                this.iconChat = new OnlineModeIconChat(event.data.getUtfString("typeicon"));
                this.iconChat.event.call_remove.add(this.removeIconChat, this);
                this.iconChat.anchor.x = 0.5;
                this.iconChat.anchor.y = 0.5;
                this.iconChat.x = this.ava.x + this.ava.width / 2;
                this.iconChat.y = this.ava.y + this.ava.height / 2;
                game.add.tween(this.iconChat.scale).to({ x: 1.5, y: 1.5 }, 50, 'Linear', true);
                this.addChild(this.iconChat);
            }
        }
    }

    removeIconChat() {
        if (this.iconChat !== null) {
            this.removeChild(this.iconChat);
            this.iconChat.destroy();
            this.iconChat = null;
        }
    }

    setDisConnect() {
        this.ktDisConnect = true;
    }

    setPlay(ktPlay) {
        this.ktPlay = ktPlay;
        if (this.ktPlay) {
            if (this.idx % 2 === 0) {
                this.onCompleteHideTween();
            } else {
                this.onCompleteHideTweenPhai();
            }
            this.laurel.visible = false;
        }
    }
    setDefaultUser() {
        this.txtName.changeStyle({ fontSize: 25 });
        this.txtSanSang.changeStyle({ fontSize: 21, font: "Gilroy", fill: "#7B7788" });

        this.txtName.y = this.positionCreateRoom.waitting_user_txt_name.y * MainData.instance().scale;
        this.txtSanSang.y = this.positionCreateRoom.waitting_user_txt_sansang.y * MainData.instance().scale;

        if (this.ktEmpty === true) {
            this.laurel.visible = false;
        } else {
            if (this.data.vip === true) {
                this.laurel.visible = true;
            }
        }
        // this.frameAva.visible = false;

        this.removeButtonWin();
    }

    setButtonWin(type, roomBet = 0) {
        this.removeButtonWin();
        this.setGameOver();

        if (type === true) {
            this.btnWin = new ButtonWithText(this.positionCreateRoom.result_btn_money_ava_result, "+" + (this.data.diamond_change + roomBet));
            this.btnWin.scale.x = 1.3;
            this.btnWin.scale.y = 1.3;
            this.btnWinExp = new ButtonWithText(this.positionCreateRoom.result_btn_exp_ava_result_win, "+" + (this.data.exp_score));
            this.btnWinExp.scale.x = 1.3;
            this.btnWinExp.scale.y = 1.3;
            this.addChild(this.btnWinExp);
            if (this.data.vip === true) {
                this.laurel.visible = true;
            }
        } else {
            this.btnWin = new ButtonWithText(this.positionCreateRoom.result_btn_exp_ava_result_lose, "+" + this.data.exp_score);
            this.btnWin.scale.x = 1.3;
            this.btnWin.scale.y = 1.3;
        }
        this.addChild(this.btnWin);
        this.txtName.y = -30 * MainData.instance().scale;
        this.txtSanSang.y = 12 * MainData.instance().scale;
    }
    removeButtonWin() {
        if (this.btnWin !== null) {
            this.removeChild(this.btnWin);
            this.btnWin.destroy();
            this.btnWin = null;
        }

        if (this.btnWinExp !== null) {
            this.removeChild(this.btnWinExp);
        }
    }

    setScore(_score) {
        this.setTextSanSang(_score);
    }

    setTrueAnswer() {
        this.trueFailAnswer.setTrueAnswer();
    }

    setFailtAnswer() {
        this.trueFailAnswer.setFailtAnswer();
    }

    hideKhungAvatar() {
        this.khungAva.visible = false;
    }
    showKhungAvatar() {
        this.khungAva.visible = false;
    }

    setLoading(per) {
        if (this.ktShowLoading === false) {
            this.showLoading();
        }
        if (per === 100) {
            this.setTextSanSang(Language.instance().getData("57"));
            this.hideLoading();
        }
    }

    showLoading() {
        if (this.ktShowLoading === false) {
            LogConsole.log("showLoading----------");
            this.ktShowLoading = true;
            this.loading.visible = true;
            this.loading.beginLoad();
            this.hideKhungAvatar();

            this.setTextSanSang(Language.instance().getData("58") + "...");
        }
    }

    hideLoading() {
        LogConsole.log("hideLoading----------");
        this.ktShowLoading = false;
        this.loading.visible = false;
        this.loading.removetimer();
    }

    setMaster(_master) {
        this.idMaster = _master;
        this.setTextMaster();
    }

    setData(data, idx) {
        this.data = Object.assign({}, this.data, data);
        this.ktEmpty = false;
        this.ava.visible = true;
        this.khungAva.visible = true;
        this.txtName.text = this.data.user_name;
        this.ava.setAvatar(this.data.avatar, idx);
        if (this.data.isMaster === true) {
            this.setTextSanSang("");
        } else {
            if (this.data.online_mode_room_ready) {
                this.setTextSanSang(Language.instance().getData("57"));
            } else {
                this.setTextSanSang(Language.instance().getData("59"));
            }
        }
        this.btnWaitting.visible = false;
        if (this.data.vip === true) {
            this.frameAva.visible = true;
            this.laurel.visible = true;
        }
    }

    setGameOver() {
        this.txtName.changeStyle({ fontSize: 33 });
        this.txtSanSang.changeStyle({ fontSize: 32, font: "GilroyBold", fill: "#ffffff" });
    }

    setUserPlayGame() {
        this.txtSanSang.changeStyle({ fontSize: 32, font: "GilroyBold", fill: "#ffffff" });
        this.txtSanSang.y = (this.positionCreateRoom.waitting_user_txt_sansang.y - 4) * MainData.instance().scale;
    }

    setDataQuickPlay(data, idx) {
        this.data = Object.assign({}, this.data, data);
        this.ktEmpty = false;
        this.ava.visible = true;
        this.khungAva.visible = true;
        this.txtName.text = this.data.user_name;
        this.ava.setAvatar(this.data.avatar, idx);
        this.btnWaitting.visible = false;
        this.setTextSanSang("");
        if (this.data.vip === true) {
            this.frameAva.visible = true;
            this.laurel.visible = true;
        }
    }

    setTextMaster() {
        if (this.data.isMaster === true) {
            this.setTextSanSang("");
        } else {
            if (this.data.online_mode_room_ready) {
                this.setTextSanSang(Language.instance().getData("57"));
            } else {
                this.setTextSanSang(Language.instance().getData("59"));
            }
        }
    }

    setCurrentData(data) {
        this.data = Object.assign({}, this.data, data);
    }

    getData() {
        return this.data;
    }

    setEmpty() {

        this.ktEmpty = true;
        this.btnWaitting.visible = true;
        this.ava.visible = false;
        this.txtName.text = "";
        this.btnKick.visible = false;
        this.btnKick.inputEnabled = false;
        this.btnKickPhai.visible = false;
        this.btnKickPhai.inputEnabled = false;
        this.btnProfile.visible = false;
        this.btnProfile.inputEnabled = false;
        this.btnProfilePhai.visible = false;
        this.btnProfilePhai.inputEnabled = false;
        this.ktDisConnect = false;
        this.ktPlay = false;
        this.ktShowKich = false;
        this.ktShowLoading = false;

        this.setTextSanSang(Language.instance().getData("60"));
        this.hideKhungAvatar();
        this.hideLoading();
        if (this.idx % 2 === 0) {
            this.onCompleteHideTween();
        } else {
            this.onCompleteHideTweenPhai();
        }
        this.frameAva.visible = false;
        this.laurel.visible = false;
    }

    setTextSanSang(_content) {
        this.txtSanSang.text = _content;
    }

    setIdx(idx) {
        this.idx = idx;
    }

    getIdx() {
        return this.idx;
    }

    choosePlayer() {
        LogConsole.log("choosePlayer : " + this.ktPlay);
        if (this.ktPlay === false) {
            if (SocketController.instance().dataMySeft.user_id === this.data.user_id) {
                ControllScreenDialog.instance().addUserProfile(this.data.user_id);
            } else {
                console.log("SocketController.instance().dataMySeft.user_id : " + SocketController.instance().dataMySeft.user_id);
                console.log("this.idMaster : " + this.idMaster);
                if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                    this.ktShowKich = !this.ktShowKich;
                    this.event.click_avatar.dispatch(this.idx);

                    if (this.ktShowKich) {

                        if (this.idx % 2 === 0) {
                            this.setShowKichTween();
                        } else {
                            this.setShowKichTweenPhai();
                        }
                    } else {
                        if (this.idx % 2 === 0) {
                            this.setHideKichTween();
                        } else {
                            this.setHideKichTweenPhai();
                        }
                    }
                } else {
                    ControllScreenDialog.instance().addUserProfile(this.data.user_id);
                }
            }
        }

    }

    setCheckHideKichTween() {
        if (this.ktShowKich === true) {
            if (this.idx % 2 === 0) {
                this.setHideKichTween();
            } else {
                this.setHideKichTweenPhai();
            }
        }
    }

    setShowKichTween() {
        this.removeTween();
        let tweenX = 0;
        this.btnKick.x = 57 * MainData.instance().scale;
        this.btnKick.visible = true;
        this.btnKick.inputEnabled = false;
        tweenX = 130 * MainData.instance().scale;
        this.ktShowKich = true;

        this.btnProfile.x = 57 * MainData.instance().scale;
        this.btnProfile.visible = true;
        this.btnProfile.inputEnabled = false;



        this.tween = game.add.tween(this.btnKick).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween = game.add.tween(this.btnProfile).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);


        this.tween.onComplete.add(this.onCompleteShowTween, this);
    }

    setHideKichTween() {
        this.removeTween();
        let tweenX = 0;
        this.btnKick.x = 130 * MainData.instance().scale;
        this.btnKick.visible = true;
        this.btnKick.inputEnabled = false;

        this.btnProfile.x = 130 * MainData.instance().scale;
        this.btnProfile.visible = true;
        this.btnProfile.inputEnabled = false;

        tweenX = 57 * MainData.instance().scale;
        this.ktShowKich = false;

        this.tween = game.add.tween(this.btnKick).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween = game.add.tween(this.btnProfile).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween.onComplete.add(this.onCompleteHideTween, this);
    }


    setShowKichTweenPhai() {
        this.removeTween();
        let tweenX = 0;
        this.btnKickPhai.x = 2 * MainData.instance().scale;
        this.btnKickPhai.visible = true;
        this.btnKickPhai.inputEnabled = false;

        this.btnProfilePhai.x = 2 * MainData.instance().scale;
        this.btnProfilePhai.visible = true;
        this.btnProfilePhai.inputEnabled = false;

        tweenX = -78 * MainData.instance().scale;
        this.ktShowKich = true;

        this.tween = game.add.tween(this.btnKickPhai).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween = game.add.tween(this.btnProfilePhai).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween.onComplete.add(this.onCompleteShowTweenPhai, this);
    }

    setHideKichTweenPhai() {
        this.removeTween();
        let tweenX = 0;
        this.btnKickPhai.x = -78 * MainData.instance().scale;
        this.btnKickPhai.visible = true;
        this.btnKickPhai.inputEnabled = false;

        this.btnProfilePhai.x = -78 * MainData.instance().scale;
        this.btnProfilePhai.visible = true;
        this.btnProfilePhai.inputEnabled = false;

        tweenX = 2;

        this.ktShowKich = false;

        this.tween = game.add.tween(this.btnKickPhai).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween = game.add.tween(this.btnProfilePhai).to({
            x: tweenX
        }, 200, Phaser.Easing.Power1, true);

        this.tween.onComplete.add(this.onCompleteHideTweenPhai, this);
    }
    onCompleteShowTweenPhai() {

        this.btnKickPhai.visible = true;
        this.btnKickPhai.inputEnabled = true;

        this.btnProfilePhai.visible = true;
        this.btnProfilePhai.inputEnabled = true;
    }
    onCompleteHideTweenPhai() {
        this.ktShowKich = false;

        this.btnKickPhai.visible = false;
        this.btnKickPhai.inputEnabled = false;

        this.btnProfilePhai.visible = false;
        this.btnProfilePhai.inputEnabled = false;
    }

    onCompleteShowTween() {
        this.btnKick.visible = true;
        this.btnKick.inputEnabled = true;

        this.btnProfile.visible = true;
        this.btnProfile.inputEnabled = true;
    }

    onCompleteHideTween() {
        this.ktShowKich = false;
        this.btnKick.visible = false;
        this.btnKick.inputEnabled = false;

        this.btnProfile.visible = false;
        this.btnProfile.inputEnabled = false;
    }


    removeTween() {
        if (this.tween !== null) {
            this.tween.stop();
            game.tweens.remove(this.tween);
            this.tween = null;
        }
    }

    chooseWaitting() {
        this.event.choose_invite.dispatch();
    }


    chooseKick() {
        LogConsole.log("chooseKick");

        if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
            if (this.idx % 2 === 0) {
                this.onCompleteHideTween();
            } else {
                this.onCompleteHideTweenPhai();
            }
            this.btnKick.inputEnabled = false;
            this.btnKickPhai.inputEnabled = false;

            SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_KICK_USER_REQUEST,
                SendOnlineModeCRKick.begin(this.data.user_id)
            )
        }

    }

    chooseProfile() {
        if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
            if (this.idx % 2 === 0) {
                this.onCompleteHideTween();
            } else {
                this.onCompleteHideTweenPhai();
            }
            ControllScreenDialog.instance().addUserProfile(this.data.user_id);
        }

    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }

    get width() {
        return this.bg.width;
    }
    get height() {
        return this.bg.height;
    }
}