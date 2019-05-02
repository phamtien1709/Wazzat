import BaseView from "../../../BaseView.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import ListView from "../../../../../libs/listview/list_view.js";
import MainData from "../../../../model/MainData.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import GetOnlineModListUserOnline from "../../../../model/onlinemodecreatroom/server/getdata/GetOnlineModListUserOnline.js";
import OnlineModeFriendItem from "../../item/OnlineModeFriendItem.js";
import SendOnlineModeCRInviteFriend from "../../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRInviteFriend.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import OnlineModeInfoRoomInvite from "../../item/OnlineModeInfoRoomInvite.js";
import Language from "../../../../model/Language.js";


export default class OnlineModeRandomPlayer extends BaseView {
    constructor(idRoom, count) {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal(),
            changeToBanBe: new Phaser.Signal()
        }

        this.ktClick = true;
        this.currentSearch = "";
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        let parentListFriend = new Phaser.Group(game, 0, 0, null);
        this.listFriends = new ListView(game, parentListFriend, new Phaser.Rectangle(0, 0, game.width, game.height - 300 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        parentListFriend.x = 0;
        parentListFriend.y = 176 * MainData.instance().scale;
        this.addChild(parentListFriend);

        this.header = new OnlineModeHeaderItem();
        this.header.setHideBtnBack();
        this.header.setTitle(Language.instance().getData("98"));
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        this.detailRoom = new OnlineModeInfoRoomInvite(idRoom, count);
        this.detailRoom.y = 100;
        this.addChild(this.detailRoom);

        this.btnRandom = new ButtonWithText(this.positionCreateRoom.listfriend_btn_random, Language.instance().getData("99"), this.chooseBanBe, this);
        this.addChild(this.btnRandom);
        this.btnRandom.y = game.height;
        game.add.tween(this.btnRandom).to({
            y: (game.height - 115 * MainData.instance().scale)
        }, 150, Phaser.Easing.Power1, true, 300);


        this.btnXong = new ButtonWithText(this.positionCreateRoom.listfriend_btnXong, Language.instance().getData("96"), this.chooseXong, this);
        this.addChild(this.btnXong);
        this.btnXong.y = game.height;
        game.add.tween(this.btnXong).to({
            y: (game.height - 115 * MainData.instance().scale)
        }, 150, Phaser.Easing.Power1, true, 300);

        this.addEvent();

    }
    afterCreate() {

    }

    updateCountPlayer(count) {
        this.detailRoom.updateCountPlayer(count);
    }


    chooseBanBe() {
        if (this.ktClick === false) {
            this.ktClick = true;
            this.event.changeToBanBe.dispatch();
        }
    }

    chooseXong() {
        if (this.ktClick === false) {
            this.ktClick = true;
            this.chooseBack();
        }
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_ONLINE_USERS_LIST_REQUEST, null);

        IronSource.instance().showBanerInviteOtherUserWaitingScreen();
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    getData(data) {
        switch (data.cmd) {
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_ONLINE_USERS_LIST_RESPONSE:
                this.arrPlayer = GetOnlineModListUserOnline.begin(data.params);
                this.buildListPlayerRandom();
                break;
        }
    }

    buildListPlayerRandom() {
        this.listFriends.removeAll();
        this.listFriends.reset();

        for (let i = 0; i < this.arrPlayer.length; i++) {
            let itemFriend = new OnlineModeFriendItem();
            itemFriend.setData(this.arrPlayer[i], i);
            itemFriend.event.invite.add(this.chooseInvite, this);
            this.listFriends.add(itemFriend);
        }

        game.time.events.add(1000, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    chooseInvite(dataFriend) {
        console.log("dataFriend-----------");
        console.log(dataFriend);
        SocketController.instance().sendData(
            OnlineModeCRDataCommand.ONLINE_MODE_ROOM_INVITE_REQUEST,
            SendOnlineModeCRInviteFriend.begin(dataFriend.id)
        )
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        this.listFriends.removeAll();
        this.listFriends.destroy();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}