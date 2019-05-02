import BaseView from "../../BaseView.js";
import EventModeHeaderQueue from "../item/queueroom/EventModeHeaderQueue.js";
import EventModeQueueMap from "../item/queueroom/EventModeQueueMap.js";
import SocketController from "../../../controller/SocketController.js";
import EventModeCommand from "../../../model/eventmode/datafield/EventModeCommand.js";
import EventModeControllLoadQuestion from "../item/play/EventModeControllLoadQuestion.js";
import RoomEvent from "../../../model/eventmode/data/RoomEvent.js";
import MainData from "../../../model/MainData.js";
import ControllSound from "../../../controller/ControllSound.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import IronSource from "../../../IronSource.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";


export default class EventModePlayRoomScreen extends BaseView {
    constructor(data = {}) {
        super(game, null);

        this.event = {
            backToSelect: new Phaser.Signal(),
            end_game: new Phaser.Signal(),
            done_game: new Phaser.Signal(),
            cancle_bad_connect: new Phaser.Signal()
        }
        this.dataEvent = Object.assign({}, new RoomEvent(), data);

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.header = new EventModeHeaderQueue();
        this.header.setTitle(this.dataEvent.name);
        this.header.setHideBack();
        this.header.setHideTrophy();
        this.addChild(this.header);

        this.map = new EventModeQueueMap(this.dataEvent);
        if (game.height > 1136) {
            this.map.y = 50 * MainData.instance().scale + (game.height - 1136) / 2;
        } else {
            this.map.y = 50 * MainData.instance().scale;
        }

        this.addChild(this.map);

        this.question = new EventModeControllLoadQuestion();
        this.question.event.cancle_bad_connect.add(this.cancleBadConnect, this);
        this.question.event.fail_question.add(this.failQuestion, this);
        this.question.event.done_game.add(this.doneQuestion, this);
        this.question.event.change_local_me.add(this.changeLocalMe, this);
        this.addChild(this.question);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Event_mode_play);
    }

    doneQuestion() {
        this.event.done_game.dispatch();
    }

    failQuestion(idx) {
        this.event.end_game.dispatch(idx);
    }

    changeLocalMe(idx) {
        this.map.changeLocalMe(idx);
    }

    cancleBadConnect() {

        this.event.cancle_bad_connect.dispatch();
    }


    chooseTrophy() {

    }

    chooseBack() {

    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onUserExitRoom.add(this.userExitRoom, this);
        SocketController.instance().sendData(EventModeCommand.EVENT_MODE_PLAY_GAME_REQUEST, null);
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onUserExitRoom.remove(this.userExitRoom, this);
        this.question.event.cancle_bad_connect.remove(this.cancleBadConnect, this);
        this.question.event.fail_question.remove(this.failQuestion, this);
        this.question.event.done_game.remove(this.doneQuestion, this);
        this.question.event.change_local_me.remove(this.changeLocalMe, this);
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_START_GAME:
                IronSource.instance().playEventMode();
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_start_eventmode);
                IronSource.instance().playEventMode();
                this.question.removeLoading();
                break;
        }
    }

    userExitRoom(event) {
        if (event.room.isGame) {
            if (event.user.isItMe) {
                this.event.backToSelect.dispatch();
            }
        }
    }

    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        ControllSound.instance().removeAllSound();
        this.removeEvent();
        this.removeAllItem();
        super.destroy();
    }

}