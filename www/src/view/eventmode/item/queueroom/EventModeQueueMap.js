import BaseView from "../../../BaseView.js";
import EventModeQueueRoomLine from "./EventModeQueueRoomLine.js";
import SocketController from "../../../../controller/SocketController.js";
import GetEventModeLoadDispalyPlayer from "../../../../model/eventmode/server/getdata/GetEventModeLoadDispalyPlayer.js";
import EventModeQueueUser from "./EventModeQueueUser.js";
import UserEventModeMap from "../../../../model/eventmode/data/UserEventModeMap.js";
import EventModeCommand from "../../../../model/eventmode/datafield/EventModeCommand.js";
import EventModeDatafield from "../../../../model/eventmode/datafield/EventModeDatafield.js";
import EventModeQueueCountUser from "./EventModeQueueCountUser.js";
import RoomEvent from "../../../../model/eventmode/data/RoomEvent.js";;
import EventModeClockItem from "../selectroom/EventModeClockItem.js";
import MainData from "../../../../model/MainData.js";
import SpriteBase from "../../../component/SpriteBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";

export default class EventModeQueueMap extends BaseView {
    get constBeginY() {
        return 183 * MainData.instance().scale;
        //return 0
    }

    get constBeginX() {
        return 58 * MainData.instance().scale;
    }

    get constWidthLine() {
        return 480 * MainData.instance().scale;
    }

    get constKc() {
        return 115 * MainData.instance().scale;
    }



    constructor(data = {}) {
        super(game, null);

        this.dataEvent = Object.assign({}, new RoomEvent(), data);

        this.arrMap = [];
        this.arrUser = [];
        this.arrTop3 = [];
        this.objUser = {};
        let beginX = this.constBeginX;
        let beginY = this.constBeginY;
        let kc = this.constKc;
        this.idxTween = 2;
        this.idxLine = 0; // dang o dong nao
        this.localXFinish = 0;
        this.localYFinish = 0;
        this.tweenMap = null;


        this.layoutAddMap = game.add.group();
        this.layoutAddMap.y = 154 * MainData.instance().scale;
        this.addChild(this.layoutAddMap);

        this.layoutMap = game.add.group();
        this.layoutMap.y = 0;
        this.layoutAddMap.addChild(this.layoutMap);

        this.layoutCountPlayer = game.add.group();
        this.layoutMap.addChild(this.layoutCountPlayer);


        for (let i = 0; i < 4; i++) {
            let item = new EventModeQueueRoomLine();
            item.setIdxBegin(i);
            item.x = beginX;
            item.y = beginY;
            beginY -= kc;
            this.layoutMap.addChild(item);

            this.arrMap.push(item);
        }

        this.flagIcon = new SpriteBase(MainData.instance().positionEventMode.queueroom_icon_flag);
        this.flagIcon.visible = false;
        this.layoutMap.addChild(this.flagIcon);

        this.lineWin = new EventModeQueueRoomLine();
        this.lineWin.addLineRanking();
        this.lineWin.setHideLine();
        this.lineWin.x = this.constBeginX;
        this.lineWin.y = 0;
        this.addChild(this.lineWin);



        this.buildTop3();

        let graphics = game.add.graphics(0, 0);
        graphics.alpha = 0.3;
        graphics.beginFill(0xFF3300);
        graphics.drawRect(0, 0, 1080 * MainData.instance().scale, 445 * MainData.instance().scale);
        graphics.endFill();
        graphics.y = -41 * MainData.instance().scale;
        this.layoutAddMap.addChild(graphics);
        this.layoutAddMap.mask = graphics;

        this.addMe();

        if (this.dataEvent.finish_at > 0) {
            this.clock = new EventModeClockItem();
            this.clock.x = 18 * MainData.instance().scale;
            this.clock.y = 35 * MainData.instance().scale;
            this.clock.setTimer(this.dataEvent.finish_at);
            this.addChild(this.clock);
        }


        this.countUser = new ButtonWithText(MainData.instance().positionEventMode.count_playing_user, "0");

        this.addChild(this.countUser);

        /*
        this.timerToCountTime = this.game.time.create(true);
        this.timerToCountTime.loop(10, this.onTimerToCountTime, this);
        this.timerToCountTime.start();*/

        this.addEvent();


        // game.time.events.add(Phaser.Timer.SECOND * 2, this.beginTween, this);
    }

