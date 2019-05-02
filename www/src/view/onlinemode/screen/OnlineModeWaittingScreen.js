import BaseView from "../../BaseView.js";
import MainData from "../../../model/MainData.js";
import OnlineModeHeaderItem from "../item/OnlineModeHeaderItem.js";
import ButtonWithText from "../../component/ButtonWithText.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import OnlineModeUser from "../item/OnlineModeUser.js";
import OnlineModeCRDataField from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataField.js";
import PlayerCRData from "../../../model/onlinemodecreatroom/data/PlayerCRData.js";
import OnlineModeCRDataCommand from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import SocketController from "../../../controller/SocketController.js";
import GetOnlineModeListQuestion from "../../../model/onlineMode/server/getdata/GetOnlineModeListQuestion.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import DataCommand from "../../../common/DataCommand.js";
import OnlineModeListFriendScreen from "../screenitem/createroom/OnlineModeListFriendScreen.js";
import SwitchScreen from "../../component/SwitchScreen.js";
import OnlineModeChoosePlaylistScreen from "../screenitem/createroom/OnlineModeChoosePlaylistScreen.js";
import OnlineModeDataField from "../../../model/onlineMode/dataField/OnlineModeDataField.js";
import OnlineModeItemChart from "../item/OnlineModeItemChart.js";
import OnlineModeItemMeAnswer from "../item/OnlineModeItemMeAnswer .js";
import OnlineModeShowQuestion from "../item/OnlineModeShowQuestion.js";
import GetOnlineModeGameResult from "../../../model/onlinemodecreatroom/server/getdata/GetOnlineModeGameResult.js";
import OnlineModeResultListSong from "../item/OnlineModeResultListSong.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import OnlineModeItemChat from "../item/OnlineModeItemChat.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import ControllLoading from "../../ControllLoading.js";
import IronSource from "../../../IronSource.js";
import EventGame from "../../../controller/EventGame.js";
import ControllSound from "../../../controller/ControllSound.js";
import ButtonBase from "../../component/ButtonBase.js";
import KeyBoard from "../../component/KeyBoard.js";
import OnlinemodeItemChatWaitting from "../item/OnlinemodeItemChatWaitting.js";
import FacebookAction from "../../../common/FacebookAction.js";
import OnlineModeChooseQuickChat from "../screenitem/createroom/OnlineModeChooseQuickChat.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";


