import Achievement from "./Field/Achievement.js";

export default class AchievedNotification {
    static handle(data) {
        let objData = {
            reward: 0,
            reward_type: "",
            // condition: 0,
            // achievement_type_id: 0,
            // is_done: false,
            medal: "",
            // achieved: 0,
            // id: 0,
            title: "",
            // required: 0,
            new_level: 0
        }
        if (data.containsKey(Achievement.achievement)) {
            let achievement = data.getSFSObject(Achievement.achievement);
            objData.reward = achievement.getInt(Achievement.reward);
            // objData.condition = achievement.getUtfString(Achievement.condition);
            // objData.achievement_type_id = achievement.getInt(Achievement.achievement_type_id);
            // objData.is_done = achievement.getBool(Achievement.is_done);
            objData.reward_type = achievement.getUtfString(Achievement.reward_type);
            objData.medal = achievement.getUtfString(Achievement.medal);
            // objData.achieved = achievement.getInt(Achievement.achieved);
            // objData.id = achievement.getInt(Achievement.id);
            objData.title = achievement.getUtfString(Achievement.title);
            // objData.required = achievement.getInt(Achievement.required);
            objData.new_level = achievement.getInt(Achievement.new_level);
        }
        return objData;
    }
}