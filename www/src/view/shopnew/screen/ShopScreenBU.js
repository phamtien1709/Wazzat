import BaseView from "../../BaseView.js";
import DataConst from "../../../model/DataConst.js";
import ListView from "../../../../libs/listview/list_view.js";
import MainData from "../../../model/MainData.js";
import ShopListPlayList from "../item/playlist/ShopListPlayList.js";
import ShopListGennes from "../item/playlist/ShopListGennes.js";
import ShopMenuSearch from "../item/playlist/ShopMenuSearch.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ShopCommand from "../../../model/shop/datafield/ShopCommand.js";
import SendShopPlayListLoad from "../../../model/shop/server/senddata/SendShopPlayListLoad.js";
import GetShopPlayListLoad from "../../../model/shop/server/getdata/GetShopPlayListLoad.js";
import ShopSortMenuSearch from "../item/playlist/ShopSortMenuSearch.js";

export default class ShopScreenBU extends BaseView {
    constructor() {
        super(game, null);

        this.event = {
            close: new Phaser.Signal(),
            show_all: new Phaser.Signal(),
            search: new Phaser.Signal()
        }

        this.dataPlayList = {
            genres: [],
            playlists: []
        }

        this.sortPlayList = null;
        this.type = DataConst.Local;
        this.genres = -1;

        let parentContent = new Phaser.Group(game, 0, 0, null);
        this.listContent = new ListView(game, parentContent, new Phaser.Rectangle(0, 0, game.width, 732 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        parentContent.x = 0;
        parentContent.y = 281 * MainData.instance().scale;
        this.addChild(parentContent);

        this.playListPhobien = new ShopListPlayList(ShopListPlayList.PHO_BIEN);
        this.playListPhobien.addEventViewAll(this.chooseViewAll, this);
        this.playListPhobien.addLine();
        this.listContent.add(this.playListPhobien);

        this.playListMoiNhat = new ShopListPlayList(ShopListPlayList.NEW);
        this.playListMoiNhat.addEventViewAll(this.chooseViewAll, this);
        this.playListMoiNhat.addLine();
        this.listContent.add(this.playListMoiNhat);

        this.playListTopArtist = new ShopListPlayList(ShopListPlayList.TOP);
        this.playListTopArtist.addEventViewAll(this.chooseViewAll, this);
        this.listContent.add(this.playListTopArtist);

        this.genresList = new ShopListGennes();
        this.genresList.y = 89 * MainData.instance().scale;
        this.genresList.event.view_all.add(this.chooseViewAll, this);
        this.genresList.event.choose.add(this.chooseGenres, this);
        this.genresList.event.search.add(this.chooseSearch, this);
        this.addChild(this.genresList);

        this.menu = new ShopMenuSearch();
        this.menu.event.close.add(this.chooseClose, this);
        this.menu.event.change_menu.add(this.changeMenu, this);
        this.menu.y = 0;
        this.addChild(this.menu);

        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Shop_playlist);

        // this.addEvent();
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
                this.buildLayoutShop();
                break;
            case ShopCommand.SHOP_BUY_PLAYLIST_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    SocketController.instance().sendData(ShopCommand.SHOP_PLAYLIST_LOAD_REQUEST, SendShopPlayListLoad.begin());
                }
                break;

        }
    }

    buildLayoutShop() {

        this.genresList.buildListGenres(this.dataPlayList.genres, this.type);
        this.changeListPlaylist();


    }

    changeListPlaylist() {
        LogConsole.log("pho bien --------------------------------------------");
        this.dataPlayList.playlists = this.dataPlayList.playlists.sort(this.sortPhoBien);
        this.playListPhobien.buildPlayList(this.dataPlayList.playlists, this.type, this.genres);

        LogConsole.log("----------------------------------------");

        this.dataPlayList.playlists = this.dataPlayList.playlists.sort(this.sortNewPlayList);
        this.playListMoiNhat.buildPlayList(this.dataPlayList.playlists, this.type, this.genres);

        this.dataPlayList.playlists = this.dataPlayList.playlists.sort(this.sortTopNgheSi);
        this.playListTopArtist.buildPlayList(this.dataPlayList.playlists, this.type, this.genres);
    }

    chooseGenres(genres) {
        this.genres = genres;
        LogConsole.log("chooseGenres : " + this.genres);
        this.changeListPlaylist();
    }

    chooseViewAll(data) {

        // this.dataPlayList, this.type, this.genres, typeMenu
        let typeMenu = "";
        if (data === ShopListPlayList.NEW) {
            typeMenu = ShopSortMenuSearch.SORT_NEW;
        } else if (data === ShopListPlayList.PHO_BIEN) {
            typeMenu = ShopSortMenuSearch.SORT_POP;
        } else if (data === ShopListPlayList.TOP) {
            typeMenu = ShopSortMenuSearch.SORT_AZ;
        }

        let objData = {
            type: this.type,
            genres: this.genres,
            typeMenu: typeMenu,
            ktSearch: false
        }

        this.event.show_all.dispatch(objData);
    }

    chooseSearch() {
        let objData = {
            type: this.type,
            genres: this.genres,
            typeMenu: "",
            ktSearch: true
        }
        this.event.search.dispatch(objData);
    }

    chooseClose() {
        // FacebookAction.instance().share();
        this.event.close.dispatch();
    }

    changeMenu(type) {
        this.type = type;
        this.buildLayoutShop();
    }
    destroy() {

        this.removeEvent();
        this.listContent.removeAll();
        this.listContent.destroy();
        this.removeAllItem();
    }

}