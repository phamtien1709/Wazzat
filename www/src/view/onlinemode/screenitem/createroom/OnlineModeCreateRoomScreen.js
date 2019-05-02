import FaceBookCheckingTools from "../../../../FaceBookCheckingTools.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import OnlineModeChooseBetScreen from "./OnlineModeChooseBetScreen.js";
import BaseView from "../../../BaseView.js";
import OnlineModeChoosePlaylistScreen from "./OnlineModeChoosePlaylistScreen.js";
import SwitchScreen from "../../../component/SwitchScreen.js";
import MainData from "../../../../model/MainData.js";

export default class OnlineModeCreateRoomScreen extends BaseView {
    constructor() {
        super(game, null);
    }

    afterCreate() {
        MainData.instance().modeplay = MainData.instance().MODEPLAY.createroom;
        this.event = {
            back: new Phaser.Signal(),
            create_room: new Phaser.Signal()
        }
        this.chooseBetScreen = null;
        this.choosePlaylistScreen = null;
        this.addChooseBetScreen();

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Party_online_mode_Creatroom);
        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {
        switch (data.cmd) {
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_CREATE_RESPONSE:
                //this.event.create_room.dispatch();
                break;
        }
    }

    addChooseBetScreen() {
        this.removeChooseBetScreen();
        this.chooseBetScreen = new OnlineModeChooseBetScreen();
        this.chooseBetScreen.event.choose_bet.add(this.chooseBetComplete, this);
        this.chooseBetScreen.event.back.add(this.chooseBack, this);
        this.addChild(this.chooseBetScreen);
        if (this.choosePlaylistScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.choosePlaylistScreen, this.chooseBetScreen, true);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChooseBetComplete, this);
        } else {
            this.chooseBetScreen.addEvent();
        }
    }
    chooseBetComplete(idBet, betMoney) {
        this.addChoosePlaylistScreen(idBet, betMoney);
    }
    removeChooseBetScreen() {
        if (this.chooseBetScreen !== null) {
            this.removeChild(this.chooseBetScreen);
            this.chooseBetScreen.destroy();
            this.chooseBetScreen = null;
        }
    }

    tweenChooseBetComplete() {
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenChooseBetComplete, this);
        this.removeChoosePlaylistScreen();
        if (this.chooseBetScreen !== null) {
            this.chooseBetScreen.addEvent();
        }
    }

    addChoosePlaylistScreen(idBet, betMoney) {
        LogConsole.log("addChoosePlaylistScreen");
        this.removeChoosePlaylistScreen();
        this.choosePlaylistScreen = new OnlineModeChoosePlaylistScreen();
        this.choosePlaylistScreen.setBetId(idBet, betMoney);
        this.choosePlaylistScreen.setIsMaster(true);
        this.choosePlaylistScreen.event.create_room.add(this.callCreateRoom, this);
        this.choosePlaylistScreen.event.back.add(this.addChooseBetScreen, this);
        this.addChild(this.choosePlaylistScreen)
        if (this.chooseBetScreen !== null) {
            SwitchScreen.instance().beginSwitch(this.chooseBetScreen, this.choosePlaylistScreen, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenChoosePlayListComplete, this);
        } else {
            this.choosePlaylistScreen.addEvent();
        }
    }
    removeChoosePlaylistScreen() {
        if (this.choosePlaylistScreen !== null) {
            this.removeChild(this.choosePlaylistScreen);
            this.choosePlaylistScreen.destroy();
            this.choosePlaylistScreen = null;
        }
    }

    callCreateRoom() {
        SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_CREATE_REQUEST, SendOnlineModeCRRoomCreate.begin(1, 1));
    }

    tweenChoosePlayListComplete() {
        this.removeChooseBetScreen();
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenChoosePlayListComplete, this);
        if (this.choosePlaylistScreen !== null) {
            this.choosePlaylistScreen.addEvent();
        }
    }


    chooseBack() {
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }

}