import UserProfileDataField from "../../datafield/UserProfileDataField.js";
import Achievement from "../../data/Achievement.js";
import User from "../../data/User.js";
import GetPlayListDetail from "../../../shop/server/getdata/GetPlayListDetail.js";
import Buddy from "../../../onlinemodecreatroom/data/Buddy.js";

export default class GetUserProfile {
    static begin(data) {

        let objData = {
            achievements: [],
            playlists: [],
            user: new User(),
            friends: [],
            game_status: "",
            friend_status: "",
            next_level: {
                level: 0,
                id: 0,
                experience_score: 0
            },
            current_level: {
                level: 0,
                id: 0,
                experience_score: 0
            }
        }

        if (data.containsKey(UserProfileDataField.game_status)) {
            objData.game_status = data.getUtfString(UserProfileDataField.game_status);
        }
        if (data.containsKey(UserProfileDataField.friend_status)) {
            objData.friend_status = data.getUtfString(UserProfileDataField.friend_status);
        }
        if (data.containsKey(UserProfileDataField.next_level)) {
            let next_level = data.getSFSObject(UserProfileDataField.next_level);
            objData.next_level.level = next_level.getInt(UserProfileDataField.level);
            objData.next_level.id = next_level.getInt(UserProfileDataField.id);
            objData.next_level.experience_score = next_level.getInt(UserProfileDataField.experience_score);
        }
        if (data.containsKey(UserProfileDataField.current_level)) {
            let current_level = data.getSFSObject(UserProfileDataField.current_level);
            objData.current_level.level = current_level.getInt(UserProfileDataField.level);
            objData.current_level.id = current_level.getInt(UserProfileDataField.id);
            objData.current_level.experience_score = current_level.getInt(UserProfileDataField.experience_score);

        }

        let achievements = data.getSFSArray(UserProfileDataField.achievements);
        for (let i = 0; i < achievements.size(); i++) {
            let achievement = achievements.getSFSObject(i);
            let itemAchi = new Achievement();
            itemAchi.reward = achievement.getInt(UserProfileDataField.reward);
            itemAchi.condition = achievement.getUtfString(UserProfileDataField.condition);
            itemAchi.achievement_type_id = achievement.getInt(UserProfileDataField.achievement_type_id);
            itemAchi.is_done = achievement.getBool(UserProfileDataField.is_done);
            itemAchi.reward_type = achievement.getUtfString(UserProfileDataField.reward_type);
            itemAchi.medal = achievement.getUtfString(UserProfileDataField.medal);
            itemAchi.achieved = achievement.getInt(UserProfileDataField.achieved);
            itemAchi.id = achievement.getInt(UserProfileDataField.id);
            itemAchi.title = achievement.getUtfString(UserProfileDataField.title);
            itemAchi.required = achievement.getInt(UserProfileDataField.required);

            objData.achievements.push(itemAchi);
        }

        let playlists = data.getSFSArray(UserProfileDataField.playlists);
        for (let i = 0; i < playlists.size(); i++) {
            let playlist = playlists.getSFSObject(i)
            let itemPlayList = GetPlayListDetail.getPlayList(playlist);

            if (playlist.containsKey(UserProfileDataField.user_playlist_mapping)) {
                let objUser = playlist.getSFSObject(UserProfileDataField.user_playlist_mapping);
                if (objUser) {
                    itemPlayList.user = GetPlayListDetail.getUserPlayList(objUser);
                }
            }

            objData.playlists.push(itemPlayList);
        }

        objData.playlists = objData.playlists.sort(GetUserProfile.sortScorePlayList);

        let user = data.getSFSObject(UserProfileDataField.user);
        objData.user.login_id = user.getUtfString(UserProfileDataField.login_id);
        objData.user.gender = user.getUtfString(UserProfileDataField.gender);
        objData.user.ticket = user.getInt(UserProfileDataField.ticket);
        objData.user.login_type = user.getUtfString(UserProfileDataField.login_type);
        objData.user.level = user.getInt(UserProfileDataField.level);
        objData.user.user_name = user.getUtfString(UserProfileDataField.user_name);
        objData.user.all_time_high_score = user.getInt(UserProfileDataField.all_time_high_score);
        objData.user.last_login = user.getLong(UserProfileDataField.last_login);
        objData.user.created = user.getLong(UserProfileDataField.created);
        objData.user.heart_updated = user.getLong(UserProfileDataField.heart_updated);
        objData.user.active = user.getInt(UserProfileDataField.active);
        objData.user.avatar = user.getUtfString(UserProfileDataField.avatar);
        objData.user.experience_score = user.getInt(UserProfileDataField.experience_score);
        objData.user.heart = user.getInt(UserProfileDataField.heart);
        objData.user.support_item = user.getInt(UserProfileDataField.support_item);
        objData.user.diamond = user.getInt(UserProfileDataField.diamond);
        objData.user.weekly_high_score = user.getInt(UserProfileDataField.weekly_high_score);
        objData.user.id = user.getInt(UserProfileDataField.id);
        objData.user.is_online = user.getBool(UserProfileDataField.is_online);
        objData.user.email = user.getUtfString(UserProfileDataField.email);
        objData.user.count_login = user.getInt(UserProfileDataField.count_login);
        objData.user.level_title = user.getUtfString(UserProfileDataField.level_title);
        if (user.containsKey(UserProfileDataField.description)) {
            objData.user.description = user.getUtfString(UserProfileDataField.description);
        }
        if (user.containsKey(UserProfileDataField.vip)) {
            objData.user.vip = user.getBool(UserProfileDataField.vip);
        }
        if (user.containsKey(UserProfileDataField.support_item)) {
            objData.user.support_item = user.getInt(UserProfileDataField.support_item);
        }

        let friends = data.getSFSArray(UserProfileDataField.friends);
        for (let i = 0; i < friends.size(); i++) {
            let friend = friends.getSFSObject(i);
            let itemFriend = new Buddy();
            itemFriend.avatar = friend.getUtfString(UserProfileDataField.avatar);
            itemFriend.isOnline = friend.getBool(UserProfileDataField.is_online);
            itemFriend.userId = friend.getInt(UserProfileDataField.id);
            itemFriend.userName = friend.getUtfString(UserProfileDataField.user_name);
            objData.friends.push(itemFriend);
        }

        objData.friends = objData.friends.sort(GetUserProfile.sortOnline);

        console.log(objData);

        return objData;
    }

    static sortScorePlayList(a, b) {
        if (a.user.exp_score > b.user.exp_score) {
            return -1;
        } else {
            return 1;
        }
    }

    static sortOnline(a, b) {
        if (a.is_online === true || b.is_online === true) {
            return 0;
        } if (a.is_online === false || b.is_online === true) {
            return -1;
        } else {
            return 1;
        }
    }
}