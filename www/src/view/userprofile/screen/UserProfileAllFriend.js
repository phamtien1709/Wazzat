import BaseView from "../../BaseView.js";
import UserProfileHeader from "../item/UserProfileHeader.js";
import IronSource from "../../../IronSource.js";
import OnlineModeFriendItem from "../../onlinemode/item/OnlineModeFriendItem.js";
import ListView from "../../../../libs/listview/list_view.js";
import MainData from "../../../model/MainData.js";
import SocketController from "../../../controller/SocketController.js";
import UserProfileCommand from "../../../model/userprofile/datafield/UserProfileCommand.js";
import SendLoadUserProfile from "../../../model/userprofile/server/senddata/SendLoadUserProfile.js";
import ControllLoading from "../../ControllLoading.js";
import DataUser from "../../../model/user/DataUser.js";
import ControllLoadCacheUrl from "../../component/ControllLoadCacheUrl.js";
import Language from "../../../model/Language.js";


export default class UserProfileAllFriend extends BaseView {
    constructor(user_id) {
        super(game, null);
        ControllLoading.instance().showLoading();
        this.event = {
            back: new Phaser.Signal()
        }

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);


        let parentListFriend = new Phaser.Group(game, 0, 0, null);
        this.listFriends = new ListView(game, parentListFriend, new Phaser.Rectangle(0, 0, game.width, game.height - 100 * MainData.instance().scale), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });

        parentListFriend.x = 0;
        parentListFriend.y = 100 * MainData.instance().scale;
        this.addChild(parentListFriend);

        this.header = new UserProfileHeader();
        this.header.event.back.add(this.chooseBack, this);
        this.header.setBg(false);
        this.header.setTitle(Language.instance().getData("163"));
        this.addChild(this.header);


        IronSource.instance().showBanerViewAllFriendScreen();

        if (SocketController.instance().dataMySeft.user_id === user_id) {
            if (DataUser.instance().ktLoadFriend === true) {
                this.setFriend(DataUser.instance().listFriend.getFriends());
            } else {
                DataUser.instance().event.load_list_friend_complete.add(this.loadListFriendComplete, this);
                DataUser.instance().sendGetFriendsList();
            }
        } else {
            SocketController.instance().sendData(UserProfileCommand.USER_FRIEND_LIST_LOAD_REQUEST, SendLoadUserProfile.begin(user_id));
        }
    }

    loadListFriendComplete() {
        this.setFriend(DataUser.instance().listFriend.getFriends());
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    setFriend(friends) {
        let list = [];
        LogConsole.log("playlists -----------");
        for (let i = 0; i < friends.length; i++) {
            let item = new OnlineModeFriendItem();
            item.setData(friends[i], i, true);
            this.listFriends.add(item);
        }
        ControllLoading.instance().hideLoading();
    }

    destroy() {
        ControllLoadCacheUrl.instance().resetLoad();
        DataUser.instance().event.load_list_friend_complete.remove(this.loadListFriendComplete, this);
        IronSource.instance().hideBanner();
        this.listFriends.removeAll();
        this.listFriends.destroy();
        super.destroy();
    }
}