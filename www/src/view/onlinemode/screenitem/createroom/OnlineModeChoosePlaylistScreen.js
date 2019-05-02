import BaseView from "../../../BaseView.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import OnlineModeChoosePlaylistItem from "../../item/OnlineModeChoosePlaylistItem.js";
import MainData from "../../../../model/MainData.js";
import ListView from "../../../../../libs/listview/list_view.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCRDataCommand from "../../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import SendOnlineModeCRUserSelectPlaylist from "../../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRUserSelectPlaylist.js";
import SendOnlineModeCRRoomCreate from "../../../../model/onlinemodecreatroom/server/senddata/SendOnlineModeCRRoomCreate.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import EventGame from "../../../../controller/EventGame.js";
import DataUser from "../../../../model/user/DataUser.js";
import OnlinemodeItemChatInviteWaitting from "../../item/OnlinemodeItemChatInviteWaitting.js";
import SqlLiteController from "../../../../SqlLiteController.js";
import Language from "../../../../model/Language.js";


export default class OnlineModeChoosePlaylistScreen extends BaseView {
    constructor() {
        super(game, null);

    }
    afterCreate() {
        ControllLoading.instance().showLoading();
        this.shopPlayList = null;
        this.isMaster = false;
        this.betId = -1;
        this.betMoney = 0;
        this.chatPlayer = null;
        this.idx = 0;
        this.countItem = 0;
        this.ktBuild = true;
        this.idDelay = null;

        this.positionCreateRoom = MainData.instance().positionCreateRoom;
        this.event = {
            back: new Phaser.Signal(),
            create_room: new Phaser.Signal()
        }
        this.arrPlayList = [];
        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);



        this.parentPlayerList = new Phaser.Group(game, 0, 0, null);
        this.listPlayerlist = new ListView(game, this.parentPlayerList, new Phaser.Rectangle(0, 0, game.width, game.height - 395 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });
        this.listPlayerlist.events.changeIndex.add(this.changeIndex, this);

        this.parentPlayerList.x = 0;
        this.parentPlayerList.y = 240 * MainData.instance().scale;
        this.addChild(this.parentPlayerList);

        this.header = new OnlineModeHeaderItem();
        this.header.setTitle(Language.instance().getData("80"));
        this.header.event.back.add(this.chooseBack, this);
        this.addChild(this.header);

        this.bgSuggestPlayList = new SpriteScale9Base(this.positionCreateRoom.choose_playlist_itemplaylist_bg);
        this.addChild(this.bgSuggestPlayList);
        this.bgSuggestPlayList.x = game.width;

        this.playlistSuggest = new OnlineModeChoosePlaylistItem();
        this.playlistSuggest.setButtonBuy(200);
        this.playlistSuggest.y = this.positionCreateRoom.choose_playlist_itemplaylist_bg.y * MainData.instance().scale;
        this.addChild(this.playlistSuggest);
        this.playlistSuggest.x = game.width;

        this.btnBuyMore = new ButtonWithText(this.positionCreateRoom.choose_playlist_btn_muathemplaylist, Language.instance().getData("81"), this.chooseBuyMore, this);
        this.btnBuyMore.y = game.height - 120 * MainData.instance().scale;
        this.btnBuyMore.x = (game.width - this.btnBuyMore.width) / 2;
        this.addChild(this.btnBuyMore);

        this.btnBuyMore.y = game.height;

        game.add.tween(this.btnBuyMore).to({
            y: game.height - 120 * MainData.instance().scale
        }, 150, Phaser.Easing.Power1, true, 300);
        //this.buildListPlaylist();
        // this.addEvent();


    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.buy_playlist.add(this.sendGetDataPlaylist, this);
        IronSource.instance().showBanerChoosePlaylistCreateRoomScreen();

