import User from "../../../model/userprofile/data/User.js";
import UserProfileDataField from "../../../model/userprofile/datafield/UserProfileDataField.js";
import GetPlayListDetail from "../../../model/shop/server/getdata/GetPlayListDetail.js";

export default class GetShortUserProfile {
    static begin(data) {
        let objData = {
            user: new User(),
            playlists: []
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

        //
        return objData;
    }
}