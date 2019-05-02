import SocketController from "../../controller/SocketController.js";
import SwitchScreen from "../component/SwitchScreen.js";
import OnlineModeCreateRoom from "./screen/OnlineModeCreateRoom.js";
import OnlineModeQuickPlay from "./screen/OnlineModeQuickPlay.js";
import ControllSound from "../../controller/ControllSound.js";
import BaseLoadAsset from "../BaseLoadAsset.js";
import MainData from "../../model/MainData.js";

export default class OnlineModeScreen extends BaseLoadAsset {
    constructor() {
        super(game, null);
        this.onlineModeCreateRoom = null;
        this.onlineModeQuikPlay = null;

        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionCreateRoom.json",
                key: "positionCreateRoom"
            },
            {
                type: "atlas",
                link: "img/atlas/createroom.png",
                key: "createroom",
                linkJson: "img/atlas/createroom.json"
            }
        ];

        this.loadResource();
    }

    checkShowInvite(data) {
        if (this.onlineModeCreateRoom !== null) {
            this.onlineModeCreateRoom.checkShowInvite(data);
        }
    }

    loadFileComplete() {
        super.loadFileComplete();
        this.addEvent();
        this.addOnlineModeCreateRoom();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onRoomJoin.add(this.joinRoom, this);
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onRoomJoin.remove(this.joinRoom, this);
    }

    addQuickPlayGame() {

        this.removeQuickPlayGame();

        this.onlineModeQuikPlay = new OnlineModeQuickPlay();
        this.onlineModeQuikPlay.event.back.add(this.quickPlayBackToCreateRoom, this)
        this.addChild(this.onlineModeQuikPlay);

        if (this.onlineModeCreateRoom !== null) {
            SwitchScreen.instance().beginSwitch(this.onlineModeCreateRoom, this.onlineModeQuikPlay, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteCreateRoom, this);
        } else {

        }
    }

    tweenCompleteCreateRoom() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenCompleteCreateRoom, this);
        this.removeOnlineModeCreateRoom();
    }

    removeQuickPlayGame() {
        if (this.onlineModeQuikPlay !== null) {
            this.removeChild(this.onlineModeQuikPlay);
            this.onlineModeQuikPlay.destroy();
            this.onlineModeQuikPlay = null;
        }
    }

    quickPlayBackToCreateRoom() {
        this.addOnlineModeCreateRoom(true);
    }

    addOnlineModeCreateRoom(ktBack = false) {
        this.removeOnlineModeCreateRoom();
        this.onlineModeCreateRoom = new OnlineModeCreateRoom(ktBack);
        this.onlineModeCreateRoom.event.quickplay.add(this.addQuickPlayGame, this);
        this.addChild(this.onlineModeCreateRoom);

        if (this.onlineModeQuikPlay !== null) {
            SwitchScreen.instance().beginSwitch(this.onlineModeQuikPlay, this.onlineModeCreateRoom, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenCompleteQuickPlay, this);
        }
    }

    tweenCompleteQuickPlay() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenCompleteQuickPlay, this);
        this.removeQuickPlayGame();
    }

    removeOnlineModeCreateRoom() {
        if (this.onlineModeCreateRoom !== null) {
            this.removeChild(this.onlineModeCreateRoom);
            this.onlineModeCreateRoom.destroy();
            this.onlineModeCreateRoom = null;
        }
    }

    getData(data) {

    }

    joinRoom(data) {
        LogConsole.log("joinRoom");
        LogConsole.log(data);
        if (data.room.isGame) {
            let modeGameRoom = data.room.getVariable("mode").value;
            if (modeGameRoom === "OnlineMode") {
                if (this.onlineModeQuikPlay !== null) {
                    this.onlineModeQuikPlay.addPlayGame(data);
                } else {
                    this.addQuickPlayGame();
                    this.onlineModeQuikPlay.addPlayGame(data);
                }
            } else if (modeGameRoom === "OnlineModeRoom") {

                MainData.instance().dataJoinRoom = data;

                if (this.onlineModeCreateRoom !== null) {
                    this.onlineModeCreateRoom.checkDataRoom();
                } else {
                    if (this.onlineModeQuikPlay !== null) {
                        this.addOnlineModeCreateRoom(true);
                    } else {
                        this.addOnlineModeCreateRoom();
                    }
                }
            }
        }
    }

    destroy() {
        this.removeEvent();
        MainData.instance().positionCreateRoomData = null;
        ControllSound.instance().removeAllSound();
        super.destroy();
    }

}