import BaseView from "../../BaseView.js";
import EventModeHeaderQueue from "../item/queueroom/EventModeHeaderQueue.js";
import SocketController from "../../../controller/SocketController.js";
import EventModeCommand from "../../../model/eventmode/datafield/EventModeCommand.js";
import SendEventModeJoin from "../../../model/eventmode/server/senddata/SendEventModeJoin.js";
import EventModeQueueMap from "../item/queueroom/EventModeQueueMap.js";
import EventModeQueueButtonPlay from "../item/queueroom/EventModeQueueButtonPlay.js";
import RoomEvent from "../../../model/eventmode/data/RoomEvent.js";
import EventModeChat from "../item/chat/EventModeChat.js";
import MainData from "../../../model/MainData.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import EventGame from "../../../controller/EventGame.js";
import KeyBoard from "../../component/KeyBoard.js";
import IronSource from "../../../IronSource.js";
import ControllLoading from "../../ControllLoading.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class EventModeQueueScreen extends BaseView {
    constructor(data = {}) {
        super(game, null);

        ControllLoading.instance().showLoading();
        this.dataEvent = Object.assign({}, new RoomEvent(), data);

        this.event = {
            back: new Phaser.Signal(),
            ranking: new Phaser.Signal(),
            play_room: new Phaser.Signal()
        }
        this.positionEventMode = JSON.parse(game.cache.getText('positionEventMode'));
        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.map = new EventModeQueueMap(this.dataEvent);
        this.map.y = 50 * MainData.instance().scale;
        this.addChild(this.map);

        this.chat = new EventModeChat(this.dataEvent.id);
        this.addChild(this.chat);


        this.header = new EventModeHeaderQueue();
        this.header.event.trophy.add(this.chooseTrophy, this);
        this.header.event.back.add(this.chooseBack, this);
        this.header.setTitle(this.dataEvent.name);
        this.addChild(this.header);

        this.btnPlay = new EventModeQueueButtonPlay(this.positionEventMode.queueroom_bg_button_play, this.choosePlay, this);
        this.btnPlay.y = game.height - 138 * MainData.instance().scale;
        this.addChild(this.btnPlay);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Event_mode_join_room);

        IronSource.instance().showInterstitialEventMode();
        // this.addEvent();
    }

    addEvent(checkJoinRoom) {

        ControllSoundFx.instance().playSound(ControllSoundFx.joineventmode);
        EventGame.instance().event.backButton.add(this.chooseBack, this);

        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onUserExitRoom.add(this.userExitRoom, this);
        if (this.dataEvent.id > 0) {
            if (checkJoinRoom === false) {
                SocketController.instance().sendData(EventModeCommand.EVENT_MODE_JOIN_REQUEST, SendEventModeJoin.begin(this.dataEvent.id));
            } else {
                ControllLoading.instance().hideLoading();
            }
        } else {
            this.event.back.dispatch();
        }
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onUserExitRoom.remove(this.userExitRoom, this);
    }

    userExitRoom(event) {
        if (event.room.isGame) {
            if (event.user.isItMe) {
                this.event.back.dispatch();
            }
        }
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_JOIN_RESPONSE:
                if (data.params.getUtfString("status") === "FAILED") {
                    this.event.back.dispatch();
                }
                ControllLoading.instance().hideLoading();
                break;
        }
    }

    choosePlay() {
        LogConsole.log("choosePlay");
        KeyBoard.instance().hide();

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Event_mode_play_button);
        if (this.map.getTime() > 5) {
            if (SocketController.instance().dataMySeft.ticket < 1) {
                ControllScreenDialog.instance().addDialogConfirnTicket(Language.instance().getData("20"));
            } else {
                ControllSoundFx.instance().playSound(ControllSoundFx.clickbuttonplayeventmode);
                this.btnPlay.inputEnabled = false;
                this.event.play_room.dispatch();
            }
        } else {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("27"));
        }
    }

    chooseTrophy() {
        this.event.ranking.dispatch(this.dataEvent.id);
    }

    chooseBack() {
        //this.event.back.dispatch(); 
        //console.log('HERE HERE HERE');
        ControllSoundFx.instance().removeSound();
        SocketController.instance().sendExitRoom();

    }

    destroy() {
        ControllSoundFx.instance().removeSound();
        ControllLoadCacheUrl.instance().resetLoad();
        this.removeEvent();
        this.chat.destroy();
        this.map.destroy();
        super.destroy();
    }
}