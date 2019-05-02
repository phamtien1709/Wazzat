import ChallPlaylistGroupMenuModule from "../item/ChallPlaylistGroupMenuModule.js";
import DataCommand from "../../../common/DataCommand.js";
import SocketController from "../../../controller/SocketController.js";
import ControllLoading from "../../ControllLoading.js";
import EventGame from "../../../controller/EventGame.js";
import SqlLiteController from "../../../SqlLiteController.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBaseChoosePlaylist extends BaseGroup {
    constructor(friend) {
        /* 
        friend = {
            avatar: string,
            id: int, 
            userName: string
        */
        super(game);
        this.friend = friend;
        this.afterInit();
        this.playlist = {
            id: null,
            name: null
        };
        // this.prevScr = prevScr;
        this.event = {
            choosePlaylist: new Phaser.Signal(),
            backScreen: new Phaser.Signal()
        }
    }

    afterInit() {
        this.addEventExtension();
        this.challPlaylistGroupMenuModule = null;
        this.sendRequestGetPlaylist();
    }

    //LOGIC CODE
    sendRequestGetPlaylist() {
        SqlLiteController.instance().event.get_data_me_playlist_complete.add(this.getDataMePlaylistComplete, this);
        SqlLiteController.instance().getPlaylistMe(true);
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.choosePlaylistBack, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.remove(this.choosePlaylistBack, this);
    }

    getDataMePlaylistComplete(response) {
        SqlLiteController.instance().event.get_data_me_playlist_complete.remove(this.getDataMePlaylistComplete, this);
        this.responseSQlPlaylistMe = response;
        this.loadPlaylistComplete();
    }

    onExtensionResponse(evtParams) {

    }
    loadPlaylistComplete() {
        this.handleParamsOnGetPlaylistResponse(1, () => {
            this.addChallPlaylist();
            //
            ControllLoading.instance().hideLoading();
        });
    }

    signalBuyPlaylistDone() {
        this.sendRequestGetPlaylist(this.friend.id);
    }

    handleParamsOnGetPlaylistResponse(count, callback) {
        this.playlists = [];
        if (count == 1) {
            this.playlists = this.responseSQlPlaylistMe.playlist;
            // }
            this.playlists = this.playlists.sort(this.sortPlaylists);
            this.handleSuggestionPlaylist();
            callback();
        }
    }

    sortPlaylists(a1, a2) {
        if (a1.user) {
            if (a1.user.updated > a2.user.updated) {
                return -1;
            } else if (a1.user.updated < a2.user.updated) {
                return 1;
            } else { return 0 }
        } else {
            return 1;
        }
    }

    handleSuggestionPlaylist() {
        if (this.responseSQlPlaylistMe.suggestion_playlist !== null) {
            this.suggestion_playlist = this.responseSQlPlaylistMe.suggestion_playlist;
            this.suggestion_playlist.isFree = Math.round(Math.random());
        } else {
            this.suggestion_playlist = null;
        }
    }

    addChallPlaylist() {
        this.removeChallPlaylist();
        this.challPlaylistGroupMenuModule = new ChallPlaylistGroupMenuModule(this.friend);
        this.challPlaylistGroupMenuModule.signalBuyPlaylistDone.add(this.signalBuyPlaylistDone, this);
        this.challPlaylistGroupMenuModule.event.choosePlaylist.add(this.choosePlaylist, this);
        this.challPlaylistGroupMenuModule.event.backScreen.add(this.choosePlaylistBack, this);
        this.challPlaylistGroupMenuModule.addChallPlayListGroup(this.playlists, this.suggestion_playlist);
        this.addChild(this.challPlaylistGroupMenuModule);
    }
    choosePlaylistBack() {
        this.event.backScreen.dispatch();
    }
    choosePlaylist(playlist) {
        this.playlist = playlist;
        this.event.choosePlaylist.dispatch(this.playlist);
    }
    removeChallPlaylist() {
        if (this.challPlaylistGroupMenuModule !== null) {
            this.removeChild(this.challPlaylistGroupMenuModule);
            this.challPlaylistGroupMenuModule.destroy();
            this.challPlaylistGroupMenuModule = null;
        }
    }

    destroy() {
        this.removeEventExtension();
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