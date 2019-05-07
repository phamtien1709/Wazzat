import UserProfileScreen from "./screen/UserProfileScreen.js";
import UserProfileCommand from "../../model/userprofile/datafield/UserProfileCommand.js";
import SocketController from "../../controller/SocketController.js";
import SendLoadUserProfile from "../../model/userprofile/server/senddata/SendLoadUserProfile.js";
import UserProfileAllPlaylist from "./screen/UserProfileAllPlaylist.js";
import UserProfileAllAchievement from "./screen/UserProfileAllAchievement.js";
import UserProfileAllFriend from "./screen/UserProfileAllFriend.js";
import EventGame from "../../controller/EventGame.js";
import ControllLoading from "../ControllLoading.js";
import GetUserDetail from "../../model/userprofile/server/getdata/GetUserDetail.js";
import GetDetailPlayListByUser from "../../model/userprofile/server/getdata/GetDetailPlayListByUser.js";
import GetDetailAchievementByUser from "../../model/userprofile/server/getdata/GetDetailAchievementByUser.js";
import GetDetailFriendByUser from "../../model/userprofile/server/getdata/GetDetailFriendByUser.js";
import BaseLoadAsset from "../BaseLoadAsset.js";
import SqlLiteController from "../../SqlLiteController.js";
import ShopUserPlayListMapping from "../../model/shop/data/ShopUserPlayListMapping.js";


export default class UserProfile extends BaseLoadAsset {
    static get SCREEN_PROFILE() {
        return 0;
    }
    static get SCREEN_PLAYLIST() {
        return 1;
    }
    static get SCREEN_ACHIEVEMENT() {
        return 2;
    }
    static get SCREEN_FRIEND() {
        return 3;
    }

    constructor(user_id, screenIdx = 0) {
        super(game, null);
        this.event = {
            back: new Phaser.Signal()
        }

        LogConsole.log("user_id GGG : " + user_id);

        this.screenIdx = screenIdx;
        this.user_id = user_id;
        this.userProfile = null;
        this.allPlaylist = null;
        this.allAchievement = null;
        this.allFriend = null;
        this.dataProfile = null;

        this.arrResource = [
            {
                type: "atlas",
                link: "img/atlas/userprofile.png",
                key: "userprofile",
                linkJson: "img/atlas/userprofile.json"
            }
        ]

        this.loadResource();
    }

    loadFileComplete() {
        super.loadFileComplete();

        switch (this.screenIdx) {
            case UserProfile.SCREEN_PROFILE:
                this.addUserProfile();
                break;
            case UserProfile.SCREEN_ACHIEVEMENT:
                this.addAllAchievement();
                break;
            case UserProfile.SCREEN_PLAYLIST:
                this.addAllPlaylist();
                break;
            case UserProfile.SCREEN_FRIEND:
                this.addAllFriend();
                break;
        }
        this.addEvent();
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        ControllLoading.instance().showLoading();
        this.updateDescription();
        EventGame.instance().event.updateDescription.add(this.updateDescriptionUser, this);
    }

