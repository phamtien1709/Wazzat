import DataCommand from "../../common/DataCommand.js";
import PopupDialogWithCloseItem from "./item/PopupDialogWithCloseItem.js";
import UserInfor from "./item/UserInfor.js";
import SpriteBase from "../component/SpriteBase.js";
import TextBase from "../component/TextBase.js";

import PopupShortProfilePlaylist from "./item/PopupShortProfilePlaylist.js";
import GetShortUserProfile from "./data/GetShortUserProfile.js";
import SocketController from "../../controller/SocketController.js";
import ListView from "../../../libs/listview/list_view.js";
import BaseGroup from "../BaseGroup.js";

export default class PopupShortProfileUser extends BaseGroup {
    constructor(userId) {
        super(game);
        this.userId = userId;
        this.positionUserProfile = JSON.parse(game.cache.getText('positionUserProfile'));
        this.addEventExtension();
        this.sendLoadUserProfile();
        this.user;
        this.playlists;
        this.afterInit();
    }

    static get NUMBER_OF_MOST_PLAYLIST() {
        return 5;
    }

    sendLoadUserProfile() {
        LogConsole.log('asdasda');
        var params = new SFS2X.SFSObject();
        params.putInt("user_id", this.userId);
        SocketController.instance().sendData(DataCommand.USER_SHORT_PROFILE_LOAD_REQUEST, params);
    }

    afterInit() {
        this.bgDim;
        this.popup;
        this.inforUser;
        this.scrollPlaylist;
        this.addBgDim();
        this.addPopup();
        this.addFramePopup();
    }

    addBgDim() {
        this.bgDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.addChild(this.bgDim);
    }

    addPopup() {
        this.popup = new PopupDialogWithCloseItem();
        this.popup.x = 60 * window.GameConfig.RESIZE;
        this.popup.y = 300 * window.GameConfig.RESIZE;
        this.popup.setHeight(1320 * window.GameConfig.RESIZE);
        this.popup.event.close.add(this.closePopup, this);
        this.addChild(this.popup);
    }

    closePopup() {
        this.destroy();
    }

    addFramePopup() {
        let line1 = new SpriteBase(this.positionUserProfile.short_profile.line1);
        this.popup.addChild(line1);
        let line2 = new SpriteBase(this.positionUserProfile.short_profile.line2);
        this.popup.addChild(line2);
        let lineGradient = new SpriteBase(this.positionUserProfile.short_profile.line_gradient);
        lineGradient.anchor.set(0.5);
        this.popup.addChild(lineGradient);
        let txtMostPlaylist = new TextBase(this.positionUserProfile.short_profile.txt_most_playlist, this.positionUserProfile.short_profile.txt_most_playlist.text);
        txtMostPlaylist.anchor.set(0.5);
        this.popup.addChild(txtMostPlaylist);
    }

    addInforUser() {
        this.inforUser = new UserInfor(this.user);
        this.popup.addChild(this.inforUser);
    }

    addScrollPlaylists() {
        this.playlists = this.playlists.sort(this.compareExpLevelPlaylist);
        LogConsole.log(this.playlists);
        //
        var gr = new Phaser.Group(game, this);
        gr.x = 0;
        gr.y = 470 * window.GameConfig.RESIZE;
        this.popup.addChild(gr);
        const bounds = new Phaser.Rectangle(0, 0, 960 * window.GameConfig.RESIZE, 860 * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        }
        this.listView = new ListView(game, gr, bounds, options);
        for (let i = 0; i < PopupShortProfileUser.NUMBER_OF_MOST_PLAYLIST; i++) {
            let playlist = new PopupShortProfilePlaylist(this.playlists[i], i);
            this.listView.add(playlist);
        }
    }

    compareExpLevelPlaylist(a, b) {
        if (a.user.exp_score > b.user.exp_score) {
            return -1;
        }
        if (a.user.exp_score < b.user.exp_score) {
            return 1;
        }
        return 0;
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.USER_SHORT_PROFILE_LOAD_RESPONSE) {
            this.dataProfile = GetShortUserProfile.begin(evtParams.params);
            // LogConsole.log(this.dataProfile);
            this.user = this.dataProfile.user;
            this.playlists = this.dataProfile.playlists;
            this.addInforUser();
            this.addScrollPlaylists();
        }
    }

    destroy() {
        this.removeEventExtension();
        this.listView.destroy();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}