import BaseView from "../../BaseView.js";
import UserProfileUser from "../item/UserProfileUser.js";

import UserProfilePlaylistItem from "../item/UserProfilePlaylistItem.js";
import UserProfileAchievement from "../item/UserProfileAchievement.js";
import UserProfileFriends from "../item/UserProfileFriends.js";
import UserProfileMaxScore from "../item/UserProfileMaxScore.js";
import ListView from "../../../../libs/listview/list_view.js";
import IronSource from "../../../IronSource.js";


export default class UserProfileScreen extends BaseView {
    constructor() {
        super(game, null);
        this.dataProfile = null;
        this.event = {
            view_all_playlist: new Phaser.Signal(),
            view_all_friend: new Phaser.Signal(),
            view_all_achievement: new Phaser.Signal(),
            back: new Phaser.Signal()
        }
        this.list = null;
        this.userProfile = null;

        this.bg = new Phaser.Button(game, 0, 0, "bg_create_room");
        this.addChild(this.bg);
        IronSource.instance().showBanerUserProfileScreen();
    }

    setData(dataProfile) {
        if (this.list !== null) {
            this.list.removeAll();
            this.list.destroy();
            this.list = null;
        }
        this.dataProfile = dataProfile;
        if (this.userProfile !== null) {
            this.removeChild(this.userProfile);
            this.userProfile.destroy();
            this.userProfile = null;
        }

        this.userProfile = new UserProfileUser();
        this.userProfile.event.friend_status_update.add(this.friend_status_update, this);
        this.userProfile.event.back.add(this.chooseBack, this);
        this.addChild(this.userProfile);
        this.userProfile.setData(this.dataProfile.user, this.dataProfile.game_status, this.dataProfile.friend_status, this.dataProfile.current_level, this.dataProfile.next_level);
        //
        let parent = new Phaser.Group(game, 0, 0, null);
        this.list = new ListView(game, parent, new Phaser.Rectangle(0, this.userProfile.height + 20, game.width, (game.height - this.userProfile.height) * window.GameConfig.RESIZE), {
            direction: 'y',
            padding: 0,
            searchForClicks: true
        });
        this.addChild(parent);


        //

        this.playList = new UserProfilePlaylistItem();
        this.playList.event.view_all.add(this.viewAllPlaylist, this);
        this.playList.setData(this.dataProfile.number_of_playlist);
        this.list.add(this.playList);

        this.achievement = new UserProfileAchievement();
        this.achievement.event.view_all.add(this.viewAllAchievement, this);
        this.achievement.setData(this.dataProfile.number_achievement);
        this.list.add(this.achievement);

        this.friends = new UserProfileFriends();
        this.friends.event.view_all.add(this.viewAllFriend, this);
        this.friends.setData(this.dataProfile.count_friend);
        this.list.add(this.friends);

        this.maxScore = new UserProfileMaxScore();
        this.maxScore.setData(this.dataProfile.user.weekly_high_score, this.dataProfile.user.all_time_high_score);
        this.list.add(this.maxScore);
    }

    friend_status_update(friend_status) {
        this.dataProfile.friend_status = friend_status;
        this.setData(this.dataProfile);
    }

    chooseBack() {
        this.event.back.dispatch();
    }

    destroy() {
        if (this.list !== null) {
            this.list.removeAll();
            this.list.destroy();
        }
        IronSource.instance().hideBanner();
        super.destroy();
    }

    viewAllPlaylist() {
        this.event.view_all_playlist.dispatch();
    }
    viewAllAchievement() {
        this.event.view_all_achievement.dispatch();
    }
    viewAllFriend() {
        this.event.view_all_friend.dispatch();
    }
}