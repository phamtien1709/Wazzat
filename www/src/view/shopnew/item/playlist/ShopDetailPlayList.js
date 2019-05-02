import ShopPlayList from "../../../../model/shop/data/ShopPlayList.js";
import ShopDetailPlayListHeader from "./ShopDetailPlayListHeader.js";
import AvatarAlbum from "../../../base/AvatarAlbum.js";
import MainData from "../../../../model/MainData.js";
import TextBase from "../../../component/TextBase.js";
import ButtonWithText from "../../../component/ButtonWithText.js";
import LevelPlaylist from "../../../base/LevelPlaylist.js";
import ListView from "../../../../../libs/listview/list_view.js";
import SpriteBase from "../../../component/SpriteBase.js";
import SocketController from "../../../../controller/SocketController.js";
import ShopCommand from "../../../../model/shop/datafield/ShopCommand.js";
import SendShopPlayListDetail from "../../../../model/shop/server/senddata/SendShopPlayListDetail.js";
import GetPlayListDetail from "../../../../model/shop/server/getdata/GetPlayListDetail.js";
import ShopItemSongDetail from "./ShopItemSongDetail.js";
import SendShopPlayListChangeActive from "../../../../model/shop/server/senddata/SendShopPlayListChangeActive.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import ShopDataField from "../../../../model/shop/datafield/ShopDatafield.js";
import BaseLoadAsset from "../../../BaseLoadAsset.js";
import ControllLoading from "../../../ControllLoading.js";
import SqlLiteController from "../../../../SqlLiteController.js";
import DataUser from "../../../../model/user/DataUser.js";
import Language from "../../../../model/Language.js";

