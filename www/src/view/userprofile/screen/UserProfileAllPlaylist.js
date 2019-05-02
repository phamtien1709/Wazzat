import BaseView from "../../BaseView.js";
import UserProfileHeader from "../item/UserProfileHeader.js";
import ScrollView from "../../component/listview/ScrollView.js";
import ShopItemPlayList from "../../shopnew/item/playlist/ShopItemPlayList.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import SocketController from "../../../controller/SocketController.js";
import UserProfileCommand from "../../../model/userprofile/datafield/UserProfileCommand.js";
import SendLoadUserProfile from "../../../model/userprofile/server/senddata/SendLoadUserProfile.js";
import DataUser from "../../../model/user/DataUser.js";
import ControllLoading from "../../ControllLoading.js";
import SqlLiteController from "../../../SqlLiteController.js";
import Language from "../../../model/Language.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";

export default class UserProfileAllPlaylist extends BaseView {
    constructor(user_id) {
        super(game, null);

        this.user_id = user_id;
        ControllLoading.instance().showLoading();

        this.event = {
            back: new Phaser.Signal()
        }

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        let obj = {
            column: 3,
            width: game.width,
            height: game.height - 160 * window.GameConfig.RESIZE,
            rowHeight: 326 * window.GameConfig.RESIZE,
            leftDistance: 35 * window.GameConfig.RESIZE,
            direction: "y",
            distanceBetweenColumns: 35 * window.GameConfig.RESIZE,
            distanceBetweenRows: 35 * window.GameConfig.RESIZE
        }
        this.scroll = new ScrollView(obj);
        this.scroll.y = 148 * window.GameConfig.RESIZE;
        this.addChild(this.scroll);

        this.header = new UserProfileHeader();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setBg(false);
        this.header.setTitle(Language.instance().getData("54"));
        this.addChild(this.header);

        if (this.user_id === SocketController.instance().dataMySeft.user_id) {
            SqlLiteController.instance().getPlaylistMe();
            SqlLiteController.instance().event.get_data_me_playlist_complete.add(this.getDataMePlaylistComplete, this);
        } else {
            SocketController.instance().sendData(UserProfileCommand.USER_DETAIL_PLAYLIST_LOAD_REQUEST, SendLoadUserProfile.begin(this.user_id));
        }
    }

    getDataMePlaylistComplete(data) {
        SqlLiteController.instance().event.get_data_me_playlist_complete.remove(this.getDataMePlaylistComplete, this);
        this.setPlaylist(data);
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    setPlaylist(playlists) {
        let list = [];
        LogConsole.log("playlists -----------");
        for (let i = 0; i < playlists.length; i++) {
            let playList = new ShopItemPlayList();
            playList.event.CHOOSE.add(this.choosePlaylist, this);
            playlists[i].is_owner = 1;
            playList.setData(playlists[i], i);
            list.push(playList);
        }

        this.scroll.viewList = list;

        ControllLoading.instance().hideLoading();
    }

    choosePlaylist(data) {
        ControllScreenDialog.instance().addPlaylistDetail(data.id);
    }

    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        this.scroll.destroy();
        super.destroy();
    }
}