export default class OnlineModeWaittingScreen extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            back: new Phaser.Signal()
        }
        this.listSongResult = null;
        this.choosePlayList = null;
        this.listFriend = null;
        this.quickChat = null;
        this.idTimeOutShowPlayList = null;
        this.ktPlay = false; // khi  tra ve question thi ktplay = true;
        this.ktStart = false; // kiem tra xem da start cau hoi chua
        this.arrQuestion = [];
        this.timecount = 0;
        this.ktCountDownPlay = false;
        this.timeTween = null;
        this.timerCountDown = null;
        this.totalPlayerPlay = 0;
        this.arrMeAnswer = [];
        this.addMeAnswer = game.add.group();
        this.addListChart = game.add.group();
        this.addChatWaitting = game.add.group();
        this.idxQuestion = 0;
        this.arrScore = [];
        this.arrChart = {};
        this.arrPlayer = [];
        this.idMaster = -1;
        this.roomBet = 0;
        this.idRoom = "";
        this.currentBet = 0;
        this.nameMaster = "";
        this.idShowResult = null;
        this.ktReplay = false;
        this.objChat = {};
        this.startTime = 0;
        this.endTime = 0;
        this.ktshowBadConnection = false;
        this.checkSendExit = false;
        this.objChatWaitting = {};

        this.arrLocal = [{
            x: 100 * MainData.instance().scale,
            y: 385 * MainData.instance().scale
        }, {
            x: 385 * MainData.instance().scale,
            y: 385 * MainData.instance().scale
        }, {
            x: 100 * MainData.instance().scale,
            y: 690 * MainData.instance().scale
        }, {
            x: 385 * MainData.instance().scale,
            y: 690 * MainData.instance().scale
        }];

        this.arrLocalPlay2 = [{
            x: 206 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 354 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }];

        this.arrLocalPlay3 = [{
            x: 114 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 276 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 438 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }];

        this.arrLocalPlay4 = [{
            x: 59 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 206 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 354 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }, {
            x: 495 * MainData.instance().scale,
            y: 223 * MainData.instance().scale
        }];

        this.arrLocalResultWin = {
            x: 260 * MainData.instance().scale,
            y: 140 * MainData.instance().scale
        }
        this.arrLocalResult2 = [{
            x: 275 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }];

        this.arrLocalResult3 = [{
            x: 185 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }, {
            x: 365 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }];

        this.arrLocalResult4 = [{
            x: 117 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }, {
            x: 275 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }, {
            x: 431 * MainData.instance().scale,
            y: 420 * MainData.instance().scale
        }];

        this.arrLocalResultAllLose2 = [{
            x: 211 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 355 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }];

        this.arrLocalResultAllLose3 = [{
            x: 117 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 275 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 431 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }];
        this.arrLocalResultAllLose4 = [{
            x: 60 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 211 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 355 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }, {
            x: 490 * MainData.instance().scale,
            y: 260 * MainData.instance().scale
        }];

        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.header = new OnlineModeHeaderItem();
        this.header.setWaittingRoom();
        this.header.setIdPhong("dfdsf");
        this.header.setNguoiTao("Viet Pv");
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        this.addChild(this.addListChart);
        this.buildListPlayer();

        this.btnMoiBan = new ButtonWithText(this.positionCreateRoom.waitting_btn_moiban, Language.instance().getData("67"), this.chooseMoiBan, this);
        this.btnMoiBan.y = game.height;
        this.addChild(this.btnMoiBan);

        this.btnChoi = new ButtonWithText(this.positionCreateRoom.waitting_btn_choi, Language.instance().getData("24"), this.chooseChoi, this);
        this.btnChoi.y = game.height;
        this.addChild(this.btnChoi);

        this.btnChatWaitting = new ButtonBase(this.positionCreateRoom.chat_waitting_icon_chat, this.addQuickChat, this);
        this.btnChatWaitting.y = game.height - 223;
        this.addChild(this.btnChatWaitting);

        this.addChild(this.addChatWaitting);

        this.txtCounDown = new TextBase(this.positionCreateRoom.waitting_txt_countdown, "");
        this.txtCounDown.anchor.set(0.5);
        this.txtCounDown.x = game.width / 2;
        this.addChild(this.txtCounDown);

        let str = Language.instance().getData("61");
        let arr = str.split("\n");
        this.txtTrick = new TextBase(this.positionCreateRoom.waitting_txt_trick, Language.instance().getData("61"));
        this.txtTrick.visible = false;
        this.txtTrick.addColor("#FFA339", arr[0].length);
        this.txtTrick.setTextBounds(0, 0, game.width, 95 * MainData.instance().scale);
        this.txtTrick.y = game.height - 95 * MainData.instance().scale;
        this.addChild(this.txtTrick);

        this.hideButtonChoi();
        this.hideButtonMoiBan();

        this.btnMucCuoc = new ButtonWithText(this.positionCreateRoom.button_muccuoc_room, "10");
        this.addChild(this.btnMucCuoc);

        this.labelMuccuoc = new TextBase(this.positionCreateRoom.text_muccuoc_room, Language.instance().getData("43"));
        this.labelMuccuoc.x = (game.width - this.labelMuccuoc.width) / 2;
        this.addChild(this.labelMuccuoc);


        this.lineWin = new SpriteBase(this.positionCreateRoom.result_line_win);
        this.lineWin.visible = false;
        this.addChild(this.lineWin);

        this.txtWin = new TextBase(this.positionCreateRoom.result_txtWin_win, Language.instance().getData("62") + " !!!");
        this.txtWin.setTextBounds(0, 0, game.width, 47 * MainData.instance().scale);
        this.txtWin.visible = false;
        this.addChild(this.txtWin);

        this.button_share = new ButtonBase(this.positionCreateRoom.button_share, this.chooseShare, this);
        this.button_share.visible = false;
        this.addChild(this.button_share, this);

        this.buildUserJoinRoom();

        this.addEvent();

    }

    chooseShare() {
        FacebookAction.instance().share();
    }

    showBetRoom() {
        this.btnMucCuoc.visible = true;
        this.labelMuccuoc.visible = true;
    }
    hideBetRoom() {
        this.btnMucCuoc.visible = false;
        this.labelMuccuoc.visible = false;
    }

    resetArrayScore() {
        this.arrScore = [{
            idx: 0,
            score: 0
        }, {
            idx: 1,
            score: 0
        }, {
            idx: 2,
            score: 0
        }, {
            idx: 3,
            score: 0
        }]
    }

    hideButtonMoiBan() {
        //this.btnMoiBan.alpha = 0.6;
        this.btnMoiBan.inputEnabled = false;
    }

    showButtonMoiBan() {
        //this.btnMoiBan.alpha = 1;
        this.btnMoiBan.inputEnabled = true;
    }

    hideButtonChoi() {
        // this.btnChoi.alpha = 0.6;
        this.btnChoi.inputEnabled = false;
    }

    showButtonChoi() {
        //this.btnChoi.alpha = 1;
        this.btnChoi.inputEnabled = true;
        //this.removeListFriend();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onUserEnterRoom.add(this.userEnterRoom, this);
        SocketController.instance().events.onUserExitRoom.add(this.userExitRoom, this);
        SocketController.instance().events.onUserVarsUpdate.add(this.userVarsUpdate, this);
        SocketController.instance().events.onRoomVarsUpdate.add(this.onRoomVarsUpdate, this);
        SocketController.instance().events.onPublicMessage.add(this.onPublicMessage, this);
        EventGame.instance().event.bad_connection.add(this.checkBadConnection, this);
        EventGame.instance().event.chooseExitBadConnection.add(this.chooseExitBadConnection, this);
        EventGame.instance().event.chooseNoPopupConfirm.add(this.chooseNoPopupConfirm, this);

        //SocketController.instance().sendPublicChat("hahah");
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onUserEnterRoom.remove(this.userEnterRoom, this);
        SocketController.instance().events.onUserExitRoom.remove(this.userExitRoom, this);
        SocketController.instance().events.onUserVarsUpdate.remove(this.userVarsUpdate, this);
        SocketController.instance().events.onRoomVarsUpdate.remove(this.onRoomVarsUpdate, this);
        SocketController.instance().events.onPublicMessage.remove(this.onPublicMessage, this);
        EventGame.instance().event.bad_connection.remove(this.checkBadConnection, this);
        EventGame.instance().event.chooseExitBadConnection.remove(this.chooseExitBadConnection, this);
        EventGame.instance().event.chooseNoPopupConfirm.remove(this.chooseNoPopupConfirm, this);
    }

    chooseNoPopupConfirm(tryNo) {
        if (tryNo === "chooseCanclePopupMoney") {
            this.chooseBack();
        }
    }

    checkBadConnection() {
        if (this.ktPlay === false && this.ktshowBadConnection === false) {
            this.ktshowBadConnection = true;
            ControllScreenDialog.instance().addBadConnection();
        }
    }

    chooseExitBadConnection() {
        this.chooseExit();
    }

    onPublicMessage(event) {
        LogConsole.log("onPublicMessage");
        LogConsole.log(event);
        let command = event.message;
        if (command === DataCommand.CHAT_ONLINE_MODE) {
            let sender = event.sender;
            let isMe = sender.isItMe;
            let id = parseInt(sender.name);
            let vip = event.data.getBool('vip');

            if (event.data.containsKey("label") && event.data.containsKey("sprite")) {
                let dataSend = {
                    label: event.data.getUtfString("label"),
                    sprite: event.data.getUtfString("sprite"),
                    vip: vip
                };

                if (event.data.containsKey("atlas")) {
                    dataSend.atlas = event.data.getUtfString("atlas");
                }

                let idx = 0;

                for (let i = 0; i < this.arrPlayer.length; i++) {
                    if (this.arrPlayer[i].ktEmpty === false) {
                        idx++;
                        if (this.arrPlayer[i].getData().user_id === id) {
                            let isLeft = false;
                            if (dataSend.hasOwnProperty("atlas")) {
                                if (this.arrPlayer[i].getData().idx % 2 === 0) {
                                    isLeft = true;
                                } else {
                                    isLeft = false;
                                }
                            } else {

                                if (this.totalPlayerPlay === 2) {
                                    if (idx === 1) {
                                        isLeft = false;
                                    } else {
                                        isLeft = true;
                                    }
                                } else {
                                    if (idx === 1 || idx === 2) {
                                        isLeft = false;
                                    } else {
                                        isLeft = true;
                                    }
                                }
                            }
                            dataSend.id = id;
                            this.removeItemChatWaitting(id);
                            let itemChat = new OnlineModeItemChat(isMe, isLeft, dataSend);
                            itemChat.event.destroy.add(this.removeItemChatWaitting, this);
                            this.addChatWaitting.addChild(itemChat);

                            if (dataSend.hasOwnProperty("atlas")) {
                                itemChat.x = this.arrPlayer[i].x + (155 - itemChat.width) / 2;
                                itemChat.y = this.arrPlayer[i].y + 48 - itemChat.height;

                                if (this.listFriend !== null) {
                                    this.listFriend.addChatRoom(dataSend.label, sender.getVariable("avatar").value, dataSend.sprite, vip);
                                }

                                if (this.choosePlayList !== null) {
                                    this.choosePlayList.addChatRoom(dataSend.label, sender.getVariable("avatar").value, dataSend.sprite, vip);
                                }
                            } else {
                                if (isLeft) {
                                    itemChat.x = this.arrPlayer[i].x + 130 * MainData.instance().scale - itemChat.width;
                                    if (itemChat.x < 0) {
                                        itemChat.x = 0;
                                    }
                                    itemChat.y = this.arrPlayer[i].y - 15 * MainData.instance().scale;
                                } else {
                                    itemChat.x = this.arrPlayer[i].x + 55 * MainData.instance().scale;
                                    itemChat.y = this.arrPlayer[i].y - 15 * MainData.instance().scale;
                                }
                            }

                            this.objChatWaitting[id] = itemChat;
                            break;
                        }
                    }
                }
            }

            if (event.data.containsKey("chatWaitting")) {

                for (let i = 0; i < this.arrPlayer.length; i++) {
                    if (this.arrPlayer[i].ktEmpty === false) {
                        if (this.arrPlayer[i].getData().user_id === id) {
                            this.removeItemChatWaitting(id);
                            let itemChatWaitting = new OnlinemodeItemChatWaitting(event.data.getUtfString("chatWaitting"), id, vip);
                            itemChatWaitting.event.destroy.add(this.removeItemChatWaitting, this);
                            itemChatWaitting.x = this.arrPlayer[i].x + (155 - itemChatWaitting.width) / 2;
                            itemChatWaitting.y = this.arrPlayer[i].y + 48 - itemChatWaitting.height;
                            this.addChatWaitting.addChild(itemChatWaitting);
                            this.objChatWaitting[id] = itemChatWaitting;

                            if (this.listFriend !== null) {
                                this.listFriend.addChatRoom(event.data.getUtfString("chatWaitting"), sender.getVariable("avatar").value, "", vip);
                            }
                            if (this.choosePlayList !== null) {
                                this.choosePlayList.addChatRoom(event.data.getUtfString("chatWaitting"), sender.getVariable("avatar").value, "", vip);
                            }
                            break;
                        }
                    }
                }
            }
        }

    }

    removeItemChatWaitting(id) {
        if (this.objChatWaitting.hasOwnProperty(id)) {
            this.addChatWaitting.removeChild(this.objChatWaitting[id]);
            this.objChatWaitting[id].destroy();
            this.objChatWaitting[id] = null;
            delete this.objChatWaitting[id];
        }
    }

    removeItemChat(itemChat) {
        if (itemChat) {
            this.addChatWaitting.removeChild(itemChat);
            itemChat.destroy();
            itemChat = null;
        }
    }

    buildUserJoinRoom() {
        LogConsole.log("buildUserJoinRoom");
        LogConsole.log(MainData.instance().dataJoinRoom.room);
        let users = MainData.instance().dataJoinRoom.room.getUserList();

        this.idRoom = MainData.instance().dataJoinRoom.room.id;
        MainData.instance().modeplay = MainData.instance().dataJoinRoom.room.getVariable("mode").value;
        this.idMaster = MainData.instance().dataJoinRoom.room.getVariable(OnlineModeCRDataField.room_master).value;
        this.roomBet = MainData.instance().dataJoinRoom.room.getVariable(OnlineModeCRDataField.bet_place).value;

        LogConsole.log(" this.roomBet : " + this.roomBet);
        this.btnMucCuoc.setText(this.roomBet);

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let player = this.getDataPlayer(user);
            this.arrPlayer[i].setData(player, i);
            this.arrPlayer[i].setMaster(this.idMaster);

            if (player.user_id === this.idMaster) {
                this.nameMaster = player.user_name;
            }
            this.totalPlayerPlay++;
        }

        this.header.setIdPhong(this.idRoom);
        this.header.setNguoiTao(this.nameMaster);

        this.checkShowMaster();

        if (SocketController.instance().dataMySeft.user_id !== this.idMaster) {
            this.removeTimeoutShowChoosePlayList();
            this.idTimeOutShowPlayList = setTimeout(() => {
                this.addChoosePlayList();
            }, 800);
        }

        this.checkShowInviteFriend();
        this.checkShowButtonChoi();
        this.showButtonWaittingChat();

        MainData.instance().dataJoinRoom = null;

        ControllLoading.instance().hideLoading();
    }

    showButtonWaittingChat() {
        if (this.ktPlay === false) {
            this.btnChatWaitting.visible = true;
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                this.btnChatWaitting.y = game.height - 223;
            } else {
                this.btnChatWaitting.y = game.height - 116;
            }
        }
    }

    hideButtonWaittingChat() {
        this.btnChatWaitting.visible = false;
        this.btnChatWaitting.y = game.height;
    }

    showPlayGame() {
        this.hideTextTrick();
        LogConsole.log("showPlayGame");
        let arrLocalPlay = [];
        if (this.totalPlayerPlay === 2) {
            arrLocalPlay = this.arrLocalPlay2;
        } else if (this.totalPlayerPlay === 3) {
            arrLocalPlay = this.arrLocalPlay3;
        } else if (this.totalPlayerPlay === 4) {
            arrLocalPlay = this.arrLocalPlay4;
        }

        let idx = -1;
        this.arrChart = {};
        for (let i = 0; i < this.arrPlayer.length; i++) {

            if (this.arrPlayer[i].ktEmpty === false) {

                idx++;
                this.arrPlayer[i].hideLoading();
                this.arrPlayer[i].setTextSanSang("");
                this.arrPlayer[i].setScore(0);
                this.arrPlayer[i].setUserPlayGame();
                game.add.tween(this.arrPlayer[i]).to({
                    x: arrLocalPlay[idx].x,
                    y: arrLocalPlay[idx].y
                }, 400, Phaser.Easing.Power1, true);

                game.add.tween(this.arrPlayer[i].scale).to({
                    x: 0.62,
                    y: 0.62
                }, 400, Phaser.Easing.Power1, true);

                game.time.events.add(Phaser.Timer.SECOND * 0.4, this.buidlChartUser, this, this.arrPlayer[i].getData().user_id, idx, i, arrLocalPlay);

            } else {
                let _vx = 0;
                if (i % 2 === 0) {
                    _vx = -this.arrPlayer[i].width - 200 * MainData.instance().scale;
                } else {
                    _vx = game.width + 200 * MainData.instance().scale;
                }
                game.add.tween(this.arrPlayer[i]).to({
                    x: _vx
                }, 200, Phaser.Easing.Power1, true);

            }
        }

        setTimeout(() => {
            this.buildListMeAnswer();
            this.addShowQuestion(this.idxQuestion);
        }, 600);
    }

    buidlChartUser(user_id, idx, i, arrLocalPlay) {
        let itemchart = new OnlineModeItemChart();
        if (SocketController.instance().dataMySeft.user_id === user_id) {
            itemchart.addChart(true);
        } else {
            itemchart.addChart(false);
        }
        itemchart.x = arrLocalPlay[idx].x + 2 * MainData.instance().scale;
        itemchart.y = arrLocalPlay[idx].y + 72 * MainData.instance().scale;
        itemchart.height = 0;

        this.addListChart.addChild(itemchart);
        // itemchart.visible = false;
        this.arrChart[i] = itemchart;
        this.setChart(0, i);

    }

    hideChart() {
        while (this.addListChart.children.length > 0) {
            let item = this.addListChart.children[0];
            this.addListChart.removeChild(item);
            item.destroy();
            item = null;
        }
    }

    setChart(per, idx) {
        if (this.arrChart[idx]) {
            let height = 55 * MainData.instance().scale + 200 * MainData.instance().scale * per;
            let vy = 223 * MainData.instance().scale - (200 * MainData.instance().scale * per);
            let charty = vy + 72;

            game.add.tween(this.arrChart[idx]).to({
                y: charty,
                height: height
            }, 500, Phaser.Easing.Power1, true);

            game.add.tween(this.arrPlayer[idx]).to({
                y: vy
            }, 500, Phaser.Easing.Power1, true);

            if (this.objChat[this.arrPlayer[idx].getData().user_id] && this.objChat[this.arrPlayer[idx].getData().user_id] != null) {
                game.add.tween(this.objChat[this.arrPlayer[idx].getData().user_id]).to({
                    y: vy - 92 * MainData.instance().scale
                }, 500, Phaser.Easing.Power1, true);
            }
        }
    }

    buildListMeAnswer() {
        while (this.addMeAnswer.children.length > 0) {
            let item = this.addMeAnswer.children[0];
            this.addMeAnswer.removeChild(item);
            item.destroy();
            item = null;
        }

        let beginX = 0;
        let beginY = 25 * MainData.instance().scale;
        this.arrMeAnswer = [];
        for (let i = 0; i < this.arrQuestion.length; i++) {
            let item = new OnlineModeItemMeAnswer();
            item.x = beginX;
            item.y = beginY;
            this.addMeAnswer.addChild(item);
            beginX += 54 * MainData.instance().scale;
            game.add.tween(item).to({
                y: 0
            }, 400, Phaser.Easing.Elastic.Out, true, 30 * i, 1);

            this.arrMeAnswer.push(item);
        }

        this.addMeAnswer.y = 385 * MainData.instance().scale;
        this.addChild(this.addMeAnswer);

        this.addMeAnswer.x = (game.width - beginX) / 2;
    }

    hideAnswerMe() {
        for (let i = 0; i < this.arrMeAnswer.length; i++) {
            game.add.tween(this.arrMeAnswer[i]).to({
                alpha: 0
            }, 200, Phaser.Easing.Elastic.Out, true);
        }
    }

    setMeAnswer(data) {
        this.arrMeAnswer[data.idx].setData(data);
    }

    setShowMeAnswerCurrent(idx) {
        this.arrMeAnswer[idx].setBeginLoad();
    }

    addShowQuestion(idx) {
        LogConsole.log("addShowQuestion");
        this.removeShowQuestion();

        this.setShowMeAnswerCurrent(idx);

        this.showQuestion = new OnlineModeShowQuestion(this.arrQuestion, idx);
        this.showQuestion.addEventChooseAnswer(this.setMeAnswer, this);
        this.showQuestion.addEventShowQuestion(this.setShowMeAnswerCurrent, this);
        this.showQuestion.event.close.add(this.removeShowQuestion, this);
        this.showQuestion.x = 0;
        this.showQuestion.y = game.height - 700 * MainData.instance().scale;
        this.addChild(this.showQuestion);
    }

    removeShowQuestion() {
        if (this.showQuestion != null) {
            this.removeChild(this.showQuestion);
            this.showQuestion.destroy();
            this.showQuestion = null;
        }
    }

    addListSongResult() {
        this.removeListSongResult();
        this.listSongResult = new OnlineModeResultListSong(this.arrQuestion, this.roomBet);
        this.listSongResult.event.replay.add(this.showReplayGame, this);
        this.listSongResult.event.exit.add(this.chooseExit, this);
        this.listSongResult.event.close.add(this.removeListSongResult, this);
        this.listSongResult.y = game.height - 515 * MainData.instance().scale;
        this.addChild(this.listSongResult);
    }
    removeListSongResult() {
        if (this.listSongResult !== null) {
            this.removeChild(this.listSongResult);
            this.listSongResult.destroy();
            this.listSongResult = null;
        }
    }

    chooseExit() {
        ControllLoading.instance().showLoading();
        SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_GAME_FINISH, null);
    }

    showTimeCountDown(time) {
        this.removeTimeCountDown();
        this.timecount = time;
        this.setTextCountDown();
        this.timerCountDown = this.game.time.create(true);
        this.timerEventCountDown = this.timerCountDown.loop(1000, this.onTimerCountDown, this);
        this.timerCountDown.start();
    }

    onTimerCountDown() {
        this.timecount--;
        this.setTextCountDown();
    }

    setTextCountDown() {
        if (this.timecount > -1) {
            if (this.timecount < 6) {
                game.sound.stopAll();
                game.sound.play("beep_audio");
            }
            if (this.ktCountDownPlay && this.timecount === 0) {
                this.txtCounDown.text = Language.instance().getData("63");
            } else {
                this.txtCounDown.text = this.timecount;
            }

            this.txtCounDown.y = this.positionCreateRoom.waitting_txt_countdown.y * MainData.instance().scale + 80 * MainData.instance().scale;

            game.add.tween(this.txtCounDown).to({
                y: this.positionCreateRoom.waitting_txt_countdown.y * MainData.instance().scale
            }, 200, Phaser.Easing.Elastic.Out, true);
        } else {
            if (this.ktCountDownPlay) {
                this.showPlayGame();
            }
            this.removeTimeCountDown();
        }
    }

    removeTimeCountDown() {
        if (this.timerCountDown !== null) {
            game.time.events.remove(this.timerEventCountDown);
            this.timerEventCountDown = null;
            this.timerCountDown.stop();
            this.timerCountDown.destroy();
            this.timerCountDown = null;
        }

        this.txtCounDown.text = "";
    }

    hideHeader() {
        this.header.setHideBtnBack();
        this.header.y = 0;
        game.add.tween(this.header).to({
            y: -180 * MainData.instance().scale
        }, 300, Phaser.Easing.Power1, true);

    }
    showHeader() {
        this.header.setShowBtnBack();
        this.header.y = -180 * MainData.instance().scale;
        game.add.tween(this.header).to({
            y: 0
        }, 300, Phaser.Easing.Power1, true);
    }

    showTextTrick() {
        this.txtTrick.visible = true;
        /* this.txtTrick.alpha = 0;
         game.add.tween(this.header).to({
             alpha: 1
         }, 500, Phaser.Easing.Power1, true);*/
    }

    hideTextTrick() {
        this.txtTrick.visible = false;
    }

    checkShowMaster() {
        LogConsole.log("checkShowMaster : " + SocketController.instance().dataMySeft.user_id);
        if (this.ktPlay === false) {
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                this.btnMoiBan.visible = true;
                this.btnMoiBan.y = game.height;
                game.add.tween(this.btnMoiBan).to({
                    y: game.height - 123 * MainData.instance().scale
                }, 300, Phaser.Easing.Power1, true, 100);

                this.btnChoi.visible = true;
                this.btnChoi.inputEnabled = true;
                this.btnChoi.y = game.height;
                game.add.tween(this.btnChoi).to({
                    y: game.height - 123 * MainData.instance().scale
                }, 300, Phaser.Easing.Power1, true, 100);

            } else {
                this.btnMoiBan.visible = false;
                this.btnChoi.visible = false;
            }
        }
    }

    hideButtonMaster() {
        if (this.ktPlay === true) {
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                this.btnMoiBan.visible = true;
                this.btnMoiBan.y = game.height - 123 * MainData.instance().scale;
                game.add.tween(this.btnMoiBan).to({
                    y: game.height
                }, 300, Phaser.Easing.Power1, true, 100);

                this.btnChoi.visible = true;
                this.btnChoi.y = game.height - 123 * MainData.instance().scale;
                game.add.tween(this.btnChoi).to({
                    y: game.height
                }, 300, Phaser.Easing.Power1, true, 100);

            }
        }
    }

    checkShowInviteFriend() {
        if (this.ktPlay === false) {
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                let count = 0;
                for (let i = 0; i < this.arrPlayer.length; i++) {
                    if (this.arrPlayer[i].ktEmpty === false) {
                        count++;
                    }
                }

                if (count < 4) {
                    this.showButtonMoiBan();
                } else {
                    this.hideButtonMoiBan();
                    this.removeListFriend();
                }
            }
        }
    }

    checkShowButtonChoi() {
        if (this.ktPlay === false) {
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                LogConsole.log("checkShowButtonChoi");
                let countPlayer = 0;
                let countReady = 0;
                for (let i = 0; i < this.arrPlayer.length; i++) {
                    if (this.arrPlayer[i].ktEmpty === false) {
                        countPlayer++;
                        if (this.arrPlayer[i].getData().online_mode_room_ready === true) {
                            countReady++;
                        } else if (this.arrPlayer[i].getData().isMaster === true) {
                            countReady++;
                        }
                    }
                }
                LogConsole.log("countReady : " + countReady);
                LogConsole.log("countPlayer : " + countPlayer);
                if (countPlayer === 1) {
                    this.hideButtonChoi();
                } else {
                    if (countReady === countPlayer) {
                        this.showButtonChoi();
                    } else {
                        this.hideButtonChoi();
                    }
                }
            }
        }
    }

    getDataPlayer(user) {
        let player = new PlayerCRData();
        player.user_id = user.getVariable(OnlineModeCRDataField.user_id).value;
        player.user_name = user.getVariable(OnlineModeCRDataField.user_name).value;
        player.avatar = user.getVariable(OnlineModeCRDataField.avatar).value;
        // player.gender = user.getVariable(OnlineModeCRDataField.gender).value;
        // player.experience_score = user.getVariable(OnlineModeCRDataField.experience_score).value;
        // player.heart = user.getVariable(OnlineModeCRDataField.heart).value;
        // player.diamond = user.getVariable(OnlineModeCRDataField.diamond).value;
        // player.ticket = user.getVariable(OnlineModeCRDataField.ticket).value;
        // player.weekly_high_score = user.getVariable(OnlineModeCRDataField.weekly_high_score).value;
        // player.all_time_high_score = user.getVariable(OnlineModeCRDataField.all_time_high_score).value;
        // player.level = user.getVariable(OnlineModeCRDataField.level).value;
        // player.online_mode_genre = user.getVariable(OnlineModeCRDataField.online_mode_genre).value;
        // player.online_mode_loaded = user.getVariable(OnlineModeCRDataField.online_mode_loaded).value;
        player.online_mode_room_ready = user.getVariable(OnlineModeCRDataField.online_mode_room_ready).value;
        player.vip = user.getVariable(OnlineModeCRDataField.vip).value;
        // player.vip = true;
        if (player.user_id === this.idMaster) {
            player.isMaster = true;
        } else {
            player.isMaster = false;
        }

        return player;
    }

    getData(data) {
        switch (data.cmd) {
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_PLAYLIST_RESPONSE:
                //this.addChoosePlayList(data.params);
                break;
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_SERVER_QUESTIONS_RESPONSE:
                if (this.ktPlay === false) {

                    this.hideBetRoom();

                    this.ktStart = false;
                    this.resetArrayScore();
                    this.ktCountDownPlay = false;
                    this.ktPlay = true;
                    SocketController.instance().sendLoading(1);
                    this.hideButtonMaster();
                    this.hideHeader();
                    this.showTextTrick();
                    for (let i = 0; i < this.arrPlayer.length; i++) {
                        this.arrPlayer[i].setPlay(true);
                    }
                    this.arrQuestion = GetOnlineModeListQuestion.begin(data.params);
                }
                break;
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_GAME_START:
                this.hideButtonWaittingChat();
                this.hideKeyBoard();

                IronSource.instance().playCreateRoom();

                this.hideButtonMoiBan();
                this.hideButtonChoi();
                this.startTime = this.getTime();
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_start_createroom);
                this.ktStart = true;
                this.ktCountDownPlay = true;
                this.idxQuestion = data.params.getInt(OnlineModeDataField.question_index) - 1;
                this.showTimeCountDown(3);

                ControllScreenDialog.instance().removeUserProfile();
                break;

            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_USER_SELECTED_ANSWER_RESPONSE:
                this.setScorePlayer(data.params);
                break;
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_GAME_RESULT:
                this.endTime = this.getTime();
                let countTime = parseInt((this.endTime - this.startTime) / 1000);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, countTime);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_createroom);
                this.removeShowResult();
                this.idShowResult = game.time.events.add(Phaser.Timer.SECOND * 2, this.showResult, this, data.params);
                break;
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_QUICK_JOIN_RESPONSE:

                break;
        }
    }

    removeShowResult() {
        if (this.idShowResult !== null) {
            game.time.events.remove(this.idShowResult);
            this.idShowResult = null;
        }
    }

    showReplayGame() {
        if (this.ktReplay === true) {
            this.lineWin.visible = false;
            this.txtWin.visible = false;
            this.showHeader();
            this.checkShowMaster();
            this.removeEffectWin();
            this.hideButtonChoi();
            this.hideButtonMoiBan();
            this.showBetRoom();
            this.button_share.visible = false;


            for (let i = 0; i < this.arrPlayer.length; i++) {

                this.arrPlayer[i].setDefaultUser();

                if (this.arrPlayer[i].ktEmpty === false) {
                    this.arrPlayer[i].setTextMaster();
                }

                game.add.tween(this.arrPlayer[i]).to({
                    x: this.arrLocal[i].x,
                    y: this.arrLocal[i].y
                }, 300, Phaser.Easing.Power1, true);

                game.add.tween(this.arrPlayer[i].scale).to({
                    x: 1,
                    y: 1
                }, 300, Phaser.Easing.Power1, true);
            }

            this.removeTimeoutShowChoosePlayList();
            this.idTimeOutShowPlayList = setTimeout(() => {
                this.addChoosePlayList();
            }, 800);
        }
    }

    showResult(params) {

        game.sound.stopAll();
        this.ktReplay = false;
        this.lineWin.visible = true;
        this.txtWin.visible = true;
        this.ktPlay = false;

        GetOnlineModeGameResult.begin(params, this.arrPlayer);

        let arrPlayResult = [];
        if (this.arrScore[0].score > 0) {
            if (this.totalPlayerPlay === 2) {
                arrPlayResult = this.arrLocalResult2;
            } else if (this.totalPlayerPlay === 3) {
                arrPlayResult = this.arrLocalResult3;
            } else if (this.totalPlayerPlay === 4) {
                arrPlayResult = this.arrLocalResult4;
            }
        } else {
            if (this.totalPlayerPlay === 2) {
                arrPlayResult = this.arrLocalResultAllLose2;
            } else if (this.totalPlayerPlay === 3) {
                arrPlayResult = this.arrLocalResultAllLose3;
            } else if (this.totalPlayerPlay === 4) {
                arrPlayResult = this.arrLocalResultAllLose4;
            }
        }

        let idx = -1;
        let vx = 0;
        let vy = 0;
        let vscale = 0;

        this.button_share.visible = true;

        this.showQuestion.hideQuestion();
        this.hideAnswerMe();
        this.hideChart();
        this.addListSongResult();

        for (let i = 0; i < this.arrScore.length; i++) {
            if (this.arrPlayer[this.arrScore[i].idx].ktEmpty === false) {
                if (i === 0) {
                    if (this.arrScore[0].score > 0) {
                        vx = this.arrLocalResultWin.x;
                        vy = this.arrLocalResultWin.y;
                        vscale = 0.76;
                        this.arrPlayer[this.arrScore[i].idx].setButtonWin(true, this.roomBet);
                        this.removeShowResult();
                        this.idShowResult = game.time.events.add(Phaser.Timer.SECOND * 0.8, this.addEffectUserWin, this, this.arrPlayer[this.arrScore[i].idx]);
                        if (this.arrPlayer[this.arrScore[i].idx].getData().user_id === SocketController.instance().dataMySeft.user_id) {
                            ControllSoundFx.instance().playSound(ControllSoundFx.winturnbasepartymode);
                        }
                    } else {
                        idx++;
                        vx = arrPlayResult[idx].x;
                        vy = arrPlayResult[idx].y;
                        vscale = 0.61;
                        this.arrPlayer[this.arrScore[i].idx].setButtonWin(false);

                        this.ktReplay = true;
                        this.listSongResult.ktReplay = true;
                    }

                } else {
                    idx++;
                    vx = arrPlayResult[idx].x;
                    vy = arrPlayResult[idx].y;
                    vscale = 0.61;
                    this.arrPlayer[this.arrScore[i].idx].setButtonWin(false);

                    if (this.arrPlayer[this.arrScore[i].idx].getData().user_id === SocketController.instance().dataMySeft.user_id) {
                        ControllSoundFx.instance().playSound(ControllSoundFx.loseturnbasepartymode);
                    }
                }

                game.add.tween(this.arrPlayer[this.arrScore[i].idx]).to({
                    x: vx,
                    y: vy
                }, 500, Phaser.Easing.Power1, true, 200);

                game.add.tween(this.arrPlayer[this.arrScore[i].idx].scale).to({
                    x: vscale,
                    y: vscale
                }, 500, Phaser.Easing.Power1, true, 200);
            }
        }

        for (let i = 0; i < this.arrPlayer.length; i++) {
            this.arrPlayer[i].setPlay(false);
            if (this.arrPlayer[i].ktDisConnect === true) {
                this.arrPlayer[i].setEmpty();
                this.totalPlayerPlay--;
            }
        }
    }

    addEffectUserWin(player) {
        this.removeEffectWin();
        this.rotationWin = new SpriteBase(this.positionCreateRoom.light_rotation_list_result);
        this.rotationWin.anchor.set(0.5);
        this.addListChart.addChild(this.rotationWin);
        this.rotationWin.x = player.x + 60 * MainData.instance().scale;
        this.rotationWin.y = player.y + 100 * MainData.instance().scale;
        this.tweenRotationwin = game.add.tween(this.rotationWin).to({
            rotation: 360
        }, 2000, Phaser.Easing.Power1, true);
        this.tweenRotationwin.repeat(99999, 250);

        this.firework = new Phaser.Sprite(game, 0, 0, "firework");
        this.firework.width = 430 * MainData.instance().scale;
        this.firework.height = 228 * MainData.instance().scale;
        this.firework.x = 103 * MainData.instance().scale;
        this.firework.y = 106 * MainData.instance().scale;
        this.firework.animations.add('playfirework');
        this.firework.animations.play('playfirework', 30, true);
        this.addListChart.addChild(this.firework);

        this.ktReplay = true;
        this.listSongResult.ktReplay = true;

    }

    removeEffectWin() {
        if (this.addListChart.children) {
            while (this.addListChart.children.length > 0) {
                let item = this.addListChart.children[0];
                this.addListChart.removeChild(item);
                item.destroy();
                item = null;
            }
        }
    }


    setScorePlayer(data) {
        LogConsole.log("setScorePlayer : " + data.getDump());
        if (data.getUtfString(OnlineModeCRDataField.status) === "OK") {
            LogConsole.log(1);
            for (let i = 0; i < this.arrPlayer.length; i++) {
                if (this.arrPlayer[i].ktEmpty === false) {
                    LogConsole.log(2);
                    let dataPlayer = this.arrPlayer[i].getData();
                    let user_id = data.getInt(OnlineModeCRDataField.user_id);
                    if (dataPlayer.user_id === user_id) {
                        let score = data.getInt(OnlineModeCRDataField.score);
                        let is_correct_answer = data.getBool(OnlineModeCRDataField.is_correct_answer);

                        this.arrPlayer[i].setScore(score);

                        if (is_correct_answer === true) {
                            this.arrPlayer[i].setTrueAnswer();
                        } else {
                            this.arrPlayer[i].setFailtAnswer();
                        }
                        for (let j = 0; j < this.arrScore.length; j++) {
                            if (this.arrScore[j].idx == i) {
                                this.arrScore[j].score = score;
                                break;
                            }
                        }

                        break;
                    }
                }
            }
        }

        this.arrScore.sort(this.compare);

        let maxScore = this.arrScore[0].score;

        if (maxScore > 0) {
            //this.arrPlayer[this.arrScore[0].idx].setChart(1);
            this.setChart(1, this.arrScore[0].idx);

            for (let i = 1; i < this.arrScore.length; i++) {
                if (this.arrPlayer[this.arrScore[i].idx].ktEmpty === false) {
                    this.setChart(this.arrScore[i].score / maxScore, this.arrScore[i].idx);
                }
            }
        }
    }

    addChoosePlayList() {
        this.removeChoosePlayList();
        this.choosePlayList = new OnlineModeChoosePlaylistScreen();
        //this.choosePlayList.playListData(params);
        this.choosePlayList.setBetMoney(this.roomBet);
        this.choosePlayList.setIsMaster(false);
        this.choosePlayList.addEvent();
        this.choosePlayList.event.back.add(this.removeChoosePlayList, this);
        this.addChild(this.choosePlayList);

        this.checkShowButtonChoi();
        this.checkShowInviteFriend();
        this.showButtonWaittingChat();
    }

    removeChoosePlayList() {
        if (this.choosePlayList !== null) {
            this.removeChild(this.choosePlayList);
            this.choosePlayList.destroy();
            this.choosePlayList = null;
        }
    }

    onRoomVarsUpdate(data) {
        LogConsole.log("onRoomVarsUpdate");
        if (data.changedVars.indexOf('room_master') != -1) {

            this.idMaster = data.room.getVariable('room_master').value;
            if (SocketController.instance().dataMySeft.user_id === this.idMaster) {
                this.isMaster = true;
                if (this.ktPlay === false) {
                    ControllScreenDialog.instance().addDialog(Language.instance().getData("68"));
                }
            }
            LogConsole.log("isMaster : " + this.idMaster);
            if (this.listSongResult === null) {
                this.checkShowMaster();
                this.checkShowInviteFriend();
                this.checkShowButtonChoi();
                this.showButtonWaittingChat();
            }


            for (let i = 0; i < this.arrPlayer.length; i++) {
                if (this.arrPlayer[i].ktEmpty === false) {

                    this.arrPlayer[i].idMaster = this.idMaster;

                    if (this.arrPlayer[i].getData().user_id === this.idMaster) {
                        this.arrPlayer[i].getData().isMaster = true;
                        this.nameMaster = this.arrPlayer[i].getData().user_name;

                        this.arrPlayer[i].setCurrentData(this.arrPlayer[i].getData());
                    } else {
                        this.arrPlayer[i].getData().isMaster = false;
                        this.arrPlayer[i].setCurrentData(this.arrPlayer[i].getData());

                    }
                    if (this.listSongResult === null && this.ktPlay === false) {
                        this.arrPlayer[i].setTextMaster();
                    }
                }
            }

            this.header.setNguoiTao(this.nameMaster);
        }
    }

    userVarsUpdate(data) {
        let user = null;
        let player = null;
        if (data.changedVars.indexOf(OnlineModeCRDataField.online_mode_loaded) !== -1) {
            user = data.user;
            player = this.getDataPlayer(user);

            if (this.ktPlay === true) {
                let perLoad = user.getVariable(OnlineModeCRDataField.online_mode_loaded).value;
                for (let i = 0; i < this.arrPlayer.length; i++) {
                    let itemPlayer = this.arrPlayer[i];
                    if (itemPlayer.ktEmpty === false && itemPlayer.getData().user_id === player.user_id) {
                        if (perLoad > 0) {
                            itemPlayer.setLoading(perLoad);
                        }
                    }
                }
            }
        }

        if (data.changedVars.indexOf(OnlineModeCRDataField.online_mode_room_ready) !== -1) {
            user = data.user;
            player = this.getDataPlayer(user);

            if (user.isItMe === true && player.online_mode_room_ready === true && this.choosePlayList !== null) {
                this.removeChoosePlayList();
            }
            for (let i = 0; i < this.arrPlayer.length; i++) {
                let itemPlayer = this.arrPlayer[i];
                if (itemPlayer.ktEmpty === false) {
                    let data = itemPlayer.getData();
                    if (data.user_id == player.user_id) {
                        this.arrPlayer[i].setCurrentData(player);
                        if (this.ktPlay === false) {
                            itemPlayer.setTextMaster();
                        }
                        break;
                    }
                }
            }
            this.checkShowButtonChoi();
        }
    }



    userEnterRoom(data) {
        LogConsole.log("userEnterRoom------");
        if (data.room.isGame) {
            let user = data.user;
            LogConsole.log(user);
            let player = this.getDataPlayer(user);

            for (let i = 0; i < this.arrPlayer.length; i++) {
                if (this.arrPlayer[i].ktEmpty === true) {
                    this.arrPlayer[i].setMaster(this.idMaster);
                    this.arrPlayer[i].setData(player, i);
                    this.totalPlayerPlay++;
                    break;
                }
            }
        }
        this.checkShowButtonChoi();
        this.checkShowInviteFriend();
    }

    userExitRoom(data) {
        LogConsole.log("userExitRoom------ : " + data.user.isItMe);
        LogConsole.log(data.user);
        if (data.room.isGame) {
            if (data.user.isItMe) {
                this.event.back.dispatch();
            } else {
                let user = data.user;
                LogConsole.log(user);

                let userId = user.getVariable(OnlineModeCRDataField.user_id).value;

                for (let i = 0; i < this.arrPlayer.length; i++) {
                    if (this.arrPlayer[i].ktEmpty === false) {
                        let data = this.arrPlayer[i].getData();
                        if (data.user_id === userId) {
                            if (this.ktPlay) {
                                if (this.ktStart === false) {

                                }
                                data.user_id = -1;
                                this.arrPlayer[i].setCurrentData(data);
                                this.arrPlayer[i].setDisConnect();
                            } else {
                                this.arrPlayer[i].setEmpty();
                                this.totalPlayerPlay--;
                            }
                            break;
                        }
                    }
                }
                this.checkShowButtonChoi();
                this.checkShowInviteFriend();
            }
        }
    }

    buildListPlayer() {
        this.arrPlayer = [];
        for (let i = 0; i < this.arrLocal.length; i++) {
            let player = new OnlineModeUser();
            player.setEmpty();
            player.setIdx(i);
            player.event.click_avatar.add(this.click_avatar, this);
            player.event.choose_invite.add(this.addListFriend, this);

            if (i % 2 === 0) {
                player.x = -player.width - 200 * MainData.instance().scale;
            } else {
                player.x = game.width + 200 * MainData.instance().scale;
            }
            player.y = this.arrLocal[i].y;

            game.add.tween(player).to({
                x: this.arrLocal[i].x
            }, 250, Phaser.Easing.Power1, true, 400);

            this.addChild(player);
            this.arrPlayer.push(player);
        }
    }

    click_avatar(idx) {
        for (let i = 0; i < this.arrPlayer.length; i++) {
            if (this.arrPlayer[i].getIdx() === idx) {

            } else {
                this.arrPlayer[i].setCheckHideKichTween();
            }
        }
    }

    addListFriend() {
        if (SocketController.instance().dataMySeft.user_id === this.idMaster && this.ktPlay === false) {
            this.removeListFriend();
            this.listFriend = new OnlineModeListFriendScreen(this.idRoom, this.totalPlayerPlay);
            this.listFriend.event.back.add(this.backListFriend, this);
            this.addChild(this.listFriend);
            //SwitchScreen.instance().beginSwitch(null, this.listFriend, false);
        }
    }

    backListFriend() {
        SwitchScreen.instance().beginSwitch(this.listFriend, null, false);
        SwitchScreen.instance().event.tweenComplete.add(this.tweenListFriendComplete, this);
    }

    tweenListFriendComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenListFriendComplete, this);
        this.removeListFriend();
    }
    removeListFriend() {
        if (this.listFriend !== null) {
            this.removeChild(this.listFriend);
            this.listFriend.destroy();
            this.listFriend = null;
        }
    }

    addQuickChat() {
        this.removeQuickChat();
        this.quickChat = new OnlineModeChooseQuickChat();
        this.quickChat.event.close.add(this.removeQuickChat, this);
        this.quickChat.event.show_chat.add(this.chooseChatWatting, this);
        this.quickChat.y = game.height - this.quickChat.height;
        this.addChild(this.quickChat);
    }

    removeQuickChat() {
        if (this.quickChat !== null) {
            this.removeChild(this.quickChat);
            this.quickChat.destroy();
            this.quickChat = null;
        }
    }

    chooseChatWatting() {
        this.removeQuickChat();
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: "Chat",
            isSearch: false
        }

        KeyBoard.instance().show(options);
        KeyBoard.instance().event.enter.add(this.onSubmit, this);
        KeyBoard.instance().event.submit.add(this.onSubmit, this);
        KeyBoard.instance().event.cancle.add(this.onCancel, this);
    }

    hideKeyBoard() {
        KeyBoard.instance().hide();
        KeyBoard.instance().event.enter.remove(this.onSubmit, this);
        KeyBoard.instance().event.submit.remove(this.onSubmit, this);
        KeyBoard.instance().event.cancle.remove(this.onCancel, this);
    }

    onSubmit() {
        let strChat = KeyBoard.instance().getValue();
        if (strChat !== "") {
            let dataChat = new SFS2X.SFSObject();
            dataChat.putUtfString("chatWaitting", strChat);
            SocketController.instance().sendPublicChat(DataCommand.CHAT_ONLINE_MODE, dataChat);
        }
        this.onCancel();
    }
    onCancel() {
        this.hideKeyBoard();
    }


    chooseChoi() {
        LogConsole.log("chooseChoi");
        if (SocketController.instance().dataMySeft.diamond < this.roomBet) {
            ControllScreenDialog.instance().addDialogConfirnMoney(Language.instance().getData("69"), "chooseCanclePopupMoney");
        } else {
            this.btnChoi.inputEnabled = false;
            SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_START_GAME_REQUEST, null);
        }
    }
    chooseMoiBan() {
        LogConsole.log("chooseMoiBan");
        this.addListFriend();
    }

    chooseBack(ktBack = false) {
        //this.event.back.dispatch();
        if (ktBack === true && this.listFriend !== null) {

        } else {
            if (this.ktPlay === false && this.checkSendExit === false) {
                this.checkSendExit = true;
                ControllLoading.instance().showLoading();
                SocketController.instance().sendExitRoom();
            }
        }
    }

    removeTimeoutShowChoosePlayList() {
        if (this.idTimeOutShowPlayList !== null) {
            clearTimeout(this.idTimeOutShowPlayList);
        }
    }

    destroy() {
        this.removeShowResult();
        ControllLoadCacheUrl.instance().resetLoad();
        ControllSound.instance().removeAllSound();
        this.removeTimeoutShowChoosePlayList();
        this.removeEvent();
        this.removeAllItem();
        this.hideKeyBoard();
        super.destroy();
    }
}