    updateDescription() {
        SocketController.instance().sendData(UserProfileCommand.USER_DETAIL_LOAD_REQUEST,
            SendLoadUserProfile.begin(this.user_id));
    }

    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        EventGame.instance().event.updateDescription.remove(this.updateDescriptionUser, this);
    }

    updateDescriptionUser(description) {
        this.dataProfile.user.description = description;
        console.log(this.dataProfile);
        if (this.userProfile !== null) {
            this.userProfile.setData(this.dataProfile);
        }
    }

    getData(data) {
        switch (data.cmd) {
            case UserProfileCommand.USER_DETAIL_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    this.dataProfile = GetUserDetail.begin(data.params);
                    if (this.userProfile !== null) {
                        this.userProfile.setData(this.dataProfile);
                    }
                } else {
                    this.chooseBackUser();
                }
                //
                ControllLoading.instance().hideLoading();
                break;
            case UserProfileCommand.USER_FRIEND_RESPONSE:
            case UserProfileCommand.USER_FRIEND_REQUEST:
                //this.updateDescription();
                break;

            case UserProfileCommand.USER_DETAIL_PLAYLIST_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    if (this.allPlaylist !== null) {
                        //this.allPlaylist.setPlaylist(GetDetailPlayListByUser.begin(data.params));
                        let playlists = data.params.getSFSArray("playlists");
                        let arrId = [];
                        let objLevel = {};
                        for (let i = 0; i < playlists.size(); i++) {
                            let playlist = playlists.getSFSObject(i);
                            let id = playlist.getInt("playlist_id");
                            arrId.push(id);
                            let itemLevel = new ShopUserPlayListMapping();
                            itemLevel.user_id = this.user_id;
                            itemLevel.level = playlist.getInt("level");
                            itemLevel.playlist_id = id;
                            itemLevel.exp_score = playlist.getInt("exp_score");
                            itemLevel.current_level_score = playlist.getInt("current_level_score");
                            itemLevel.next_level_score = playlist.getInt("next_level_score");
                            itemLevel.updated = playlist.getLong("updated");
                            objLevel[id] = itemLevel;


                        }

                        SqlLiteController.instance().getPlaylistById(arrId, objLevel);
                        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDataPlaylistComplete, this);
                    } else {
                        this.chooseBack();
                        ControllLoading.instance().hideLoading();
                    }
                } else {
                    this.chooseBack();
                    ControllLoading.instance().hideLoading();
                }

                break;
            case UserProfileCommand.USER_DETAIL_ACHIEVEMENT_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    if (this.allAchievement !== null) {
                        this.allAchievement.setAchievement(GetDetailAchievementByUser.begin(data.params));
                    } else {
                        this.chooseBack();
                    }
                } else {
                    this.chooseBack();
                }
                ControllLoading.instance().hideLoading();
                break;
            case UserProfileCommand.USER_FRIEND_LIST_LOAD_RESPONSE:
                if (data.params.getUtfString("status") === "OK") {
                    if (this.allFriend !== null) {
                        this.allFriend.setFriend(GetDetailFriendByUser.begin(data.params));
                    } else {
                        this.chooseBack();
                    }
                } else {
                    this.chooseBack();
                }
                ControllLoading.instance().hideLoading();
                break;
        }
    }

    getDataPlaylistComplete(data) {
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDataPlaylistComplete, this);
        this.allPlaylist.setPlaylist(data);
    }

    removeAllScreen() {
        this.removeUserProfile();
        this.removeAllPlaylist();
        this.removeAllAchievement();
        this.removeAllFriend();
    }

    addUserProfile() {
        this.removeAllScreen();
        this.userProfile = new UserProfileScreen();
        this.userProfile.event.back.add(this.chooseBackUser, this);
        this.userProfile.event.view_all_achievement.add(this.addAllAchievement, this);
        this.userProfile.event.view_all_friend.add(this.addAllFriend, this);
        this.userProfile.event.view_all_playlist.add(this.addAllPlaylist, this);
        if (this.dataProfile !== null) {
            this.userProfile.setData(this.dataProfile);
        }
        this.addChild(this.userProfile);
    }
    removeUserProfile() {
        if (this.userProfile !== null) {
            this.removeChild(this.userProfile);
            this.userProfile.destroy();
            this.userProfile = null;
        }
    }

    addAllPlaylist() {
        this.removeAllScreen();
        this.allPlaylist = new UserProfileAllPlaylist(this.user_id);
        this.allPlaylist.event.back.add(this.chooseBack, this);
        this.addChild(this.allPlaylist);
    }
    removeAllPlaylist() {
        if (this.allPlaylist !== null) {
            this.removeChild(this.allPlaylist);
            this.allPlaylist.destroy();
            this.allPlaylist = null;
        }
    }

    addAllAchievement() {
        this.removeAllScreen();
        this.allAchievement = new UserProfileAllAchievement(this.user_id);
        this.allAchievement.event.back.add(this.chooseBack, this);
        this.addChild(this.allAchievement);
    }
    removeAllAchievement() {
        if (this.allAchievement !== null) {
            this.removeChild(this.allAchievement);
            this.allAchievement.destroy();
            this.allAchievement = null;
        }
    }

    addAllFriend() {
        this.removeAllScreen();
        this.allFriend = new UserProfileAllFriend(this.user_id);
        this.allFriend.event.back.add(this.chooseBack, this);
        this.addChild(this.allFriend);
    }

    removeAllFriend() {
        if (this.allFriend !== null) {
            this.removeChild(this.allFriend);
            this.allFriend.destroy();
            this.allFriend = null;
        }
    }

    chooseBack() {
        LogConsole.log("chooseBack" + this.screenIdx);
        if (this.screenIdx > 0) {
            this.event.back.dispatch();
        } else {
            this.addUserProfile();
        }
    }

    chooseBackUser() {
        LogConsole.log("chooseBackUser");
        this.event.back.dispatch();
    }

    destroy() {
        this.removeEvent();
        this.removeAllScreen();
        super.destroy();
    }
}