import EventModeQueueScreen from "./screen/EventModeQueueScreen.js";
import EventModeSelectRoomScreen from "./screen/EventModeSelectRoomScreen.js";
import EventModeRankingScreen from "./screen/EventModeRankingScreen.js";
import EventModePlayRoomScreen from "./screen/EventModePlayRoomScreen.js";
import SwitchScreen from "../component/SwitchScreen.js";
import SocketController from "../../controller/SocketController.js";
import EventModeCommand from "../../model/eventmode/datafield/EventModeCommand.js";
import EventModePopupWin from "./item/play/EventModePopupWin.js";
import EventModeDatafield from "../../model/eventmode/datafield/EventModeDatafield.js";
import RoomEvent from "../../model/eventmode/data/RoomEvent.js";
import EventModePopupDone from "./item/play/EventModePopupDone.js";
import GetEventModeRewardNotification from "../../model/eventmode/server/getdata/GetEventModeRewardNotification.js";
import EventModePopupTop100 from "./item/play/EventModePopupTop100.js";
import ControllSound from "../../controller/ControllSound.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import EventGame from "../../controller/EventGame.js";
import BaseLoadAsset from "../BaseLoadAsset.js";
import Language from "../../model/Language.js";
import MainData from "../../model/MainData.js";

export default class EventModeScreen extends BaseLoadAsset {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal()
        }

        this.startTime = 0;
        this.endTime = 0;
        this.ktshowBadConnection = false;

        this.dataEventRoom = new RoomEvent();
        this.queueScreen = null;
        this.selectRoomScreen = null;
        this.rankingScreen = null;
        this.playRoomScreen = null;
        this.dialogWin = null;
        this.screenBegin = "";
        this.popupTop100 = null;
        this.checkJoinRoom = false;
        this.ktPlay = false;

        this.arrResource = [
            {
                type: "atlas",
                link: "img/atlas/eventmode.png",
                key: "eventmode",
                linkJson: "img/atlas/eventmode.json"
            },
            {
                type: "text",
                link: "img/config/positionEventMode.json",
                key: "positionEventMode"
            }
        ]

        this.loadResource();
    }

    loadFileComplete() {

        super.loadFileComplete();

        //this.addQueueScreen();
        this.addSelectRoomScreen();
        //this.addRankingScreen();
        //this.addPlayRoomScreen();
        /*
        this.addDialogTop100({
            event: {
                name: "aaa"
            },
            event_top_rank_log: {
                top: 1
            },
            event_reward: {
                diamond: 10,
                ticket: 10,
                support_item: 10
            }
        })
        */
        //this.addDialogDoneGame();
        //this.addDialogEndGame();
        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onRoomJoin.add(this.joinRoom, this);
        EventGame.instance().event.bad_connection.add(this.checkBadConnection, this);
        EventGame.instance().event.chooseExitBadConnection.add(this.chooseExitBadConnection, this);
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onRoomJoin.remove(this.joinRoom, this);
        EventGame.instance().event.bad_connection.remove(this.checkBadConnection, this);
        EventGame.instance().event.chooseExitBadConnection.remove(this.chooseExitBadConnection, this);
    }

    checkBadConnection() {
        if (this.ktPlay === false && this.ktshowBadConnection === false && this.queueScreen !== null) {
            this.ktshowBadConnection = true;
            ControllScreenDialog.instance().addBadConnection();
        }
    }

    chooseExitBadConnection() {
        if (this.queueScreen !== null) {
            this.queueScreen.chooseBack();
        } else {
            this.chooseBack();
        }
    }

    getData(data) {
        let countTime = 0;
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_START_GAME:
                this.ktPlay = true;
                this.startTime = this.getTime();
                break;
            case EventModeCommand.EVENT_MODE_QUESTION_RESPONSE:
                this.ktPlay = true;
                break;
            case EventModeCommand.EVENT_MODE_FINISH_GAME:
                this.ktPlay = false;
                this.endTime = this.getTime();
                countTime = parseInt((this.endTime - this.startTime) / 1000);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, countTime);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_eventmode);
                ControllSound.instance().removeSound();
                game.time.events.add(Phaser.Timer.SECOND * 2, this.addDialogFinishGame, this, data.params.getInt(EventModeDatafield.question_index));
                //this.addDialogFinishGame(data.params.getInt(EventModeDatafield.question_index));
                break;
            case EventModeCommand.EVENT_MODE_DONE_GAME:
                this.endTime = this.getTime();
                countTime = parseInt((this.endTime - this.startTime) / 1000);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, countTime);
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_eventmode);

                game.time.events.add(Phaser.Timer.SECOND * 2, this.addDialogDoneGame, this);
                //this.addDialogDoneGame();
                ControllSound.instance().removeSound();
                break;
            case EventModeCommand.EVENT_MODE_REWARD_NOTIFICATION:
                ControllSound.instance().removeSound();
                game.time.events.add(Phaser.Timer.SECOND * 0.2, this.addDialogTop100, this, GetEventModeRewardNotification.begin(data.params));
                break;
            case EventModeCommand.EVENT_MODE_EVENT_ENDED:
                ControllSound.instance().removeSound();
                game.time.events.add(Phaser.Timer.SECOND * 0.4, this.addDialogEndGame, this);
                break;
        }
    }

    joinRoom(data) {
        LogConsole.log("data.room.isGame : " + data.room.isGame);
        if (data.room.isGame) {
            this.checkJoinRoom = true;
        } else {
            this.addSelectRoomScreen();
        }
    }
    addEventScreen() {
        if (this.rankingScreen !== null) {
            this.rankingScreen.addEvent();
        }
        if (this.playRoomScreen !== null) {
            this.playRoomScreen.addEvent();
        }
        if (this.selectRoomScreen !== null) {
            this.selectRoomScreen.addEvent();
        }
        if (this.queueScreen !== null) {
            this.queueScreen.addEvent(this.checkJoinRoom);
        }
    }
    tweenCompleteQueueScreen() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenCompleteQueueScreen, this);
        this.removeQueueScreen();
        this.addEventScreen();
    }
    tweenCompleteSelectRoomScreen() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenCompleteSelectRoomScreen, this);
        this.removeSelectRoomScreen();
        this.addEventScreen();
    }
    tweenCompleteRankingScreen() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenCompleteRankingScreen, this);
        this.removeRankingScreen();
        this.addEventScreen();
    }

    addSelectRoomScreen() {
        this.screenBegin = "selectroom";
        this.removeSelectRoomScreen();
        this.checkJoinRoom = false;
        this.selectRoomScreen = new EventModeSelectRoomScreen();
        this.selectRoomScreen.event.view_history.add(this.addRankingScreen, this);
        this.selectRoomScreen.event.choose_event.add(this.addQueueScreen, this);
        this.selectRoomScreen.event.back.add(this.chooseBack, this);
        this.addChild(this.selectRoomScreen);

        LogConsole.log("this.queueScreen : " + this.queueScreen);

        if (this.queueScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.queueScreen, this.selectRoomScreen, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteQueueScreen, this);
        } else if (this.rankingScreen !== null) {
            this.removeRankingScreen();
            this.selectRoomScreen.addEvent();
        } else {
            this.selectRoomScreen.addEvent();
        }

    }
    removeSelectRoomScreen() {
        if (this.selectRoomScreen !== null) {
            this.removeChild(this.selectRoomScreen);
            this.selectRoomScreen.destroy();
            this.selectRoomScreen = null;
        }
    }

    addQueueScreen(data = {}) {
        this.screenBegin = "queue";
        this.dataEventRoom = Object.assign({}, this.dataEventRoom, data);
        this.removeQueueScreen();
        this.queueScreen = new EventModeQueueScreen(this.dataEventRoom);
        this.queueScreen.event.ranking.add(this.addRankingScreen, this);
        this.queueScreen.event.back.add(this.addSelectRoomScreen, this);
        this.queueScreen.event.play_room.add(this.addPlayRoomScreen, this);
        this.addChild(this.queueScreen);

        if (this.selectRoomScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.selectRoomScreen, this.queueScreen, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteSelectRoomScreen, this);
        } else if (this.rankingScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.rankingScreen, this.queueScreen, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteRankingScreen, this);
        } else if (this.playRoomScreen !== null) {
            this.removePlayRoomScreen();
            this.queueScreen.addEvent(this.checkJoinRoom);
        } else {
            this.queueScreen.addEvent(this.checkJoinRoom);
        }
    }

    joinRoomQueue() {
        this.checkJoinRoom = true;
    }

    removeQueueScreen() {
        if (this.queueScreen !== null) {
            this.removeChild(this.queueScreen);
            this.queueScreen.destroy();
            this.queueScreen = null;
        }
    }

    addRankingScreen(event_id = 0) {
        if (event_id > 0) {
            this.event_id = event_id;
        }
        this.removeRankingScreen();
        this.rankingScreen = new EventModeRankingScreen(this.event_id);
        this.rankingScreen.event.back.add(this.chooseBackTop, this);
        this.addChild(this.rankingScreen);

        if (this.queueScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.queueScreen, this.rankingScreen, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteQueueScreen, this);
        } else if (this.selectRoomScreen !== null) {
            this.removeSelectRoomScreen();
            this.rankingScreen.addEvent();
        } else if (this.playRoomScreen !== null) {
            this.removePlayRoomScreen();
            this.rankingScreen.addEvent();
        } else {
            this.rankingScreen.addEvent();
        }


    }

    chooseBackTop() {
        if (this.screenBegin === "selectroom") {
            this.addSelectRoomScreen();
        } else if (this.screenBegin === "queue") {
            this.addQueueScreen();
        } else if (this.screenBegin === "play") {
            this.addPlayRoomScreen();
        }
    }

    removeRankingScreen() {
        if (this.rankingScreen !== null) {
            this.removeChild(this.rankingScreen);
            this.rankingScreen.destroy();
            this.rankingScreen = null;
        }
    }

    addPlayRoomScreen() {
        this.screenBegin = "play";
        this.removePlayRoomScreen();
        this.playRoomScreen = new EventModePlayRoomScreen(this.dataEventRoom);
        this.playRoomScreen.event.backToSelect.add(this.addSelectRoomScreen, this);
        this.playRoomScreen.event.end_game.add(this.addDialogFinishGameUser, this);
        this.playRoomScreen.event.done_game.add(this.addDialogDoneGameUser, this);
        this.playRoomScreen.event.cancle_bad_connect.add(this.addQueueScreen, this);
        this.addChild(this.playRoomScreen);
        if (this.queueScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.queueScreen, this.playRoomScreen, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteQueueScreen, this);
        } else {
            this.playRoomScreen.addEvent();
        }
    }

    addDialogFinishGameUser(idx) {
        this.ktPlay = false;
        this.endTime = this.getTime();
        let countTime = parseInt((this.endTime - this.startTime) / 1000);
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, countTime);
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_eventmode);
        ControllSound.instance().removeSound();
        game.time.events.add(Phaser.Timer.SECOND * 2, this.addDialogFinishGame, this, idx);
    }

    addDialogDoneGameUser() {
        this.endTime = this.getTime();
        let countTime = parseInt((this.endTime - this.startTime) / 1000);
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, countTime);
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_eventmode);

        game.time.events.add(Phaser.Timer.SECOND * 2, this.addDialogDoneGame, this);
        //this.addDialogDoneGame();
        ControllSound.instance().removeSound();
    }


    removePlayRoomScreen() {
        if (this.playRoomScreen !== null) {
            this.removeChild(this.playRoomScreen);
            this.playRoomScreen.destroy();
            this.playRoomScreen = null;
        }
    }

    addDialogDoneGame() {
        this.removePlayRoomScreen();
        this.removeDialogFinishGame();
        this.dialogWin = new EventModePopupDone(this.dataEventRoom);
        this.dialogWin.event.exit.add(this.chooseExitDialog, this);
        this.addChild(this.dialogWin);
    }

    removeDialogDoneGame() {

    }

    addDialogFinishGame(question_index) {
        this.removePlayRoomScreen();
        this.removeDialogFinishGame();
        this.dialogWin = new EventModePopupWin(question_index, this.dataEventRoom);
        this.dialogWin.event.exit.add(this.chooseExitDialog, this);
        this.dialogWin.event.continute.add(this.chooseContinuteDialog, this);
        this.addChild(this.dialogWin);
    }
    chooseExitDialog() {
        LogConsole.log("chooseExitDialog");
        this.removeDialogFinishGame();
        this.addQueueScreen();
    }
    chooseContinuteDialog() {
        LogConsole.log("chooseContinuteDialog");
        this.removeDialogFinishGame();
        this.addPlayRoomScreen();
    }

    removeDialogFinishGame() {
        if (this.dialogWin !== null) {
            this.removeChild(this.dialogWin);
            this.dialogWin.destroy();
            this.dialogWin = null;
        }
    }

    addDialogTop100(data) {
        this.removeDialogTop100();
        this.popupTop100 = new EventModePopupTop100(data);
        this.popupTop100.event.exit.add(this.removeDialogTop100, this);
        this.popupTop100.event.view_result.add(this.addRankingScreen, this);
        this.popupTop100.event.accept_gift.add(this.removeDialogTop100, this);
        this.addChild(this.popupTop100);
    }

    removeDialogTop100() {
        if (this.popupTop100 !== null) {
            this.removeChild(this.popupTop100);
            this.popupTop100.destroy();
            this.popupTop100 = null;
        }
    }

    addDialogEndGame() {
        this.removeDialogFinishGame();
        this.addSelectRoomScreen();
        ControllScreenDialog.instance().addDialog(Language.instance().getData("27"));

    }

    chooseBack() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }

    destroy() {
        MainData.instance().positionEventModeData = null;
        this.removeEvent();
        super.destroy();
    }
}