import BaseView from "../../BaseView.js";
import ShopSortMenuSearch from "../item/playlist/ShopSortMenuSearch.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";
import ListView from "../../../../libs/listview/list_view.js";
import ShopSortHeader from "../item/playlist/ShopSortHeader.js";
import TextBase from "../../component/TextBase.js";
import SocketController from "../../../controller/SocketController.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import SendShopPlayListLoad from "../../../model/shop/server/senddata/SendShopPlayListLoad.js";
import DataConst from "../../../model/DataConst.js";
import GetShopPlayListLoad from "../../../model/shop/server/getdata/GetShopPlayListLoad.js";
import ShopItemGennes from "../item/playlist/ShopItemGennes.js";
import ShopMenuSearch from "../item/playlist/ShopMenuSearch.js";
import ShopChooseSortPlayList from "../item/playlist/ShopChooseSortPlayList.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ShopDataField from "../../../model/shop/datafield/ShopDatafield.js";
import KeyBoard from "../../component/KeyBoard.js";
import ControllLoading from "../../ControllLoading.js";
import ShopItemPlayList from "../item/playlist/ShopItemPlayList.js";

export default class ShopScreenNew extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal(),
            close: new Phaser.Signal,
            show_all: new Phaser.Signal(),
            search: new Phaser.Signal()
        }

        this.ktShowSort = false;
        this.positionShop = MainData.instance().positionShop;
        this.dataPlayList = {
            genres: [],
            playlists: []
        }
        this.idxItem = 0;
        this.countItem = 0;
        this.idDelay = null;

        this.detail = null;
        this.popupBuy = null;
        this.popupMoney = null;
        this.chooseSort = null;

        this.type = ShopSortMenuSearch.SORT_AZ;
        this.local = DataConst.Local;
        this.genres = -1;
        this.itemGenresActive = null;

        this.strSearch = "";
        this.dataList = [];
        this.ktSearch = false;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        this.addChild(this.bg);

        this.parentScroll = new Phaser.Group(game, 0, 0, null);
        this.scroll = new ListView(game, this.parentScroll, new Phaser.Rectangle(0, 0, game.width, game.height - 460 * MainData.instance().scale), {
            direction: 'y',
            padding: 35 * MainData.instance().scale,
            searchForClicks: true
        });
        this.parentScroll.y = 335 * MainData.instance().scale;
        this.addChild(this.parentScroll);



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


        this.txtSearch = new TextBase(this.positionShop.sort_play_list_text_current_search, "Tất cả");
        this.txtSearch.setTextBounds(0, 0, game.width - 71 * MainData.instance().scale, 59 * MainData.instance().scale);
        this.addChild(this.txtSearch);

        this.btnCloseTextSearch = new ButtonBase(this.positionShop.sort_play_list_btn_close_search, this.chooseCloseTextSearch, this);
        this.addChild(this.btnCloseTextSearch);
        this.btnCloseTextSearch.visible = false;
    }
    addEvent() {
        LogConsole.log("addEvent");
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        if (MainData.instance().dataShop === null) {
            SocketController.instance().sendData(ShopCommand.SHOP_PLAYLIST_LOAD_REQUEST, SendShopPlayListLoad.begin());
        } else {
            this.dataPlayList = GetShopPlayListLoad.begin(MainData.instance().dataShop);
            this.buildListGenres();
            this.buildDataList();
            if (this.ktSearch === true) {
                this.ktSearch = false;
                this.addKeyBoard();
            }

            ControllLoading.instance().hideLoading();
        }
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }
    getData(data) {
        switch (data.cmd) {
            case ShopCommand.SHOP_PLAYLIST_LOAD_RESPONSE:
                MainData.instance().dataShop = data.params;
                this.dataPlayList = GetShopPlayListLoad.begin(data.params);
                this.buildListGenres();
                this.buildDataList();
                if (this.ktSearch === true) {
                    this.ktSearch = false;
                    this.addKeyBoard();
                }
                ControllLoading.instance().hideLoading();
                break;
            case ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    SocketController.instance().sendData(ShopCommand.SHOP_PLAYLIST_LOAD_REQUEST, SendShopPlayListLoad.begin());
                }
                break;

        }
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
        this.txtSearch.text = "Tất cả";
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

    changeData(dataPlayList) {
        this.dataPlayList = dataPlayList;
        this.buildDataList();
    }

    chooseItem(item) {
        if (this.genres === -1) {
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

            for (let i = 0; i < this.dataPlayList.playlists.length; i++) {
                if (this.xoa_dau(this.dataPlayList.playlists[i].name).toUpperCase().indexOf(this.xoa_dau(dataString).toUpperCase()) !== -1) {
                    this.dataList.push(this.dataPlayList.playlists[i]);
                }
            }
        } else {
            this.btnCloseTextSearch.visible = false;
            this.txtSearch.text = "Tất cả"
        }
        this.buildDataList();
    }

    buildDataList() {
        if (this.strSearch === "") {
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortAZ);
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortNewPlayList);
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortPhoBien);
            } else {
                this.dataList = this.dataPlayList.playlists.sort(this.sortAZ);
            }
        } else {
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList.sort(this.sortAZ);
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList.sort(this.sortNewPlayList);
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList.sort(this.sortPhoBien);
            } else {
                this.dataList.sort(this.sortAZ);
            }
        }

        this.idxItem = 0;
        this.countItem = 0;

        this.scroll.removeAll();
        this.scroll.reset();

        this.removeDelayBuild();
        this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 0.1, this.addItemPageShop, this);
    }

    addItemPageShop() {
        let list = [];
        let idx = 0;
        let graphics = game.add.graphics(0, 0);
        graphics.drawRect(0, 0, 166 * MainData.instance().scale, 326 * MainData.instance().scale);
        for (let i = this.idxItem; i < this.dataList.length; i++) {
            this.idxItem++;
            if ((this.genres === -1 || this.dataList[i].genre_id === this.genres) && (this.local === this.dataList[i].region) && this.dataList[i].is_owner !== 1) {
                idx++;

                let item = new ShopItemPlayList();
                item.event.CHOOSE.add(this.chooseItemShop, this);
                item.event.BUY.add(this.buyItemShop, this);
                item.setData(this.dataList[i], idx);
                list.push(item);
            }
            if (list.length === 3 || this.idxItem === this.dataList.length) {
                this.countItem++;
                let addItem = new Phaser.Sprite(game, 0, 0, graphics.generateTexture());
                let beginX = 35 * MainData.instance().scale;
                for (let j = 0; j < list.length; j++) {
                    list[j].x = beginX;
                    addItem.addChild(list[j]);
                    beginX += list[j].width + 35 * MainData.instance().scale;
                }
                //addItem.height = 326 * MainData.instance().scale;
                this.scroll.add(addItem);
                if (this.countItem % 3 === 0) {
                    this.removeDelayBuild();
                    this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 0.5, this.addItemPageShop, this);
                    break;
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

    buildListGenres() {
        LogConsole.log(this.listGenres);

        this.listGenres.reset();
        this.listGenres.removeAll();

        let idxToItem = -1;
        let idx = -1;
        this.genres = -1;
        for (let i = 0; i < this.dataPlayList.genres.length; i++) {
            if (this.dataPlayList.genres[i].region === this.local) {
                idx++;
                let item = new ShopItemGennes(this.chooseItem, this);
                if (this.dataPlayList.genres[i].id === this.genres) {
                    this.itemGenresActive = item;
                    item.active();
                    idxToItem = idx;
                } else {
                    item.deactive();
                }
                item.y = 20 * MainData.instance().scale;
                item.setData(this.dataPlayList.genres[i], idx);

                this.listGenres.add(item);
            }
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
        LogConsole.log("addChooseSortPlaylist");
        this.ktShowSort = true;
        this.chooseSort = new ShopChooseSortPlayList();
        this.chooseSort.event.choose_sort.add(this.changeSortPlayList, this)
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
        this.removeDelayBuild();
        this.removeEvent();
        this.bg.destroy();
        this.header.destroy();
        this.menu.destroy();
        this.txtSearch.destroy();
        this.btnCloseTextSearch.destroy();
        this.listGenres.destroy();
        this.removeAllItem();
        this.parentGenres.destroy();

        ControllScreenDialog.instance().removePlaylistDetail();
        ControllScreenDialog.instance().removePopupBuy();
        ControllScreenDialog.instance().removePopupMoney();
        super.destroy();
    }

}