export default class ShopDetailPlayList extends BaseLoadAsset {
    constructor(playlist_id) {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.playListDetail = new ShopPlayList();
        this.playlist_id = playlist_id;
        this.eventBack = new Phaser.Signal();

        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionDetailPlaylist.json",
                key: "positionDetailPlaylist"
            },
            {
                type: "atlas",
                link: "img/atlas/detailplaylist.png",
                key: "detailplaylist",
                linkJson: "img/atlas/detailplaylist.json"
            }
        ]

        this.loadResource();
    }

    loadFileComplete() {
        super.loadFileComplete();
        this.buildScreen();
    }

    buildScreen() {

        this.positionShop = MainData.instance().positionDetailPlaylist;

        this.bg = new Phaser.Button(game, 0, 0, 'bg-playlist');
        //this.bg.input.useHandCursor = false;
        this.addChild(this.bg);
        this.popupBuy = null;
        this.popupMoney = null;

        this.header = new ShopDetailPlayListHeader();
        this.header.addEventBack(this.chooseBack, this);
        this.addChild(this.header);

        this.ava = new AvatarAlbum();
        this.ava.setSize(163 * MainData.instance().scale, 163 * MainData.instance().scale);
        this.ava.x = 234 * MainData.instance().scale;
        this.ava.y = 148 * MainData.instance().scale;
        this.addChild(this.ava);

        this.vipIcon = new Phaser.Sprite(game, 0, 133, 'vipSource', 'Lable_Vip');
        this.vipIcon.visible = false;
        this.ava.addChild(this.vipIcon);

        this.namePlayList = new TextBase(this.positionShop.detail_playlist_name, "");
        this.namePlayList.setTextBounds(0, 0, game.width - 47 * MainData.instance().scale, 41 * MainData.instance().scale);
        this.addChild(this.namePlayList);

        this.detailPlayList = new TextBase(this.positionShop.detail_playlist_detail, "");
        this.detailPlayList.setTextBounds(0, 0, 533 * MainData.instance().scale, 118 * MainData.instance().scale);
        this.addChild(this.detailPlayList);

        this.btnBuy = new ButtonWithText(this.positionShop.playlist_button_buy, "0", this.chooseBuy, this);
        this.btnBuy.visible = false;
        this.btnBuy.x = (game.width - this.btnBuy.width) / 2;
        this.addChild(this.btnBuy);

        this.btnKichHoat = new ButtonWithText(this.positionShop.detail_button_kichhoat, "aaaaaaaa", this.chooseKickHoat, this);
        this.btnKichHoat.visible = false;
        this.addChild(this.btnKichHoat);
        this.btnBuy.y = this.positionShop.detail_button_kichhoat.y * MainData.instance().scale;

        this.txtBaiHat = new TextBase(this.positionShop.detail_playlist_lb_baihat, Language.instance().getData("138"));
        this.txtBaiHat.setTextBounds(0, 0, 207 * MainData.instance().scale, 35 * MainData.instance().scale);
        this.addChild(this.txtBaiHat)

        this.levelPlayList = new LevelPlaylist();
        this.levelPlayList.x = this.ava.x + (this.ava.width - this.levelPlayList.width) / 2;
        this.levelPlayList.y = 373 * MainData.instance().scale;
        this.addChild(this.levelPlayList);

        this.txtCountBaiHat = new TextBase(this.positionShop.detail_playlist_lb_count_baihat, "0");
        this.txtCountBaiHat.setTextBounds(0, 0, 189 * MainData.instance().scale, 31 * MainData.instance().scale);
        this.addChild(this.txtCountBaiHat)

        let parentSong = new Phaser.Group(game, 0, 0, null);
        this.listSong = new ListView(game, parentSong, new Phaser.Rectangle(0, 0, 586 * MainData.instance().scale, 420 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        parentSong.x = 35 * MainData.instance().scale;
        parentSong.y = 708 * MainData.instance().scale;
        this.addChild(parentSong);

        this.line = new SpriteBase(this.positionShop.detail_playlist_item_line);
        this.line.width = 570 * MainData.instance().scale;
        this.addChild(this.line);

        this.activeBaiHat = new SpriteBase(this.positionShop.detail_playlist_active_baihat);
        this.addChild(this.activeBaiHat);

        this.line.y = this.activeBaiHat.y + 3;
        this.line.x = this.activeBaiHat.x;

        this.addEvent();

    }

    addEventBack(callback, scope) {
        this.eventBack.add(callback, scope);
    }
    removeEventBack(callback, scope) {
        this.eventBack.remove(callback, scope);
    }
    dispatchEventBack() {
        this.eventBack.dispatch();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().sendData(ShopCommand.PLAYLIST_DETAIL_REQUEST, SendShopPlayListDetail.begin(this.playlist_id));
        DataUser.instance().event.buy_playlist.add(this.sendGetDataPlaylist, this)
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        DataUser.instance().event.buy_playlist.remove(this.sendGetDataPlaylist, this)
    }

    sendGetDataPlaylist() {
        console.log("sendGetDataPlaylist------------");
        ControllLoading.instance().showLoading();
        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDataPlaylistComplete, this);
        SqlLiteController.instance().getPlaylistById(this.playlist_id, null, SocketController.instance().dataMySeft.user_id);
    }

    getDataPlaylistComplete(data) {
        console.log("getDataPlaylistComplete");
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDataPlaylistComplete, this);
        console.log(data);

        this.playListDetail.is_highlight = data.is_highlight;
        this.playListDetail.used_times = data.used_times;
        this.playListDetail.thumb = data.thumb;
        this.playListDetail.created = data.created;
        this.playListDetail.is_owner = data.is_owner;
        this.playListDetail.description = data.description;
        this.playListDetail.active = data.active;
        this.playListDetail.is_default = data.is_default;
        this.playListDetail.genre_id = data.genre_id;
        this.playListDetail.price = data.price;
        this.playListDetail.is_general = data.is_general;
        this.playListDetail.name = data.name;
        this.playListDetail.purchased_count = data.purchased_count;
        this.playListDetail.id = data.id;
        this.playListDetail.vip = data.vip;
        this.playListDetail.is_solo_mode = data.is_solo_mode;
        this.playListDetail.updated = data.updated;
        this.playListDetail.country_id = data.country_id;
        this.playListDetail.region = data.region;
        this.playListDetail.user = data.user;

        this.buildDataDetail();
    }

    getData(data) {
        //LogConsole.log("ShopPlayList : " + data.params.getDump());   
        switch (data.cmd) {
            case ShopCommand.PLAYLIST_DETAIL_RESPONSE:
                LogConsole.log("PLAYLIST_DETAIL_RESPONSE : " + data.params.getDump());
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    this.playListDetail = GetPlayListDetail.begin(data.params, this.playlist_id);
                    this.sendGetDataPlaylist();
                    //
                } else {
                    ControllLoading.instance().hideLoading();
                    this.chooseBack();
                }
                break;
            case ShopCommand.PLAYLIST_CHANGE_ACTIVE_RESPONSE:
                if (data.params.getUtfString(ShopDataField.status) === "OK") {
                    // SocketController.instance().sendData(ShopCommand.PLAYLIST_DETAIL_REQUEST, SendShopPlayListDetail.begin(this.playlist_id));
                }
                ControllLoading.instance().hideLoading();
                break;

        }
    }

    buildDataDetail() {

        console.log(this.playListDetail);

        this.ava.beginLoad(this.playListDetail.thumb, 1);
        this.namePlayList.text = this.playListDetail.name;
        this.btnBuy.setText(this.playListDetail.price);
        this.txtCountBaiHat.text = this.playListDetail.arrSong.length;

        this.detailPlayList.text = this.playListDetail.description;

        this.levelPlayList.setData(this.playListDetail.user);
        this.levelPlayList.x = this.ava.x + (this.ava.width - this.levelPlayList.width) / 2;

        this.listSong.removeAll();
        this.listSong.reset();

        for (let i = 0; i < this.playListDetail.arrSong.length; i++) {

            let item = new ShopItemSongDetail();
            if (i === 0) {
                item.hideLine();
            }
            this.playListDetail.arrSong[i].playlist_name = this.playListDetail.name;
            item.setData(this.playListDetail.arrSong[i]);
            this.listSong.add(item);
        }

        if (this.playListDetail.user.user_id == SocketController.instance().dataMySeft.user_id) {
            this.btnBuy.visible = false;
            this.btnKichHoat.visible = true;

            if (this.playListDetail.user.active === 0) {
                this.btnKichHoat.setText(Language.instance().getData("139"));
            } else {
                this.btnKichHoat.setText(Language.instance().getData("140"));
            }

        } else {
            this.btnBuy.visible = true;
            this.btnKichHoat.visible = false;
        }

        if (this.playListDetail.vip === true) {
            this.vipIcon.visible = true;
        }

        ControllLoading.instance().hideLoading();
    }

    chooseBuy() {
        ControllScreenDialog.instance().buyItem(this.playListDetail);
    }
    chooseKickHoat() {

        let activeSend = 0;
        if (this.playListDetail.user.active === 0) {
            activeSend = 1;
            this.playListDetail.user.active = 1;
        } else {
            activeSend = 0;
            this.playListDetail.user.active = 0;
        }

        if (activeSend === 0) {
            this.btnKichHoat.setText(Language.instance().getData("139"));
        } else {
            this.btnKichHoat.setText(Language.instance().getData("140"));
        }

        SocketController.instance().sendData(ShopCommand.PLAYLIST_CHANGE_ACTIVE_REQUEST, SendShopPlayListChangeActive.begin(this.playlist_id, activeSend));

        SqlLiteController.instance().changeActivePlaylist(this.playlist_id, activeSend);

        ControllLoading.instance().showLoading();
    }

    chooseBack() {
        this.dispatchEventBack();
    }



    destroy() {
        this.removeEvent();
        MainData.instance().positionDetailPlaylistData = null;
        this.listSong.removeAll();
        this.listSong.destroy();
        ControllScreenDialog.instance().removePopupBuy();
        ControllScreenDialog.instance().removePopupMoney();
        super.destroy();
    }
}