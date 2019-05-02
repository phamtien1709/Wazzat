import BaseView from "../../../BaseView.js";
import OnlineModeTreeTabMenu from "../../item/OnlineModeTreeTabMenu.js";
import DataConst from "../../../../model/DataConst.js";
import OnlineModeHeaderItem from "../../item/OnlineModeHeaderItem.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import ListView from "../../../../../libs/listview/list_view.js";
import SocketController from "../../../../controller/SocketController.js";
import OnlineModeCommand from "../../../../model/onlineMode/dataField/OnlineModeCommand.js";
import OnlineModeChoosePlaylistItem from "../../item/OnlineModeChoosePlaylistItem.js";
import SendOnlineModeFindGame from "../../../../model/onlineMode/server/senddata/SendOnlineModeFindGame.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ControllLoading from "../../../ControllLoading.js";
import IronSource from "../../../../IronSource.js";
import DataUser from "../../../../model/user/DataUser.js";
import SqlLiteController from "../../../../SqlLiteController.js";
import MainData from "../../../../model/MainData.js";


export default class OnlineModeListPlaylist extends BaseView {
    constructor(dataBet) {
        super(game, null);
        ControllLoading.instance().showLoading();
        LogConsole.log("OnlineModeListPlaylist----------------------------");
        this.event = {
            back: new Phaser.Signal(),
            backBet: new Phaser.Signal(),
            backGenres: new Phaser.Signal()
        }
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);

        this.dataBet = dataBet;

        this.idDelay = null;
        this.idx = 0;
        this.countItem = 0;
        this.arrPlayList = [];
        this.ktBuild = false;

        /*
        this.playlistSuggest = new OnlineModeChoosePlaylistItem();
        this.playlistSuggest.setButtonBuy(200);
        this.playlistSuggest.y = 346 * MainData.instance().scale;
        this.addChild(this.playlistSuggest);
        this.playlistSuggest.x = game.width;*/

        this.tabTree = new OnlineModeTreeTabMenu(OnlineModeTreeTabMenu.TREE_PLAYLIST,
            DataConst.getNameRegion(this.dataBet.dataGennes.region),
            this.dataBet.dataGennes.genre
        );
        this.tabTree.event.backBet.add(this.chooseBackToBet, this);
        this.tabTree.event.backGenres.add(this.chooseBackToGenres, this);
        this.tabTree.y = 100 * MainData.instance().scale;
        this.addChild(this.tabTree);

        let parentPlayerList = new Phaser.Group(game, 0, 0, null);
        this.listPlayerlist = new ListView(game, parentPlayerList, new Phaser.Rectangle(0, 0, game.width, game.height - 205 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        this.listPlayerlist.events.changeIndex.add(this.changeIndex, this);

        parentPlayerList.x = 0;
        //parentPlayerList.y = 581 * MainData.instance().scale;
        parentPlayerList.y = 205 * MainData.instance().scale;
        this.addChild(parentPlayerList);



        this.header = new OnlineModeHeaderItem();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setDiamond();
        this.addChild(this.header);

        this.bgSuggestPlayList = new SpriteScale9Base(this.positionCreateRoom.choose_playlist_itemplaylist_bg);
        this.bgSuggestPlayList.y = 205 * MainData.instance().scale;
        this.addChild(this.bgSuggestPlayList);
        this.bgSuggestPlayList.x = game.width;

        /*
        this.btnBuyMore = new ButtonWithText(this.positionCreateRoom.choose_playlist_btn_muathemplaylist, "MUA THÊM PLAYLIST", this.chooseBuyMore, this);
        this.addChild(this.btnBuyMore);

        this.btnBuyMore.y = game.height;

        game.add.tween(this.btnBuyMore).to({
            y: this.positionCreateRoom.choose_playlist_btn_muathemplaylist.y * MainData.instance().scale
        }, 150, Phaser.Easing.Power1, true, 300);
        */
        // this.addEvent();


    }

    addEvent() {
        console.log("addEvent-------------");
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.buy_playlist.add(this.sendGetDataPlaylist, this);
        this.sendGetDataPlaylist();
        IronSource.instance().showBanerChoosePlaylistquickPlayScreen();
    }
    removeEvent() {
        DataUser.instance().event.buy_playlist.remove(this.sendGetDataPlaylist, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);

    }

    sendGetDataPlaylist() {
        ControllLoading.instance().showLoading();
        SqlLiteController.instance().getQuickplayPlaylistByGenres(this.dataBet.dataGennes.id);
        SqlLiteController.instance().event.get_data_me_playlist_complete.add(this.getDataMePlaylistComplete, this);
    }

    getDataMePlaylistComplete(arrData) {
        SqlLiteController.instance().event.get_data_me_playlist_complete.remove(this.getDataMePlaylistComplete, this);
        this.arrPlayList = arrData.sort(this.compareUserPlaylistMappingUpdate);

        console.log(this.arrPlayList);

        this.buildPlayerList();

    }




    buildDataPlaylist() {
        this.buildPlayerList();

    }

    getData(data) {

    }

    buildPlayerList() {

        this.listPlayerlist.removeAll();
        this.listPlayerlist.reset();

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

    buildItemPage() {
        this.ktBuild = true;

        for (let i = this.idx; i < this.arrPlayList.length; i++) {
            let item = new OnlineModeChoosePlaylistItem();
            item.event.buy.add(this.chooseBuy, this);
            item.event.select.add(this.chooseSelect, this);
            item.setDataQuickPlay(this.arrPlayList[i], i);
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

    removeDelayBuild() {
        if (this.idDelay !== null) {
            game.time.events.remove(this.idDelay);
            this.idDelay = null;
        }
    }

    chooseBuyMore() {
        LogConsole.log("chooseBuyMore");
        ControllScreenDialog.instance().addShop(0);
    }

    chooseBuy(data) {
        ControllScreenDialog.instance().addPopupBuy(data)
    }

    chooseSelect(data) {
        console.log(data);
        MainData.instance().dataPlayOnlineMode.id = data.id;
        MainData.instance().dataPlayOnlineMode.genre_id = this.dataBet.dataGennes.id;
        MainData.instance().dataPlayOnlineMode.bet_id = this.dataBet.id;

        ControllLoading.instance().showLoading();
        SocketController.instance().sendData(OnlineModeCommand.ONLINE_MODE_FIND_GAME_REQUEST,
            SendOnlineModeFindGame.begin(data.id, this.dataBet.dataGennes.id, this.dataBet.id)
        );
    }

    getGenres() {
        return this.dataBet.dataGennes;
    }

    chooseBack() {
        LogConsole.log("chooseBack playlist");
        this.event.back.dispatch();
    }
    chooseBackToBet() {
        let genres = this.dataBet.dataGennes;
        this.event.backBet.dispatch(genres);
    }
    chooseBackToGenres() {
        this.event.backGenres.dispatch();
    }

    destroy() {
        this.removeEvent();
        this.removeDelayBuild();
        this.listPlayerlist.removeAll();
        this.listPlayerlist.destroy();
        this.removeAllItem();
        IronSource.instance().hideBanner();
        super.destroy();
    }
}