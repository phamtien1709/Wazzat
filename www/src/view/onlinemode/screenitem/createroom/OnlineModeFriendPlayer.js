import BaseView from "../../../BaseView.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import TextBase from "../../../component/TextBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import ListView from "../../../../../libs/listview/list_view.js";
import MainData from "../../../../model/MainData.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";

import OnlineModeFriendItem from "../../item/OnlineModeFriendItem.js";
import SendOnlineModeCRInviteFriend from "../../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRInviteFriend.js";
import KeyBoard from "../../../component/KeyBoard.js";
import ControllLoading from "../../../ControllLoading.js";

import OnlineModeInfoRoomInvite from "../../item/OnlineModeInfoRoomInvite.js";
import DataUser from "../../../../model/user/DataUser.js";
import Language from "../../../../model/Language.js";

export default class OnlineModeFriendPlayer extends BaseView {
    constructor(idRoom, count) {
        super(game, null);

        ControllLoading.instance().showLoading();

        this.event = {
            back: new Phaser.Signal(),
            random: new Phaser.Signal()
        }

        this.arrFriends = [];
        this.ktClick = false;

        this.currentSearch = "";
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        let parentListFriend = new Phaser.Group(game, 0, 0, null);
        this.listFriends = new ListView(game, parentListFriend, new Phaser.Rectangle(0, 0, game.width, game.height - 380 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        parentListFriend.x = 0;
        parentListFriend.y = 226 * MainData.instance().scale;
        this.addChild(parentListFriend);

        this.header = new OnlineModeHeaderItem();
        this.header.setTitle(Language.instance().getData("93"));
        this.header.setHideBtnBack();
        this.header.setSearchButton();
        this.header.event.back.add(this.chooseBack, this);
        this.header.event.search.add(this.chooseSearch, this);
        this.addChild(this.header);

        this.detailRoom = new OnlineModeInfoRoomInvite(idRoom, count);
        this.detailRoom.y = 100;
        this.addChild(this.detailRoom);


        this.txtSearch = new TextBase(this.positionCreateRoom.listfriend_txt_current_search, Language.instance().getData("94"));
        this.txtSearch.setTextBounds(0, 0, game.width - 120 * MainData.instance().scale, 100 * MainData.instance().scale);
        this.addChild(this.txtSearch);

        this.btnCloseTextSearch = new ButtonBase(this.positionCreateRoom.listfriend_btn_close_search, this.chooseCloseTextSearch, this);
        this.addChild(this.btnCloseTextSearch);
        this.btnCloseTextSearch.visible = false;

        //this.buildListFriends();

        this.btnRandom = new ButtonWithText(this.positionCreateRoom.listfriend_btn_random, Language.instance().getData("95"), this.chooseRandom, this);
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


    addEvent() {
        if (DataUser.instance().ktLoadFriend === true) {
            this.arrFriends = DataUser.instance().listFriend.getFriends();
            this.buildListFriends();
        } else {
            DataUser.instance().event.load_list_friend_complete.add(this.loadListFriendComplete, this);
            DataUser.instance().sendGetFriendsList();
        }
    }

    loadListFriendComplete() {
        this.arrFriends = DataUser.instance().listFriend.getFriends();
        this.buildListFriends();
    }
    removeEvent() {
        DataUser.instance().event.load_list_friend_complete.remove(this.loadListFriendComplete, this);
    }

    chooseCloseTextSearch() {
        this.txtSearch.text = Language.instance().getData("94");
        this.currentSearch = "";
        this.btnCloseTextSearch.visible = false;
        this.buildListFriends();
    }

    buildListFriends() {

        this.listFriends.removeAll();
        this.listFriends.reset();

        for (let i = 0; i < this.arrFriends.length; i++) {
            let item = this.arrFriends[i];
            if (
                this.currentSearch === "" ||
                this.xoa_dau(item.user_name).toUpperCase().indexOf(this.xoa_dau(this.currentSearch).toUpperCase()) !== -1
            ) {
                let itemFriend = new OnlineModeFriendItem();
                itemFriend.setData(item, i);
                itemFriend.event.invite.add(this.chooseInvite, this);
                this.listFriends.add(itemFriend);
            }
        }
        game.time.events.add(1000, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    chooseInvite(dataFriend) {
        SocketController.instance().sendData(
            OnlineModeCRDataCommand.ONLINE_MODE_ROOM_INVITE_REQUEST,
            SendOnlineModeCRInviteFriend.begin(dataFriend.id)
        )
    }

    chooseSearch() {
        LogConsole.log("chooseSearch");

        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: Language.instance().getData("97"),
            isSearch: true,

        }

        KeyBoard.instance().show(options);
        KeyBoard.instance().event.change.add(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.add(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.add(this.onSubmit, this);
        KeyBoard.instance().event.submit.add(this.onSubmit, this);
        KeyBoard.instance().event.cancle.add(this.onCancel, this);
    }

    changeKeyBoard() {
        let str = KeyBoard.instance().getValue();
        if (str === this.currentSearch) { } else {
            this.currentSearch = str;
            if (this.currentSearch === "") {
                this.chooseCloseTextSearch();
            } else {
                this.btnCloseTextSearch.visible = true;
                this.txtSearch.text = this.currentSearch;
                this.buildListFriends();
            }
        }
    }

    onSubmit() {
        this.changeKeyBoard();
        this.onCancel();
    }

    hideKeyboard() {
        KeyBoard.instance().hide();
    }

    onCancel() {
        KeyBoard.instance().event.change.remove(this.changeKeyBoard, this);
        KeyBoard.instance().event.hideKeyboard.remove(this.hideKeyboard, this);
        KeyBoard.instance().event.enter.remove(this.onSubmit, this);
        KeyBoard.instance().event.submit.remove(this.onSubmit, this);
        KeyBoard.instance().event.cancle.remove(this.onCancel, this);
        KeyBoard.instance().hide();
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    chooseXong() {
        if (this.ktClick === false) {
            this.ktClick = true;
            this.chooseBack();
        }
    }

    chooseRandom() {
        LogConsole.log("chooseRandom");
        if (this.ktClick === false) {
            this.ktClick = true;
            this.event.random.dispatch();
        }

    }

    destroy() {
        this.onCancel();
        this.listFriends.removeAll();
        this.listFriends.destroy();
        this.removeEvent();
        this.removeAllItem();
        super.destroy();
    }
}