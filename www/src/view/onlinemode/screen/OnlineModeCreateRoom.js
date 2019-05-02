import BaseView from "../../BaseView.js";
import OnlineModeChooseModeScreen from "../screenitem/createroom/OnlineModeChooseModeScreen.js";
import OnlineModeCreateRoomScreen from "../screenitem/createroom/OnlineModeCreateRoomScreen.js";
import OnlineModeWaittingScreen from "./OnlineModeWaittingScreen.js";
import SwitchScreen from "../../component/SwitchScreen.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllInvitation from "../../../controller/ControllInvitation.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeCreateRoom extends BaseView {
    constructor(ktBack) {
        super(game, null);
        this.event = {
            back: new Phaser.Signal(),
            quickplay: new Phaser.Signal()
        }
        this.ktBack = ktBack;
        this.nameState = "";
        this.screenChooseMode = null;
        this.screenCreateRoom = null;
        this.screenPlaying = null;
        this.checkDataRoom();
    }


    checkShowInvite(data) {
        console.log("checkShowInvite onlinemode ");
        if (this.nameState === "choosemode") {
            if (ControllInvitation.instance().getUserBlock(data.getInt('inviter_id')) === false) {
                ControllScreenDialog.instance().addDialogInviteFriend(data, true);
            }
        }
    }

    checkDataRoom() {
        LogConsole.log("checkDataRoom--------------");
        LogConsole.log(MainData.instance().dataJoinRoom);
        if (MainData.instance().dataJoinRoom !== null) {
            this.addScreenPlayRoom();
        } else {
            this.addScreenChooseMode();
        }
    }

    addScreenChooseMode() {
        this.removeScreenChooseMode();
        this.nameState = "choosemode";
        this.screenChooseMode = new OnlineModeChooseModeScreen();
        this.screenChooseMode.event.create_room.add(this.addScreenCreateRoom, this);
        this.screenChooseMode.event.close.add(this.backToMainMenu, this);
        this.screenChooseMode.event.quick_play.add(this.addScreenQuickPlay, this);
        this.addChild(this.screenChooseMode);


        if (this.screenCreateRoom !== null) {
            this.removeScreenCreateRoom();
            //SwitchScreen.instance().beginSwitch(this.screenCreateRoom, this.screenChooseMode, true);
            //SwitchScreen.instance().event.tweenComplete.add(this.onCompleteTweenScreenCreateRoom, this);
        } else if (this.screenPlaying !== null) {
            this.removeScreenPlayRoom();
            //SwitchScreen.instance().beginSwitch(this.screenPlaying, this.screenChooseMode, true)
            // SwitchScreen.instance().event.tweenComplete.add(this.onCompleteTweenScreenPlaying, this);
        } else {
            if (this.ktBack == false) {
                SwitchScreen.instance().beginSwitch(null, this.screenChooseMode, false);
            }
        }

    }
    removeScreenChooseMode() {
        if (this.screenChooseMode !== null) {
            this.removeChild(this.screenChooseMode);
            this.screenChooseMode.destroy();
            this.screenChooseMode = null;
        }
    }

    addScreenCreateRoom() {

        this.removeScreenCreateRoom();
        this.nameState = "createroom";
        this.screenCreateRoom = new OnlineModeCreateRoomScreen();
        this.screenCreateRoom.event.back.add(this.addScreenChooseMode, this);
        //this.screenCreateRoom.event.create_room.add(this.addScreenPlayRoom, this);
        this.addChild(this.screenCreateRoom);


        if (this.screenChooseMode !== null) {
            this.removeScreenChooseMode();
        }

        if (this.screenPlaying !== null) {
            this.removeScreenPlayRoom();
        }

    }
    removeScreenCreateRoom() {
        if (this.screenCreateRoom !== null) {
            this.removeChild(this.screenCreateRoom);
            this.screenCreateRoom.destroy();
            this.screenCreateRoom = null;
        }
    }

    addScreenQuickPlay() {
        this.event.quickplay.dispatch();
    }
    addScreenPlayRoom() {
        this.removeScreenPlayRoom();
        this.nameState = "playroom";
        this.screenPlaying = new OnlineModeWaittingScreen();
        this.screenPlaying.event.back.add(this.addScreenChooseMode, this);
        this.addChild(this.screenPlaying);

        if (this.screenCreateRoom !== null) {
            SwitchScreen.instance().beginSwitch(this.screenCreateRoom, this.screenPlaying, false);
            SwitchScreen.instance().event.tweenComplete.add(this.onCompleteTweenScreenCreateRoom, this);
        }

        if (this.screenChooseMode !== null) {
            this.removeScreenChooseMode();
        }

    }

    removeScreenPlayRoom() {
        if (this.screenPlaying !== null) {
            this.removeChild(this.screenPlaying);
            this.screenPlaying.destroy();
            this.screenPlaying = null;
        }
    }

    onCompleteTweenScreenCreateRoom() {
        SwitchScreen.instance().event.tweenComplete.remove(this.onCompleteTweenScreenCreateRoom, this);
        this.removeScreenCreateRoom();
    }
    onCompleteTweenScreenChooseMode() {
        SwitchScreen.instance().event.tweenComplete.remove(this.onCompleteTweenScreenChooseMode, this);
        this.removeScreenChooseMode();
    }
    onCompleteTweenScreenPlaying() {
        SwitchScreen.instance().event.tweenComplete.remove(this.onCompleteTweenScreenPlaying, this);
        this.removeScreenPlayRoom();
    }

    backToMainMenu() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU, {});
    }

    destroy() {
        this.onCompleteTweenScreenChooseMode();
        this.onCompleteTweenScreenCreateRoom();
        this.onCompleteTweenScreenChooseMode();
        super.destroy();
    }
}