        this.sendGetDataPlaylist();
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.buy_playlist.remove(this.sendGetDataPlaylist, this);
    }

    sendGetDataPlaylist() {
        ControllLoading.instance().showLoading();
        SqlLiteController.instance().getPlaylistMe(true);
        SqlLiteController.instance().event.get_data_me_playlist_complete.add(this.getDataMePlaylistComplete, this);
    }

    getDataMePlaylistComplete(objData) {
        SqlLiteController.instance().event.get_data_me_playlist_complete.remove(this.getDataMePlaylistComplete, this);

        console.log(objData);
        if (objData.suggestion_playlist !== null) {
            let suggestion_playlist = objData.suggestion_playlist;
            this.playlistSuggest.setData(suggestion_playlist, 0, true);
            this.playlistSuggest.setButtonBuy(suggestion_playlist.price);
        } else {
            this.playlistSuggest.kill();
            this.bgSuggestPlayList.kill();
            this.parentPlayerList.y = 180;
        }

        this.arrPlayList = objData.playlist;
        this.buildListPlaylist();

    }




    getData(event) {

    }

    addChatRoom(strChat, urlAva, icon = "") {
        this.removeChatRoom();
        this.chatPlayer = new OnlinemodeItemChatInviteWaitting(strChat, urlAva);
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

    setBetMoney(betMoney) {
        this.betMoney = betMoney;
    }

    setBetId(betId, betMoney) {
        this.betId = betId;
        this.betMoney = betMoney;
    }
    setIsMaster(isMaster) {
        this.isMaster = isMaster;
        if (this.isMaster === false) {
            this.header.setHideBtnBack();
        } else {
            this.header.setShowBtnBack();
            EventGame.instance().event.backButton.add(this.chooseBack, this);
        }
    }





    buildListPlaylist() {
        game.add.tween(this.bgSuggestPlayList).to({
            x: this.positionCreateRoom.choose_playlist_itemplaylist_bg.x
        }, 150, Phaser.Easing.Power1, true, 300);

        game.add.tween(this.playlistSuggest).to({
            x: 0
        }, 150, Phaser.Easing.Power1, true, 300);

        this.listPlayerlist.removeAll();
        this.listPlayerlist.reset();

        this.arrPlayList.sort(this.compareUserPlaylistMappingUpdate);

        this.removeDelayBuild();
        this.idx = 0;
        this.countItem = 0;
        this.buildItemPage();
        game.time.events.add(100, this.buildHideLoading, this);
    }

    buildHideLoading() {
        ControllLoading.instance().hideLoading();
    }

    changeIndex() {
        let idx = this.listPlayerlist.getIdx();
        if (this.countItem === (idx + 1) && this.ktBuild === false) {
            this.buildItemPage();
        }
    }

    removeDelayBuild() {
        if (this.idDelay !== null) {
            game.time.events.remove(this.idDelay);
            this.idDelay = null;
        }
    }

    buildItemPage() {
        this.ktBuild = true;
        for (let i = this.idx; i < this.arrPlayList.length; i++) {
            let item = new OnlineModeChoosePlaylistItem();
            item.setData(this.arrPlayList[i], i);
            item.event.buy.add(this.chooseBuyPlaylist, this);
            item.event.select.add(this.chooseSelectPlaylist, this);
            item.setButtonChoose();
            this.listPlayerlist.add(item);

            this.idx++;
            this.countItem++;

            if (this.countItem % 8 === 0 && this.idx < this.arrPlayList.length) {
                this.ktBuild = false;
                //this.removeDelayBuild();
                //this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 0.5, this.buildItemPage, this);
                break;
            }

            if (this.idx === this.arrPlayList.length) {
                this.ktBuild = false;
            }
        }
    }

    chooseBuyPlaylist() {
        LogConsole.log("chooseBuyPlaylist");
    }

    chooseSelectPlaylist(data) {
        let idPlayList = data.id;
        LogConsole.log("chooseSelectPlaylist : " + idPlayList);
        if (this.isMaster) {
            if (SocketController.instance().dataMySeft.diamond < this.betMoney) {
                ControllScreenDialog.instance().addDialogConfirnMoney(Language.instance().getData("71"));
            } else {
                ControllLoading.instance().showLoading();
                SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_CREATE_REQUEST, SendOnlineModeCRRoomCreate.begin(idPlayList, this.betId));
            }
        } else {

            if (SocketController.instance().dataMySeft.diamond < this.betMoney) {
                ControllScreenDialog.instance().addDialogConfirnMoney(Language.instance().getData("69"), "chooseCanclePopupMoney");
            } else {
                ControllLoading.instance().showLoading();
                SocketController.instance().sendData(OnlineModeCRDataCommand.ONLINE_MODE_ROOM_USER_SELECT_PLAYLIST_REQUEST,
                    SendOnlineModeCRUserSelectPlaylist.begin(idPlayList));
            }
        }


        //this.event.create_room.dispatch();
    }

    chooseBuyMore() {
        LogConsole.log("chooseBuyMore");
        ControllScreenDialog.instance().addShop(0);
    }



    chooseBack() {
        //console.log('HERE HERE HERE');
        this.event.back.dispatch();
    }

    destroy() {
        this.removeAllItem();
        this.removeEvent();
        this.removeDelayBuild();
        this.listPlayerlist.removeAll();
        this.listPlayerlist.destroy();
        IronSource.instance().hideBanner();
        ControllLoading.instance().hideLoading();
        super.destroy();
    }
}