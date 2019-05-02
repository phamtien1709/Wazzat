import BaseView from "../../../BaseView.js";
import ShopSortMenuSearch from "./ShopSortMenuSearch.js";
import TextBase from "../../../component/TextBase.js";
import ButtonBase from "../../../component/ButtonBase.js";
import MainData from "../../../../model/MainData.js";
import ScrollView from "../../../component/listview/ScrollView.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import ListView from "../../../../../libs/listview/list_view.js";
import ShopSortHeader from "./ShopSortHeader.js";
import SocketController from "../../../../controller/SocketController.js";
import SendShopPlayListLoad from "../../../../model/shop/server/senddata/SendShopPlayListLoad.js";
import ShopCommand from "../../../../model/shop/datafield/ShopCommand.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import DataConst from "../../../../model/DataConst.js";
import GetShopPlayListLoad from "../../../../model/shop/server/getdata/GetShopPlayListLoad.js";
import ShopItemGennes from "./ShopItemGennes.js";
import ShopItemPlayList from "./ShopItemPlayList.js";

export default class ShopSortPlayList extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.event = {
            back: new Phaser.Signal()
        }

        this.positionShop = MainData.instance().positionShop;
        this.dataPlayList = {
            genres: [],
            playlists: []
        }

        this.detail = null;
        this.popupBuy = null;
        this.popupMoney = null;

        this.type = ShopSortMenuSearch.SORT_AZ;
        this.local = DataConst.Local;
        this.genres = -1;
        this.itemGenresActive = null;

        this.strSearch = "";
        this.dataList = [];
        this.ktSearch = false;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        //this.bg.input.useHandCursor = false;
        this.addChild(this.bg);

        let obj = {
            column: 3,
            width: game.width,
            height: 732 * MainData.instance().scale,
            rowHeight: 326 * MainData.instance().scale,
            leftDistance: 35 * MainData.instance().scale,
            direction: "y",
            distanceBetweenColumns: 35 * MainData.instance().scale,
            distanceBetweenRows: 35 * MainData.instance().scale
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 376 * MainData.instance().scale;
        this.addChild(this.scroll);

        this.bgGenres = new ButtonBase(this.positionShop.sort_play_list_bg_search_menu);
        this.bgGenres.height = 136 * MainData.instance().scale;
        this.bgGenres.y = 100 * MainData.instance().scale;
        this.addChild(this.bgGenres);

        this.line = new SpriteScale9Base(this.positionShop.shop_line);
        this.line.x = 0 * MainData.instance().scale;
        this.line.y = this.bgGenres.y + this.bgGenres.height - 2 * MainData.instance().scale;
        this.addChild(this.line);


        let parentGenres = new Phaser.Group(game, 0, 0, null);
        this.listGenres = new ListView(game, parentGenres, new Phaser.Rectangle(0, 0, game.width, 95 * MainData.instance().scale), {
            direction: 'x',
            padding: 18 * MainData.instance().scale,
            bouncing: true,
            searchForClicks: true
        });

        parentGenres.x = 0;
        parentGenres.y = 112 * MainData.instance().scale;
        this.addChild(parentGenres);

        this.header = new ShopSortHeader();
        this.header.addEventSearch(this.searchData, this);
        this.header.addEventBack(this.chooseBackHeader, this);
        this.addChild(this.header);

        this.menu = new ShopSortMenuSearch();
        this.menu.addEventChangeMenu(this.changeMenu, this);
        this.menu.y = 238 * MainData.instance().scale;
        this.addChild(this.menu);

        this.txtSearch = new TextBase(this.positionShop.sort_play_list_text_current_search, "");
        this.txtSearch.setTextBounds(0, 0, game.width - 71 * MainData.instance().scale, 59 * MainData.instance().scale);
        this.addChild(this.txtSearch);

        this.btnCloseTextSearch = new ButtonBase(this.positionShop.sort_play_list_btn_close_search, this.chooseCloseTextSearch, this);
        this.addChild(this.btnCloseTextSearch);
        this.btnCloseTextSearch.visible = false;

    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().sendData(ShopCommand.SHOP_PLAYLIST_LOAD_REQUEST, SendShopPlayListLoad.begin());
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
    }
    getData(data) {
        switch (data.cmd) {
            case ShopCommand.SHOP_PLAYLIST_LOAD_RESPONSE:
                this.dataPlayList = GetShopPlayListLoad.begin(data.params);
                this.buildListGenres();
                this.buildDataList();
                if (this.ktSearch === true) {
                    this.ktSearch = false;
                    this.addKeyBoard();
                }
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
        this.event.back.dispatch();
    }

    chooseCloseTextSearch() {
        this.btnCloseTextSearch.visible = false;
        this.txtSearch.text = "";
        this.strSearch = "";

        this.buildDataList();
    }

    changeMenu(type) {
        this.type = type;
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
        }
        this.buildDataList();
    }

    buildDataList() {
        if (this.strSearch === "") {
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortTopNgheSi);
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortNewPlayList);
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList = this.dataPlayList.playlists.sort(this.sortPhoBien);
            } else {
                this.dataList = this.dataPlayList.playlists.sort(this.sortAZ);
            }
        } else {
            if (this.type === ShopSortMenuSearch.SORT_AZ) {
                this.dataList.sort(this.sortTopNgheSi);
            } else if (this.type === ShopSortMenuSearch.SORT_NEW) {
                this.dataList.sort(this.sortNewPlayList);
            } else if (this.type === ShopSortMenuSearch.SORT_POP) {
                this.dataList.sort(this.sortPhoBien);
            } else {
                this.dataList.sort(this.sortAZ);
            }
        }
        let list = [];
        let idx = -1;
        for (let i = 0; i < this.dataList.length; i++) {

            if ((this.genres === -1 || this.dataList[i].genre_id === this.genres) && (this.local === this.dataList[i].region) && this.dataList[i].is_owner !== 1) {
                idx++;
                let item = new ShopItemPlayList();
                item.event.CHOOSE.add(this.chooseItemShop, this);
                item.event.BUY.add(this.buyItemShop, this);
                item.setData(this.dataList[i], idx);
                list.push(item);
            }
        }

        this.scroll.viewList = list;
    }

    buildListGenres() {

        this.listGenres.removeAll();
        this.listGenres.reset();
        let idxToItem = -1;
        let idx = -1;
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
                item.y = 15 * MainData.instance().scale;
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

    destroy() {
        LogConsole.log("destroy - ShopSortPlayList");
        this.removeEvent();
        this.bg.destroy();
        this.header.destroy();
        this.menu.destroy();
        this.txtSearch.destroy();
        this.btnCloseTextSearch.destroy();
        this.listGenres.removeAll();
        this.listGenres.destroy();
        this.scroll.destroy();
        this.removeAllItem();
        ControllScreenDialog.instance().removePlaylistDetail();
        ControllScreenDialog.instance().removePopupBuy();
        ControllScreenDialog.instance().removePopupMoney();
        super.destroy();
    }
}