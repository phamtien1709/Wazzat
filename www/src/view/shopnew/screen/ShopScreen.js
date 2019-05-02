import BaseView from "../../BaseView.js";
import ShopSortMenuSearch from "../item/playlist/ShopSortMenuSearch.js";
import ButtonBase from "../../component/ButtonBase.js";
import ScrollView from "../../component/listview/ScrollView.js";
import MainData from "../../../model/MainData.js";
import ListView from "../../../../libs/listview/list_view.js";
import ShopSortHeader from "../item/playlist/ShopSortHeader.js";
import TextBase from "../../component/TextBase.js";
import SocketController from "../../../controller/SocketController.js";
import DataConst from "../../../model/DataConst.js";
import ShopItemGennes from "../item/playlist/ShopItemGennes.js";
import ShopItemPlayList from "../item/playlist/ShopItemPlayList.js";
import ShopMenuSearch from "../item/playlist/ShopMenuSearch.js";
import ShopChooseSortPlayList from "../item/playlist/ShopChooseSortPlayList.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import KeyBoard from "../../component/KeyBoard.js";
import ControllLoading from "../../ControllLoading.js";
import DataUser from "../../../model/user/DataUser.js";
import UserGenres from "../../../model/user/UserGenres.js";
import SqlLiteController from "../../../SqlLiteController.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class ShopScreen extends BaseView {
    constructor() {
        super(game, null);

    }
    afterCreate() {
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal(),
            close: new Phaser.Signal,
            show_all: new Phaser.Signal(),
            search: new Phaser.Signal(),
            buyVip: new Phaser.Signal()
        }

        this.ktShowSort = false;
        this.positionShop = MainData.instance().positionShop;

        this.arrDatashop = [];
        this.arrGenres = [];
        this.idxItem = 0;
        this.countItem = 0;
        this.idDelay = null;
        this.ktBuildItem = false;

        this.detail = null;
        this.popupBuy = null;
        this.popupMoney = null;
        this.chooseSort = null;
        this.ktFirst = true;

        this.type = ShopSortMenuSearch.SORT_POP;
        this.local = DataConst.Local;
        this.genres = -1;
        this.itemGenresActive = null;

        this.strSearch = "";
        this.dataList = [];
        this.ktSearch = false;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');

        this.addChild(this.bg);

        let obj = {
            column: 3,
            width: game.width,
            height: game.height - 460 * MainData.instance().scale,
            rowHeight: 326 * MainData.instance().scale,
            leftDistance: 35 * MainData.instance().scale,
            direction: "y",
            distanceBetweenColumns: 35 * MainData.instance().scale,
            distanceBetweenRows: 35 * MainData.instance().scale
        }

        this.scroll = new ScrollView(obj);
        this.scroll.event.changeIndex.add(this.changeIndex, this);
        this.scroll.y = 335 * MainData.instance().scale;
        this.addChild(this.scroll);

        this.parentGenres = new Phaser.Group(game, 0, 0, null);
        this.listGenres = new ListView(game, this.parentGenres, new Phaser.Rectangle(0, 0, game.width - 70, 95 * MainData.instance().scale), {
            direction: 'x',
            padding: 18 * MainData.instance().scale,
            bouncing: true,
            searchForClicks: true
        });

        this.parentGenres.x = 35;
        this.parentGenres.y = 189 * MainData.instance().scale;
        this.addChild(this.parentGenres);



        this.header = new ShopSortHeader();
        this.header.addEventSearch(this.searchData, this);
        this.header.addEventBack(this.chooseBackHeader, this);
        this.addChild(this.header);


        this.menu = new ShopMenuSearch();
        this.menu.event.change_menu.add(this.changeMenu, this);
        this.menu.event.choose_sort.add(this.chooseSortPlaylist, this);
        this.menu.y = 100;
        this.addChild(this.menu);


        this.txtSearch = new TextBase(this.positionShop.sort_play_list_text_current_search, Language.instance().getData("160"));
        this.txtSearch.setTextBounds(0, 0, game.width - 71 * MainData.instance().scale, 59 * MainData.instance().scale);
        this.addChild(this.txtSearch);

        this.btnCloseTextSearch = new ButtonBase(this.positionShop.sort_play_list_btn_close_search, this.chooseCloseTextSearch, this);
        this.addChild(this.btnCloseTextSearch);
        this.btnCloseTextSearch.visible = false;
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        DataUser.instance().event.buy_playlist.add(this.sendGetDataShop, this)
        this.sendGetGenres();
    }
    removeEvent() {
        this.scroll.event.changeIndex.remove(this.changeIndex, this);
        DataUser.instance().event.buy_playlist.remove(this.sendGetDataShop, this);
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }

    sendGetGenres() {
        SqlLiteController.instance().event.get_data_genres_complete.add(this.getDataGenresComplete, this);
        SqlLiteController.instance().getGenresAll();
    }

    getDataGenresComplete(arrData) {
        SqlLiteController.instance().event.get_data_genres_complete.remove(this.getDataGenresComplete, this);
        this.arrGenres = arrData;
        this.sendGetDataShop();
    }

    sendGetDataShop() {
        ControllLoading.instance().showLoading();
        SqlLiteController.instance().getDataShop();
        SqlLiteController.instance().event.get_data_shop_playlist_complete.add(this.getDataPlayListComplete, this);
    }

    getDataPlayListComplete(arrData) {
        SqlLiteController.instance().event.get_data_shop_playlist_complete.remove(this.getDataPlayListComplete, this);
        console.log("getDataPlayListComplete");
        console.log(arrData);

        this.arrDatashop = arrData;

        if (this.ktFirst) {
            this.ktFirst = false;
            this.buildDataShop();
        } else {
            this.buildDataList();
        }
    }

    buildDataShop() {
        this.buildListGenres();
        this.buildDataList();
        if (this.ktSearch === true) {
            this.ktSearch = false;
            this.addKeyBoard();
        }
    }


    getData(data) {

    }



    addKeyBoard() {
        this.header.addKeyBoard();
    }



    chooseBackHeader() {
        LogConsole.log("chooseBackHeader");
        this.event.close.dispatch();
    }

    chooseCloseTextSearch() {
        this.btnCloseTextSearch.visible = false;
        this.txtSearch.text = Language.instance().getData("160");
        this.strSearch = "";

        this.buildDataList();
    }

    changeMenu(local) {
        this.local = local;
        this.buildListGenres();
        this.buildDataList();
    }

    setData(local, genres, typeMenu, ktSearch) {
        this.local = local;
        this.genres = genres;
        this.type = typeMenu;
        this.ktSearch = ktSearch;

        if (this.type != "") {
            this.menu.setMenu(this.type);
        }
        //this.buildDataList();
    }

    chooseItem(item) {
        if (this.genres === -1) {
            this.itemGenresActive.deactive();
            this.itemGenresActive = item;
            this.itemGenresActive.active();
            this.genres = item.getData().id;
        } else {
            if (this.genres === item.getData().id) {
                item.deactive();
                this.genres = -1;
                this.itemGenresActive = null;
            } else {
                this.itemGenresActive.deactive();
                item.active();
                this.genres = item.getData().id;
                this.itemGenresActive = item;
            }
        }
        this.listGenres.tweenToItem(item.idx, 0.5);
        this.buildDataList();
    }

    searchData(dataString) {
        LogConsole.log("searchData : " + dataString);
        this.strSearch = dataString;
        this.txtSearch.text = this.strSearch;

        if (this.strSearch != "") {
            this.btnCloseTextSearch.visible = true;
            this.dataList = [];
            //let playlists = DataUser.instance().playlist.getArrShop();
            for (let i = 0; i < this.arrDatashop.length; i++) {
                if (this.xoa_dau(this.arrDatashop[i].name).toUpperCase().indexOf(this.xoa_dau(dataString).toUpperCase()) !== -1) {
                    this.dataList.push(this.arrDatashop[i]);
                }
            }
        } else {
            this.btnCloseTextSearch.visible = false;
            this.txtSearch.text = Language.instance().getData("160")
        }
        this.buildDataList();
    }

    buildDataList() {
        if (this.strSearch === "") {
            let playlists = this.arrDatashop;
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList = playlists.sort(this.sortAZ);
                this.menu.setTextSort(Language.instance().getData("135"));
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList = playlists.sort(this.sortNewPlayList);
                this.menu.setTextSort(Language.instance().getData("136"));
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList = playlists.sort(this.sortPhoBien);
                this.menu.setTextSort(Language.instance().getData("137"));
            } else {
                this.dataList = playlists.sort(this.sortPhoBien);
                this.menu.setTextSort(Language.instance().getData("137"));
            }
        } else {
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList.sort(this.sortAZ);
                this.menu.setTextSort(Language.instance().getData("135"));
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList.sort(this.sortNewPlayList);
                this.menu.setTextSort(Language.instance().getData("136"));
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList.sort(this.sortPhoBien);
                this.menu.setTextSort(Language.instance().getData("137"));
            } else {
                this.dataList.sort(this.sortPhoBien);
                this.menu.setTextSort(Language.instance().getData("137"));
            }
        }
        let list = [];
        let idx = -1;

        this.idxItem = 0;
        this.countItem = 0;

        this.scroll.viewList = [];
        this.removeDelayBuild();
        this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 0.1, this.addItemPageShop, this);

        ControllLoading.instance().hideLoading();
    }

    changeIndex(idx) {
        if (this.countItem === idx + 1 && this.ktBuildItem === false) {
            this.addItemPageShop();
        }
    }

    addItemPageShop() {
        let list = [];
        let idx = 0;
        this.ktBuildItem = true;
        for (let i = this.idxItem; i < this.dataList.length; i++) {
            this.idxItem++;
            if ((this.genres === -1 || this.dataList[i].genre_id === this.genres) && (this.local === this.dataList[i].region) && this.dataList[i].is_owner !== 1) {
                idx++;
                let item = new ShopItemPlayList();
                item.event.CHOOSE.add(this.chooseItemShop, this);
                item.event.BUY.add(this.buyItemShop, this);
                item.event.TOVIP.add(this.chooseUpVip, this);
                item.setData(this.dataList[i], idx);
                list.push(item);
            }
            if (list.length === this.scroll.columnNumber || this.idxItem === this.dataList.length) {
                this.countItem++;
                this.scroll.addItem(list);
                if (this.countItem % 3 === 0) {
                    this.ktBuildItem = false;
                    break;
                }

                if (this.idxItem === this.dataList.length) {
                    this.ktBuildItem = false;
                }
                list = [];
            }
        }
    }

    removeDelayBuild() {
        if (this.idDelay !== null) {
            game.time.events.remove(this.idDelay);
            this.idDelay = null;
        }
    }

    getDataGenresByLocal() {
        let arr = [];
        for (let i = 0; i < this.arrGenres.length; i++) {
            if (this.arrGenres[i].region === this.local) {
                arr.push(this.arrGenres[i]);
            }
        }
        return arr;
    }
    buildListGenres() {
        LogConsole.log(this.listGenres);

        this.listGenres.reset();
        this.listGenres.removeAll();

        let idxToItem = -1;
        let idx = 0;
        this.genres = -1;

        let genres = this.getDataGenresByLocal();

        let dataAll = new UserGenres();
        dataAll.genre = Language.instance().getData("160");
        dataAll.id = -1;

        let itemAll = new ShopItemGennes(this.chooseItem, this);
        itemAll.active();
        itemAll.y = 20;
        itemAll.setData(dataAll, idx);

        this.itemGenresActive = itemAll;

        this.listGenres.add(itemAll);

        for (let i = 0; i < genres.length; i++) {
            idx++;
            let item = new ShopItemGennes(this.chooseItem, this);
            if (genres[i].id === this.genres) {
                this.itemGenresActive = item;
                item.active();
                idxToItem = idx;
            } else {
                item.deactive();
            }
            item.y = 20 * MainData.instance().scale;
            item.setData(genres[i], idx);

            this.listGenres.add(item);
        }
        if (idxToItem > -1) {

            this.listGenres.tweenToItem(idxToItem, 0.5);
        }
    }

    chooseItemShop(data) {
        KeyBoard.instance().hide();
        ControllScreenDialog.instance().addPlaylistDetail(data.id);
    }
    buyItemShop(data) {
        ControllScreenDialog.instance().buyItem(data);
    }
    chooseUpVip() {
        this.event.buyVip.dispatch();
    }

    chooseSortPlaylist() {
        this.ktShowSort = !this.ktShowSort;
        if (this.ktShowSort === true) {
            this.addChooseSortPlaylist();
        } else {
            this.removeChooseSortPlayList();
        }
    }

    addChooseSortPlaylist() {
        this.removeChooseSortPlayList();

        this.ktShowSort = true;
        this.chooseSort = new ShopChooseSortPlayList();
        this.chooseSort.event.choose_sort.add(this.changeSortPlayList, this);
        this.chooseSort.x = 455 * MainData.instance().scale;
        this.chooseSort.y = 165 * MainData.instance().scale;
        this.addChild(this.chooseSort);

    }

    changeSortPlayList(idx, str) {
        this.removeChooseSortPlayList();
        if (idx === 0) {
            this.type = ShopSortMenuSearch.SORT_AZ;
        } else if (idx === 1) {
            this.type = ShopSortMenuSearch.SORT_NEW;
        } else {
            this.type = ShopSortMenuSearch.SORT_POP;
        }
        this.menu.setTextSort(str);

        this.buildDataList();
    }

    removeChooseSortPlayList() {
        if (this.chooseSort !== null) {
            this.ktShowSort = false;
            this.removeChild(this.chooseSort);
            this.chooseSort.destroy();
            this.chooseSort = null;
        }
    }

    destroy() {
        this.removeEvent();
        this.scroll.destroy();
        this.removeDelayBuild();
        this.bg.destroy();
        this.header.destroy();
        this.menu.destroy();
        this.txtSearch.destroy();
        this.btnCloseTextSearch.destroy();
        this.listGenres.destroy();
        this.removeAllItem();
        this.parentGenres.destroy();
        ControllLoadCacheUrl.instance().resetLoad();

        ControllScreenDialog.instance().removePlaylistDetail();
        ControllScreenDialog.instance().removePopupBuy();
        ControllScreenDialog.instance().removePopupMoney();
        super.destroy();
    }
}