    getTime() {
        if (this.clock) {
            return this.clock.getTime();
        } else {
            return 0;
        }
    }

    addMe() {
        this.meUser = new EventModeQueueUser();
        this.meUser.setTopAvatarMe();
        let dataMeUser = new UserEventModeMap();
        dataMeUser.avatar = SocketController.instance().dataMySeft.avatar;
        dataMeUser.question_index = 0;
        dataMeUser.user_id = SocketController.instance().dataMySeft.user_id;
        dataMeUser.user_name = SocketController.instance().dataMySeft.user_name;
        dataMeUser.vip = SocketController.instance().dataMySeft.vip;
        this.meUser.setData(dataMeUser);
        this.changeLocalMe(0);
    }

    buildHighestLocalMe() {
        if (MainData.instance().idxHighest > 0) {
            this.flagIcon.visible = true;
            let objLocal = this.getLocalObject(MainData.instance().idxHighest);
            this.flagIcon.x = objLocal.x + 41;
            this.flagIcon.y = objLocal.y + 14;
        } else {
            this.flagIcon.visible = false;
        }
    }

    changeLocalMe(idxQuestion) {
        this.meUser.getData().question_index = idxQuestion;

        if (idxQuestion > 1 && MainData.instance().idxHighest < (idxQuestion - 1)) {
            MainData.instance().idxHighest = idxQuestion - 1;
        }

        if (idxQuestion === MainData.instance().idxHighest) {
            this.flagIcon.visible = false;
        }

        let objLocal = this.getLocalObject(idxQuestion);
        if (idxQuestion === 0) {
            this.meUser.x = objLocal.x;
            this.meUser.y = objLocal.y;
        } else {
            if (this.meUser.x != this.localXFinish) {
                this.meUser.x = this.localXFinish;
            }
            if (this.meUser.y != this.localYFinish) {
                this.meUser.y = this.localYFinish;
            }
        }



        this.localXFinish = objLocal.x;
        this.localYFinish = objLocal.y;

        this.layoutMap.addChild(this.meUser);

        game.add.tween(this.meUser).to({
            x: objLocal.x,
            y: objLocal.y
        }, 1000, Phaser.Easing.Power1, true);

        if (objLocal.local % 2 !== 0) {
            this.meUser.setNameBot();
        } else {
            this.meUser.setNameTop();
        }

        let idxCheck = parseInt(idxQuestion / 6);

        if (this.idxLine < idxCheck) {
            this.idxLine = idxCheck;
            if (this.idxLine > 1) {
                setTimeout(() => {
                    this.beginTween();
                }, 1200);
            }
        }
    }

    buildTop3() {
        this.arrTop3 = [];
        for (let i = 0; i < 3; i++) {
            let user = new EventModeQueueUser();
            user.setTopAvatar(i);
            user.setNameBot();
            user.visible = false;
            user.x = this.constBeginX - 26 + (this.constWidthLine / 4) * (i + 1);
            user.y = this.lineWin.y + 50 * MainData.instance().scale;
            this.addChild(user);
            this.arrTop3.push(user);
        }
    }

