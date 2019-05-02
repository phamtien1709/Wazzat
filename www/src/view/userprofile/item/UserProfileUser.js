import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import SpriteBase from "../../component/SpriteBase.js";
import SocketController from "../../../controller/SocketController.js";
import UserProfileCommand from "../../../model/userprofile/datafield/UserProfileCommand.js";
import SendUserFriendRequest from "../../../model/userprofile/server/senddata/SendUserFriendRequest.js";
import User from "../../../model/userprofile/data/User.js";
import UserProfileHeader from "./UserProfileHeader.js";
import Common from "../../../common/Common.js";
import ButtonBase from "../../component/ButtonBase.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import TurnBaseScreen from "../../turnBase/TurnBaseScreen.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import LevelExpCurrent from "../../base/LevelExpCurrent.js";
import MainData from "../../../model/MainData.js";
import IronSource from "../../../IronSource.js";
import ControllDialog from "../../ControllDialog.js";
import EventGame from "../../../controller/EventGame.js";
import BigAvatar from "./BigAvatar.js";
import DataUser from "../../../model/user/DataUser.js";
import DataFriend from "../../../model/user/DataFriend.js";
import Language from "../../../model/Language.js";

export default class UserProfileUser extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal(),
            friend_status_update: new Phaser.Signal()
        }
        this.isMe = false;
        this.heightGame = 474 * window.GameConfig.RESIZE;
        this.user = new User();
        this.game_status = 0;

        this.positionUserProfile = MainData.instance().positionUserProfile;

        this.header = new UserProfileHeader();
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        this.txtOnline = new TextBase(this.positionUserProfile.profile_txt_online, "");
        this.txtOnline.setTextBounds(0, 0, game.width, 27 * window.GameConfig.RESIZE);
        this.addChild(this.txtOnline);

        this.bgAva = new SpriteBase(this.positionUserProfile.profile_bg_avatar);
        this.addChild(this.bgAva);
        //
        this.clickBigAva = false;
        this.ava = new AvatarPlayer();
        this.ava.setSize(148 * window.GameConfig.RESIZE, 148 * window.GameConfig.RESIZE);
        this.ava.inputEnabled = true;
        this.ava.events.onInputUp.add(this.onClickAva, this);
        this.ava.x = 246 * window.GameConfig.RESIZE;
        this.ava.y = 43 * window.GameConfig.RESIZE;
        this.addChild(this.ava);

        this.bgAvaVip = new SpriteBase(this.positionUserProfile.profile_bg_avatar_vip);
        this.bgAvaVip.visible = false;
        this.addChild(this.bgAvaVip);

        this.txtUserName = new TextBase(this.positionUserProfile.profile_txt_username, "MrViet");
        this.txtUserName.setTextBounds(0, 0, game.width, 35 * window.GameConfig.RESIZE);
        this.addChild(this.txtUserName);

        this.txtLevel = new TextBase(this.positionUserProfile.profile_txt_level, "Level 12- abc");
        this.txtLevel.setTextBounds(0, 0, game.width, 27 * window.GameConfig.RESIZE);
        this.addChild(this.txtLevel);
        this.addEventExtension();
        //this.addMe();
    }

    onClickAva() {
        this.clickBigAva = true;
        this.bigAvatar = new BigAvatar(this.user.avatar);
        this.bigAvatar.event.back.add(this.backBigAva, this);
        ControllDialog.instance().addChild(this.bigAvatar);
    }

    backBigAva() {
        this.clickBigAva = false;
    }

    chooseBack() {
        if (this.clickBigAva == false) {
            this.event.back.dispatch();
        }
    }
    get width() {
        return game.width;
    }
    get height() {
        return this.heightGame;
    }

    addOtherUser(user, game_status, friend_status) {

        /*
        friend_status :
        NO_FRIEND
        FRIEND
        PENDING_1_2
        PENDING_2_1*/

        LogConsole.log("friend_status");
        LogConsole.log(user);

        this.txtDescription = new TextBase(this.positionUserProfile.profile_txt_description, this.user.description);
        this.txtDescription.setTextBounds(0, 0, game.width, 30 * window.GameConfig.RESIZE);
        this.addChild(this.txtDescription);

        if (friend_status === "NO_FRIEND") {
            this.btnSendMessage = new ButtonBase(this.positionUserProfile.profile_btn_nhantin, this.chooseSendMessage, this);
            this.addChild(this.btnSendMessage);
            //
            this.btnInviteFriend = new ButtonWithText(this.positionUserProfile.profile_btn_ketban, Language.instance().getData("167"), this.chooseInviteFriend, this);
            this.addChild(this.btnInviteFriend);

            this.btnDuel = new ButtonWithText(this.positionUserProfile.profile_btn_thachdau, Language.instance().getData("168"), this.chooseDuel, this);
            this.addChild(this.btnDuel);

            if (user.vip === true) {
                this.btnInviteFriend.y = (this.positionUserProfile.profile_btn_ketban.y + 12) * window.GameConfig.RESIZE;
                this.btnDuel.y = (this.positionUserProfile.profile_btn_thachdau.y + 12) * window.GameConfig.RESIZE;
                this.txtDescription.y = (this.positionUserProfile.profile_txt_description.y + 12) * window.GameConfig.RESIZE;
                this.heightGame = 575 * window.GameConfig.RESIZE;
            } else {
                this.btnInviteFriend.y = this.positionUserProfile.profile_btn_ketban.y * window.GameConfig.RESIZE;
                this.btnDuel.y = this.positionUserProfile.profile_btn_thachdau.y * window.GameConfig.RESIZE;
                this.txtDescription.y = this.positionUserProfile.profile_txt_description.y * window.GameConfig.RESIZE;
                this.heightGame = 563 * window.GameConfig.RESIZE;
            }

        } else {
            this.btnSendMessage = new ButtonBase(this.positionUserProfile.profile_btn_nhantin, this.chooseSendMessage, this);
            this.addChild(this.btnSendMessage);
            //
            this.btnDuel = new ButtonWithText(this.positionUserProfile.profile_btn_thachdau_friend,
                Language.instance().getData("168"), this.chooseDuel, this);
            this.addChild(this.btnDuel);
            if (user.vip === true) {
                this.btnDuel.y = (this.positionUserProfile.profile_btn_thachdau_friend.y + 12) * window.GameConfig.RESIZE;
                this.btnSendMessage.y = (this.positionUserProfile.profile_btn_nhantin_friend.y + 12) * window.GameConfig.RESIZE;
                this.txtDescription.y = (this.positionUserProfile.profile_txt_description.y + 12) * window.GameConfig.RESIZE;
                this.heightGame = 474 * window.GameConfig.RESIZE;
            } else {
                this.btnDuel.y = this.positionUserProfile.profile_btn_thachdau_friend.y * window.GameConfig.RESIZE;
                this.btnSendMessage.y = this.positionUserProfile.profile_btn_nhantin_friend.y * window.GameConfig.RESIZE;
                this.txtDescription.y = this.positionUserProfile.profile_txt_description.y * window.GameConfig.RESIZE;
                this.heightGame = 462 * window.GameConfig.RESIZE;
            }
            if (friend_status === "PENDING_THEM") {
                this.txtWarning = new TextBase(this.positionUserProfile.profile_txt_warning_pending_them, "");
                if (Common.getGender(user) == "MALE") {
                    this.txtWarning.setText(Language.instance().getData("169") + ' ' + user.user_name);
                } else {
                    this.txtWarning.setText(Language.instance().getData("169") + ' ' + user.user_name);
                }
                this.txtWarning.setTextBounds(0, 0, game.width, 30 * window.GameConfig.RESIZE);
                this.addChild(this.txtWarning)
                this.txtWarning.addColor("#93909d", 0);
                this.txtWarning.addFontStyle('italic', 0);

                if (user.vip === true) {
                    this.txtWarning.y = (this.positionUserProfile.profile_txt_warning_pending_them.y + 12) * window.GameConfig.RESIZE;
                    this.heightGame = 515 * window.GameConfig.RESIZE;
                } else {
                    this.txtWarning.y = (this.positionUserProfile.profile_txt_warning_pending_them.y) * window.GameConfig.RESIZE;
                    this.heightGame = 504 * window.GameConfig.RESIZE;
                }
            }

            if (friend_status === "FRIEND") {
                this.hideUnfriend = true;
                this.btnHuyKetBan = new ButtonWithText(this.positionUserProfile.profile_btn_huy_ket_ban, Language.instance().getData("170"), this.chooseRemoveFriend, this);
                this.addChild(this.btnHuyKetBan);
                this.btnHuyKetBan.kill();
                this.btnViewMore = new ButtonBase(this.positionUserProfile.profile_btn_view_more, this.onClickViewMore, this);
                this.addChild(this.btnViewMore);
                this.btnSendMessage.revive();
                // this.onClickViewMore();
            }

            if (friend_status === "PENDING_YOU") {
                this.btnDongYFriend = new ButtonWithText(this.positionUserProfile.profile_btn_dongy_friend, Language.instance().getData("102"), this.chooseOkFriend, this);
                this.addChild(this.btnDongYFriend);
                //
                this.btnHuyBoFriend = new ButtonWithText(this.positionUserProfile.profile_btn_huybo_friend, Language.instance().getData("171"), this.chooseCancle, this);
                this.addChild(this.btnHuyBoFriend);

                this.txtWarning = new TextBase(this.positionUserProfile.profile_txt_warning_pending_you, this.user.user_name + " " + Language.instance().getData("172"));
                this.txtWarning.setTextBounds(0, 0, game.width, 30 * window.GameConfig.RESIZE);
                this.txtWarning.addColor("#ffa33a", 0);
                this.txtWarning.addColor("#93909d", this.user.user_name.length);
                this.txtWarning.addFontStyle('italic', this.user.user_name.length)
                this.addChild(this.txtWarning)

                if (user.vip === true) {
                    this.btnDongYFriend.y = (this.positionUserProfile.profile_btn_dongy_friend.y + 12) * window.GameConfig.RESIZE;
                    this.btnHuyBoFriend.y = (this.positionUserProfile.profile_btn_huybo_friend.y + 12) * window.GameConfig.RESIZE;
                    this.txtWarning.y = (this.positionUserProfile.profile_txt_warning_pending_you.y + 12) * window.GameConfig.RESIZE;
                    this.heightGame = 622 * window.GameConfig.RESIZE;
                } else {
                    this.btnDongYFriend.y = (this.positionUserProfile.profile_btn_dongy_friend.y) * window.GameConfig.RESIZE;
                    this.btnHuyBoFriend.y = (this.positionUserProfile.profile_btn_huybo_friend.y) * window.GameConfig.RESIZE;
                    this.txtWarning.y = (this.positionUserProfile.profile_txt_warning_pending_you.y) * window.GameConfig.RESIZE;
                    this.heightGame = 610 * window.GameConfig.RESIZE;
                }

            }

        }
        if (game_status === "NO_GAME" || game_status === "ARCHIVED") {
            /*
             * 0. No have turn
             * 1. Your turn
             * 2. Their turn
             * 3. Archived
             */
            this.btnDuel.setText(Language.instance().getData("168"));
        } else if (game_status === "THEIR_TURN") {
            this.btnDuel.setText(Language.instance().getData("173"));
            this.btnDuel.inputEnabled = false;
        } else if (game_status === "YOUR_TURN") {
            this.btnDuel.setText(Language.instance().getData("174"));
        }
    }

    onClickViewMore() {
        if (this.hideUnfriend == true) {
            this.btnHuyKetBan.revive();
            this.hideUnfriend = false;
        } else {
            this.btnHuyKetBan.kill();
            this.hideUnfriend = true;
        }
    }

    setTextVip() {
        this.txtUserName.y = 232 * window.GameConfig.RESIZE;
        this.txtLevel.y = 267 * window.GameConfig.RESIZE;
    }

    //
    addEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
        EventGame.instance().event.backButton.add(this.chooseBack, this);
    }
    removeEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
    }

    addMe(user) {
        // console.log('user');
        // console.log(user);
        this.btnMic = new ButtonWithText(this.positionUserProfile.profile_btn_mic, SocketController.instance().dataMySeft.support_item);
        this.addChild(this.btnMic);

        this.btnDiamond = new ButtonWithText(this.positionUserProfile.profile_btn_diamond, SocketController.instance().dataMySeft.diamond);
        this.addChild(this.btnDiamond);

        this.btnTicket = new ButtonWithText(this.positionUserProfile.profile_btn_ticket, SocketController.instance().dataMySeft.ticket);
        this.addChild(this.btnTicket);

        this.txtDescription = new TextBase(this.positionUserProfile.profile_txt_description_me, this.user.description);
        // this.txtDescription.setTextBounds(0, 0, game.width, 30 * window.GameConfig.RESIZE);
        this.txtDescription.anchor.set(0.5);
        this.txtDescription.lineSpacing = -5;
        this.addChild(this.txtDescription);

        this.heightGame = 421 * window.GameConfig.RESIZE;
        this.hideSetting = true;


        this.btnSetting = new ButtonWithText(this.positionUserProfile.profile_btn_huy_ket_ban, Language.instance().getData("175"), this.chooseSetting, this);
        this.addChild(this.btnSetting);
        this.btnSetting.kill();

        this.btnViewSetting = new ButtonBase(this.positionUserProfile.profile_btn_view_more, this.onClickViewSetting, this);
        if (SocketController.instance().dataMySeft.is_playing_game === false) {
            this.addChild(this.btnViewSetting);
        }
        this.levelExpCurrent = new LevelExpCurrent(this.current_level.experience_score, this.next_level.experience_score, this.user.experience_score);
        this.addChild(this.levelExpCurrent);
        //
        if (user.vip == true) {
            this.btnDiamond.y += 20;
            this.btnTicket.y += 20;
            this.btnMic.y += 20;
            this.levelExpCurrent.y += 20;
            this.txtDescription.y += 20;
        }
    }

    onClickViewSetting() {
        if (this.hideSetting == true) {
            this.btnSetting.revive();
            this.hideSetting = false;
        } else {
            this.btnSetting.kill();
            this.hideSetting = true;
        }
    }

    chooseSetting() {
        this.btnSetting.kill();
        this.hideSetting = true;
        ControllScreenDialog.instance().addSettingGame();
    }

    setData(user, game_status, friend_status, current_level, next_level) {
        //THEIR_TURN FRIEND
        //YOUR_TURN FRIEND
        //THEIR_TURN NO_FRIEND
        //THEIR_TURN PENDING_THEM
        //NO_GAME NO_FRIEND
        LogConsole.log(game_status, friend_status);
        this.game_status = game_status;
        this.friend_status = friend_status;

        this.user = Object.assign({}, this.user, user);
        // console.log(this.user);

        this.txtUserName.text = user.user_name;
        this.txtLevel.text = Language.instance().getData("176") + " " + user.level + " - " + user.level_title;
        if (user.level > 9) {
            this.txtLevel.addColor('#ffffff', Language.instance().getData("176").length + 3);
        } else {
            this.txtLevel.addColor('#ffffff', Language.instance().getData("176").length + 2);
        }
        this.current_level = current_level;
        this.next_level = next_level;
        this.ava.setAvatar(user.avatar);
        this.urlAvatar = user.avatar;
        MainData.instance().userDescription = user.description;


        // user.vip = true;
        // console.log('ggggdfFFF');
        // console.log(user.vip);
        this.header.setBg(this.user.vip);
        if (user.vip === true) {
            this.bgAvaVip.visible = true;
            this.bgAva.visible = false;
            this.txtUserName.y = (this.positionUserProfile.profile_txt_username.y + 12) * window.GameConfig.RESIZE;
            this.txtLevel.y = (this.positionUserProfile.profile_txt_level.y + 12) * window.GameConfig.RESIZE;
        } else {
            this.bgAvaVip.visible = false;
            this.bgAva.visible = true;
        }

        if (SocketController.instance().dataMySeft.user_id == user.id) {
            this.addMe(user);
        } else {
            this.addOtherUser(user, game_status, friend_status);
        }
    }

    /*
     if (data.params.containsKey("action")) {
                    let action = data.params.getUtfString("action");
                    let friend_id = data.params.getInt("friend_id");

                    if (action === "REMOVE_FRIEND") {
                        DataUser.instance().listFriend.removeFriend(id);
                    } else if (action === "ACCEPT_ADD_REQUEST") {
                        console.log(this.dataProfile);
                        let item = new DataFriend();
                        item.level = 0;
                        item.user_name = "";
                        item.id = 0;
                        item.avatar = "";
                        item.is_online = false;
                        item.vip = true;
                    }
                }
    */

    chooseRemoveFriend() {
        this.btnHuyKetBan.inputEnabled = false;

        DataUser.instance().listFriend.removeFriend(this.user.id);

        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_REMOVE_FRIEND, this.user.id));

        this.event.friend_status_update.dispatch("NO_FRIEND");
    }

    chooseOkFriend() {
        this.btnDongYFriend.inputEnabled = false;

        let item = new DataFriend();
        item.level = this.user.level;
        item.user_name = this.user.user_name;
        item.id = this.user.id;
        item.avatar = this.user.avatar;
        item.is_online = this.user.is_online;
        item.vip = this.user.vip;
        DataUser.instance().listFriend.setFriend(item);

        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_ACCEPT_ADD_REQUEST, this.user.id));

        this.event.friend_status_update.dispatch("FRIEND");
    }

    chooseCancle() {
        this.btnHuyBoFriend.inputEnabled = false;

        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_REFUSE_ADD_REQUEST, this.user.id));

        this.event.friend_status_update.dispatch("NO_FRIEND");
    }

    chooseInviteFriend() {
        LogConsole.log("chooseInviteFriend");

        this.btnInviteFriend.inputEnabled = false;
        SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_REQUEST,
            SendUserFriendRequest.begin(SendUserFriendRequest.ACTION_ADD_FRIEND, this.user.id));

        this.event.friend_status_update.dispatch("PENDING_THEM");
    }
    chooseSendMessage() {
        // LogConsole.log(this.user);
        LogConsole.log("chooseSendMessage");
        if (SocketController.instance().dataMySeft.is_playing_game === true) {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("177"));
        } else {
            MainData.instance().isGetUserProfileSearch = false;
            ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            IronSource.instance().hideBanner();
            ControllScreenDialog.instance().addChatScreen(this.user);
        }
    }
    chooseDuel() {
        LogConsole.log("chooseDuel" + this.game_status);
        if (SocketController.instance().dataMySeft.is_playing_game === true) {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("178"));
        } else {
            // console.log(this.game_status);
            if (this.game_status == "NO_GAME") {
                // console.log('GGGKDLSJF');
                if (MainData.instance().state == ConfigScreenName.TURN_BASE) {
                    ControllScreen.instance().screen.challengeGame({
                        id: this.user.id,
                        userName: this.user.user_name,
                        avatar: this.user.avatar,
                        is_online: this.user.is_online
                    })
                } else {
                    ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE, {
                        opponent: {
                            id: this.user.id,
                            userName: this.user.user_name,
                            avatar: this.user.avatar,
                            is_online: this.user.is_online
                        },
                        type: TurnBaseScreen.TYPE_CHALLENGE
                    });
                }
            } else if (this.game_status == "YOUR_TURN") {
                // if (MainData.instance().state == ConfigScreenName.TURN_BASE) {

                // } else {
                ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE, {
                    opponent: {
                        id: this.user.id,
                        userName: this.user.user_name,
                        avatar: this.user.avatar,
                        is_online: this.user.is_online
                    },
                    type: TurnBaseScreen.TYPE_BECHALLENGED
                });
                // }
            } else if (this.game_status == "ARCHIVED") {
                ControllDialog.instance().addDialog(Language.instance().getData("179"));
            }
            this.chooseBack();
        }
        /*
         * 0. No have turn
         * 1. Your turn
         * 2. Their turn
         * 3. Archived
         */
    }

    onUpdateUserVars() {
        if (SocketController.instance().dataMySeft.user_id == this.user.id) {
            this.txtUserName.setText(SocketController.instance().dataMySeft.user_name);
            if (this.urlAvatar !== SocketController.instance().dataMySeft.avatar) {
                this.ava.setAvatar(SocketController.instance().dataMySeft.avatar);
            }
            if (parseInt(this.btnDiamond.lbBtn.text) !== SocketController.instance().dataMySeft.diamond) {
                this.btnDiamond.setText(SocketController.instance().dataMySeft.diamond);
            }
            if (parseInt(this.btnMic.lbBtn.text) !== SocketController.instance().dataMySeft.support_item) {
                this.btnMic.setText(SocketController.instance().dataMySeft.support_item);
            }
            if (parseInt(this.btnTicket.lbBtn.text) !== SocketController.instance().dataMySeft.ticket) {
                this.btnTicket.setText(SocketController.instance().dataMySeft.ticket);
            }
        }
    }

    destroy() {
        this.removeEventExtension();
        this.removeEvent();
        super.destroy();
    }
}