import GetPlaylistSuggestPlaylistSprite from "./GetPlaylistSuggestPlaylistSprite.js";
import DataCommand from "../../../../common/DataCommand.js";
import SocketController from "../../../../controller/SocketController.js";
import BaseGroup from "../../../BaseGroup.js";

export default class GetPlaylistSuggestPlaylist extends BaseGroup {
    constructor(friend = null) {
        super(game);
        this.positionMainConfig = JSON.parse(game.cache.getText('positionMainConfig'));
        this.signalBuyPlaylistDone = new Phaser.Signal();
        this.event = {
            choosedPlaylist: new Phaser.Signal()
        }
        this.friend = friend;
    }

    afterGetPlaylistDone(playlist) {
        this.playlist = playlist;
        if (this.group == undefined || this.group == null) {
            // LogConsole.log('alibaba');
            this.group = new Phaser.Group(game);
            this.addChild(this.group);
        }
    }

    addSuggestPlaylist() {
        // LogConsole.log(this.positionMainConfig.tab_recent);
        // LogConsole.log(this.playlist);
        var suggestPlaylist = new GetPlaylistSuggestPlaylistSprite(this.positionMainConfig.tab_recent, this.playlist);
        this.addChild(suggestPlaylist);
        suggestPlaylist.checkHasSuggestPlaylist(this.playlist, (isHasPlaylist) => {
            if (isHasPlaylist) {
                suggestPlaylist.addThumb();
                suggestPlaylist.beginLoadThumb(this.playlist.thumb);
                suggestPlaylist.addTabGem(this.positionMainConfig.Tab_gem, this.positionMainConfig.txt_try_suggest_playlist_free);
                suggestPlaylist.addTxtGem(this.playlist.price, this.positionMainConfig.txt_price_suggest_playlist);
                suggestPlaylist.addTxtPlaylist(this.playlist.name, this.positionMainConfig.txt_suggest_playlist);
                suggestPlaylist.addInput(this.onClickSuggestPlaylist, this);
            } else {
                this.destroy();
            }
        })
    }

    addOwnerPlaylist() {

    }

    onClickSuggestPlaylist(evt) {
        LogConsole.log(evt);
        if (evt.isBuyDone) {
            if (evt.isBuyDone == true) {
                // LogConsole.log('okokok');
                this.signalBuyPlaylistDone.dispatch();
            }
        } else {
            if (evt.isBuy === true) {
                LogConsole.log(`true: ${evt.isBuy}`);
                this.sendRequestBuyPlaylist(evt.id);
            } else if (evt.isBuy === false) {
                LogConsole.log(`false: ${evt.isBuy}`);
            } else {
                this.questions = [];
                this.playlistId = evt.id;
                this.playlistName = evt.name;
                this.sendRequestChoosePlaylist(evt.id);
            }

        }
        // LogConsole.log(id);
    }

    removeGroup() {
        if (this.group !== null) {
            this.group.destroy();
        }
        this.group = null;
    }

    sendRequestChoosePlaylist(id) {
        // LogConsole.log('clap');
        // LogConsole.log(id);
        this.event.choosedPlaylist.dispatch({
            id: id,
            name: this.playlist.name
        });
        // var params = new SFS2X.SFSObject();
        // params.putInt("playlist_id", id);
        // params.putInt("opponent_id", this.friend.id);
        // SocketController.instance().sendData(DataCommand.CHALLENGE_GAME_QUESTIONS_REQUEST, params);
    }

    sendRequestBuyPlaylist(id) {
        // LogConsole.log(id);
        var params = new SFS2X.SFSObject();
        params.putInt("playlist_id", id);
        SocketController.instance().sendData(DataCommand.SHOP_BUY_PLAYLIST_REQUEST, params);
    }

    destroy() {
        // this.removeEvent();
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        super.destroy();
    }
}