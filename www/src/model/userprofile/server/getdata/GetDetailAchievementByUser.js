import Achievement from "../../data/Achievement.js";
import UserProfileDataField from "../../datafield/UserProfileDataField.js";

export default class GetDetailAchievementByUser {
    static begin(data) {
        let arrData = [];
        let achievements = data.getSFSArray(UserProfileDataField.achievements);
        for (let i = 0; i < achievements.size(); i++) {
            let achievement = achievements.getSFSObject(i);
            let itemAchi = new Achievement();
            //itemAchi.reward = achievement.getInt(UserProfileDataField.reward);
            //itemAchi.condition = achievement.getUtfString(UserProfileDataField.condition);
            //itemAchi.achievement_type_id = achievement.getInt(UserProfileDataField.achievement_type_id);
            // itemAchi.is_done = achievement.getBool(UserProfileDataField.is_done);
            //itemAchi.reward_type = achievement.getUtfString(UserProfileDataField.reward_type);
            itemAchi.medal = achievement.getUtfString(UserProfileDataField.medal);
            // itemAchi.achieved = achievement.getInt(UserProfileDataField.achieved);
            //itemAchi.id = achievement.getInt(UserProfileDataField.id);
            itemAchi.title = achievement.getUtfString(UserProfileDataField.title);
            //itemAchi.required = achievement.getInt(UserProfileDataField.required);
            itemAchi.current_level = achievement.getInt("current_level");

            arrData.push(itemAchi);
        }

        return arrData;
    }
}