    beginTween() {
        LogConsole.log("beginTween ----------------------------");


        this.arrMap[this.idxTween].setLine();

        let endLocal = 6 + 6 * (this.idxLine + 2);
        let beginLocal = endLocal - 7;

        for (let key in this.objUser) {
            if (this.objUser[key].getData().question_index > beginLocal && this.objUser[key].getData().question_index < endLocal) {
                this.objUser[key].visible = true;
            }
        }

        LogConsole.log("this.idxLine : " + this.idxLine);

        let idxHide = this.idxTween - 2;
        if (idxHide < 0) {
            idxHide = this.arrMap.length + idxHide;
        }



        this.tweenMap = game.add.tween(this.layoutMap).to({
            y: this.constKc * (this.idxLine - 1)
        }, 2000, Phaser.Easing.Power1, true);
        this.tweenMap.onComplete.add(this.onCompleteTweenMap, this);

        game.add.tween(this.arrMap[idxHide]).to({
            alpha: 0
        }, 1500, Phaser.Easing.Power1, true);
    }

    onCompleteTweenMap() {
        LogConsole.log("onCompleteTweenMap" + this.idxLine);



        let idxHide = this.idxTween - 2;
        if (idxHide < 0) {
            idxHide = this.arrMap.length + idxHide;
        }

        this.arrMap[idxHide].y = this.constBeginY - (this.idxLine + 2) * this.constKc;
        this.arrMap[idxHide].alpha = 1;
        this.arrMap[idxHide].setHideLine();

        this.idxTween++;
        if (this.idxTween === this.arrMap.length) {
            this.idxTween = 0;
        }

        let endLocal = 6 + 6 * (this.idxLine - 1);

        for (let key in this.objUser) {
            if (this.objUser[key].getData().question_index < endLocal) {
                this.objUser[key].visible = false;
            }
        }

    }


    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        if (MainData.instance().idxHighest === -1) {
            //SocketController.instance().sendData(EventModeCommand.EVENT_MODE_HIGHEST_ACHIEVED, null);
        } else {
            this.buildHighestLocalMe();
        }
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_LOAD_DISPLAY_PLAYERS:
                let objData = GetEventModeLoadDispalyPlayer.begin(data.params);
                this.arrUser = objData.arrUser;
                this.topThree = objData.topThree;
                this.countUser.setText(data.params.getInt("number_user"));
                this.buildArrUser();
                break;
            case EventModeCommand.EVENT_MODE_START_GAME:
            case EventModeCommand.EVENT_MODE_MOVE_TO_NEXT_QUESTION:
                this.changeLocalMe(data.params.getInt(EventModeDatafield.question_index));
                break;
            case EventModeCommand.EVENT_MODE_HIGHEST_ACHIEVED:
                MainData.instance().idxHighest = data.params.getInt(EventModeDatafield.highest_achieved);
                this.buildHighestLocalMe();
                break;
        }
    }

    getLocalObject(question_index) {
        let objLocal = {
            local: 0,
            x: 0,
            y: 0,
            vc: 0
        }
        objLocal.vc = parseInt(question_index / 6);
        objLocal.local = question_index % 6;
        let kc2Item = this.constWidthLine / 5;

        if (objLocal.vc % 2 === 0) {
            objLocal.x = this.constBeginX - 30 * MainData.instance().scale + kc2Item * objLocal.local;

        } else {
            objLocal.x = this.constBeginX - 30 * MainData.instance().scale + this.constWidthLine - kc2Item * objLocal.local;
        }

        this.line = parseInt(question_index / 6);
        objLocal.y = this.constBeginY + 6 * MainData.instance().scale - this.constKc * objLocal.vc + 42 * MainData.instance().scale;

        return objLocal;
    }



    buildArrUser() {
        LogConsole.log("buildArrUser----------");
        /*
        this.arrUser = [];
        for (let i = 0; i < 1; i++) {
            let user = new UserEventModeMap();
            user.user_id = i;
            user.question_index = i;
            user.user_name = "Viet PV " + i;

            this.arrUser.push(user);
        }*/

        for (let i = 0; i < this.topThree.length; i++) {
            if (this.arrTop3[i]) {
                if (this.arrTop3[i].getData() === null) {
                    this.arrTop3[i].visible = true;
                }
                this.arrTop3[i].setDataRank(this.topThree[i], i);
            }
        }

        let endLocal = 6 + 6 * (this.idxLine + 1);
        let beginLocal = 6 + 6 * (this.idxLine - 2) - 1;

        LogConsole.log("beginLocal : " + beginLocal);
        LogConsole.log("endLocal : " + endLocal);
        LogConsole.log(this.arrUser);

        for (let id in this.objUser) {
            let item = this.objUser[id];
            let dataCheck = item.getData();
            if (dataCheck.is_dead === 1) {
                this.layoutMap.removeChild(item);
                item.destroy();
                item = null;
                delete this.objUser[id];
            }
        }
        let objCountLocal = {};
        let question_obj_user = 0;
        let item = null;
        let idx = 0;
        for (let i = 0; i < this.arrUser.length; i++) {
            if (this.objUser.hasOwnProperty(this.arrUser[i].user_id)) {
                question_obj_user = this.objUser[this.arrUser[i].user_id].getData().question_index;
                let question_index_to = this.arrUser[i].question_index;

                LogConsole.log("user_id : " + this.arrUser[i].user_id);
                LogConsole.log("question_obj_user : " + question_obj_user);
                LogConsole.log("question_index_to : " + question_index_to);

                if (question_obj_user < question_index_to) {
                    item = this.objUser[this.arrUser[i].user_id];
                    let lengthQuestion = question_index_to - question_obj_user;
                    LogConsole.log("lengthQuestion : " + lengthQuestion);
                    for (let j = 0; j < lengthQuestion; j++) {
                        let time = (2000 / lengthQuestion);
                        game.time.events.add(time * j, this.buildLocalTween, this, item, question_obj_user + j + 1, time);
                    }
                    item.updateData(this.arrUser[i]);
                } else {
                    let objLocal = this.getLocalObject(question_obj_user);
                    item = this.objUser[this.arrUser[i].user_id];
                    item.x = objLocal.x;
                    item.y = objLocal.y;
                    if (objLocal.local % 2 !== 0) {
                        item.setNameBot();
                    } else {
                        item.setNameTop();
                    }

                    LogConsole.log("this.arrUser[i].is_dead : " + this.arrUser[i].is_dead);
                    if (this.arrUser[i].is_dead === 1) {
                        item.setTopAvatarDie();
                    }

                    item.updateData(this.arrUser[i]);
                }

            } else {
                idx++;
                this.objUser[this.arrUser[i].user_id] = new EventModeQueueUser();
                item = this.objUser[this.arrUser[i].user_id];
                item.setTopAvatar(4);
                item.setData(this.arrUser[i], idx);
                let question_index = this.arrUser[i].question_index;
                let objLocal = this.getLocalObject(question_index);

                item.x = objLocal.x;
                item.y = objLocal.y;

                if (objLocal.local % 2 !== 0) {
                    item.setNameBot();
                } else {
                    item.setNameTop();
                }

                this.layoutMap.addChild(item);

                item.visible = false;
                item.setData(this.arrUser[i]);
            }

            item = this.objUser[this.arrUser[i].user_id];
            question_obj_user = item.getData().question_index;

            if (this.idxLine < 2) {
                if (question_obj_user > 17) {
                    item.visible = false;
                } else {
                    item.visible = true;
                }
            } else {

                if (question_obj_user < endLocal &&
                    question_obj_user > beginLocal) {
                    item.visible = true;
                } else {
                    item.visible = false;
                }
            }


            if (objCountLocal[question_obj_user]) {
                objCountLocal[question_obj_user] += 1;
                item.hideName();
            } else {
                objCountLocal[question_obj_user] = 1;
                if (this.meUser.getData().question_index === question_obj_user) {
                    item.hideName();
                } else {
                    item.showName();
                }
            }
        }

        if (objCountLocal[this.meUser.getData().question_index]) {
            objCountLocal[this.meUser.getData().question_index] += 1;
        } else {
            objCountLocal[this.meUser.getData().question_index] = 1;
        }

        while (this.layoutCountPlayer.children.length > 0) {
            let itemCount = this.layoutCountPlayer.children[0];
            this.layoutCountPlayer.removeChild(itemCount);
            itemCount.destroy();
            itemCount = null;
        }

        /*
        for (let i = 0; i < 20; i++) {
            objCountLocal[i] = 99;
        }*/

        LogConsole.log(objCountLocal);

        for (let q_index in objCountLocal) {
            LogConsole.log("q_index : " + q_index);
            let ktShow = true;
            if (this.idxLine < 2) {
                if (q_index > 17) {
                    ktShow = false;
                } else {

                }
            } else {
                if (q_index < endLocal &&
                    q_index > beginLocal) {

                } else {
                    ktShow = false;
                }
            }

            LogConsole.log("ktShow : " + ktShow);

            if (ktShow && objCountLocal[q_index] > 1) {
                let objLocal = this.getLocalObject(q_index);
                let countItem = new EventModeQueueCountUser();

                /*
                let objLocal = {
                    local: 0,
                    x: 0,
                    y: 0,
                    vc: 0
                }*/

                LogConsole.log("objLocal[q_index] : " + objCountLocal[q_index]);
                countItem.x = objLocal.x;
                countItem.y = objLocal.y;

                if (objLocal.vc % 2 === 0) {
                    if (objLocal.local === 0) {
                        countItem.setBottom(objCountLocal[q_index]);
                        countItem.x = objLocal.x - 15 * MainData.instance().scale;
                        countItem.y = objLocal.y + 35 * MainData.instance().scale;
                    } else if (objLocal.local === 5) {
                        countItem.setBottom(objCountLocal[q_index]);
                        countItem.y = objLocal.y + 35 * MainData.instance().scale;
                        countItem.x = objLocal.x + 77 * MainData.instance().scale;
                    } else {
                        countItem.setRight(objCountLocal[q_index]);
                        countItem.x = objLocal.x + 18 * MainData.instance().scale;
                        if (objLocal.local % 2 !== 0) {
                            countItem.y = objLocal.y + 6 * MainData.instance().scale;
                        } else {
                            countItem.y = objLocal.y + 80 * MainData.instance().scale;
                        }
                    }
                } else {
                    if (objLocal.local === 0) {
                        countItem.setBottom(objCountLocal[q_index]);
                        countItem.y = objLocal.y + 35 * MainData.instance().scale;
                        countItem.x = objLocal.x + 77 * MainData.instance().scale;
                    } else if (objLocal.local === 5) {
                        countItem.setBottom(objCountLocal[q_index]);
                        countItem.x = objLocal.x - 15 * MainData.instance().scale;
                        countItem.y = objLocal.y + 35 * MainData.instance().scale;
                    } else {
                        countItem.setRight(objCountLocal[q_index]);
                        countItem.x = objLocal.x + 18 * MainData.instance().scale;
                        if (objLocal.local % 2 !== 0) {
                            countItem.y = objLocal.y + 6 * MainData.instance().scale;
                        } else {
                            countItem.y = objLocal.y + 80 * MainData.instance().scale;
                        }
                    }
                }

                this.layoutCountPlayer.addChild(countItem);
            }
        }

        this.layoutMap.addChild(this.meUser);
    }

    buildLocalTween(item, question_index, time) {
        let objLocal = this.getLocalObject(question_index);
        game.add.tween(item).to({
            x: objLocal.x,
            y: objLocal.y
        }, time, Phaser.Easing.Power1, true);

        if (objLocal.local % 2 !== 0) {
            item.setNameBot();
        } else {
            item.setNameTop();
        }
    }

    destroy() {
        game.tweens.removeAll();
        this.removeEvent();
        this.removeAllItem();
        super.destroy();
    }
}