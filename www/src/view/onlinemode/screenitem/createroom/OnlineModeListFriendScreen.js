import BaseView from "../../../BaseView.js";
import OnlineModeFriendPlayer from "./OnlineModeFriendPlayer.js";
import SwitchScreen from "../../../component/SwitchScreen.js";
import OnlineModeRandomPlayer from "./OnlineModeRandomPlayer.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlinemodeItemChatInviteWaitting from "../../item/OnlinemodeItemChatInviteWaitting.js";
import ControllLoading from "../../../ControllLoading.js";

export default class OnlineModeListFriendScreen extends BaseView {
    constructor(idRoom, count) {
        super(game, null);

        this.idRoom = idRoom;
        this.count = count;

        this.event = {
            back: new Phaser.Signal()
        }

        this.layoutContent = game.add.group();
        this.addChild(this.layoutContent);

        this.listFriends = null;
        this.listRandom = null;
        this.chatPlayer = null;

        this.addEvent();

        this.addListFriends();
    }
    addEvent() {
        SocketController.instance().events.onUserEnterRoom.add(this.userEnterRoom, this);
        SocketController.instance().events.onUserExitRoom.add(this.userExitRoom, this);
    }

    removeEvent() {
        SocketController.instance().events.onUserEnterRoom.remove(this.userEnterRoom, this);
        SocketController.instance().events.onUserExitRoom.remove(this.userExitRoom, this);
    }

    userEnterRoom() {
        this.count++;
        this.updateCountPlayer();
    }

    userExitRoom() {
        this.count--;
        this.updateCountPlayer();
    }

    updateCountPlayer() {
        if (this.listFriends !== null) {
            this.listFriends.updateCountPlayer(this.count);
        }

        if (this.listRandom !== null) {
            this.listRandom.updateCountPlayer(this.count);
        }
    }


    addListFriends() {
        this.removeListFriends();
        this.listFriends = new OnlineModeFriendPlayer(this.idRoom, this.count);
        this.listFriends.event.back.add(this.chooseBack, this);
        this.listFriends.event.random.add(this.addListRandom, this);
        this.layoutContent.addChild(this.listFriends);

        if (this.listRandom !== null) {
            SwitchScreen.instance().beginSwitch(this.listRandom, this.listFriends, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenListRandomComplete, this);
        } else {
            SwitchScreen.instance().beginSwitch(null, this.listFriends, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenListRandomComplete, this);
        }

    }

    tweenListRandomComplete() {
        this.listFriends.ktClick = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenListRandomComplete, this);
        this.removeListRandom();
    }
    removeListFriends() {
        if (this.listFriends !== null) {
            this.layoutContent.removeChild(this.listFriends);
            this.listFriends.destroy();
            this.listFriends = null;
        }
    }

    addListRandom() {
        this.removeListRandom();
        this.listRandom = new OnlineModeRandomPlayer(this.idRoom, this.count);
        this.listRandom.event.back.add(this.chooseBack, this);
        this.listRandom.event.changeToBanBe.add(this.addListFriends, this);
        this.layoutContent.addChild(this.listRandom);

        if (this.listFriends !== null) {
            SwitchScreen.instance().beginSwitch(this.listFriends, this.listRandom, false);
            SwitchScreen.instance().event.tweenComplete.add(this.tweenListFriendsComplete, this);
        } else {
            this.listRandom.ktClick = true;
        }
    }
    tweenListFriendsComplete() {
        this.listRandom.ktClick = false;
        SwitchScreen.instance().event.tweenComplete.remove(this.tweenListFriendsComplete, this);
        this.removeListFriends();
    }
    removeListRandom() {
        if (this.listRandom !== null) {
            this.layoutContent.removeChild(this.listRandom);
            this.listRandom.destroy();
            this.listRandom = null;
        }
    }


    addChatRoom(strChat, urlAva, icon = "", vip = false) {
        this.removeChatRoom();
        this.chatPlayer = new OnlinemodeItemChatInviteWaitting(strChat, urlAva, vip);
        if (icon !== "") {
            this.chatPlayer.setIcon(icon);
        }
        this.chatPlayer.y = -102;
        this.chatPlayer.event.close.add(this.removeChatRoom, this);
        this.addChild(this.chatPlayer);

        game.add.tween(this.chatPlayer).to({
            y: 1
        }, 300, Phaser.Easing.Power1, true);

    }

    removeChatRoom() {
        if (this.chatPlayer !== null) {
            this.removeChild(this.chatPlayer);
            this.chatPlayer.destroy();
            this.chatPlayer = null;
        }
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    destroy() {
        ControllLoading.instance().hideLoading();
        this.removeEvent();
        super.destroy();
    }
}