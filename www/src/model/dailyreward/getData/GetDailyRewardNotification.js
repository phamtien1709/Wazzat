import DailyRewardSettingField from "../dataField/DailyRewardSettingField.js";
import DailyRewardSetting from "../data/DailyRewardSetting.js";
import DailyRewardLogField from "../dataField/DailyRewardLogField.js";
import DailyRewardLog from "../data/DailyRewardLog.js";

export default class GetDailyRewardNotification {
    static begin(data, callback) {
        var daily_reward_settings = data.getSFSArray(DailyRewardSettingField.daily_reward_settings);
        var dailyRewardSettings = [];
        for (let i = 0; i < daily_reward_settings.size(); i++) {
            let daily_reward_setting = daily_reward_settings.getSFSObject(i);
            let dailyRewardSetting = new DailyRewardSetting();
            dailyRewardSetting.reward = daily_reward_setting.getInt(DailyRewardSettingField.reward);
            dailyRewardSetting.reward_type = daily_reward_setting.getUtfString(DailyRewardSettingField.reward_type);
            dailyRewardSetting.id = daily_reward_setting.getInt(DailyRewardSettingField.id);
            dailyRewardSetting.day = daily_reward_setting.getInt(DailyRewardSettingField.day);
            dailyRewardSettings.push(dailyRewardSetting);
        }
        let daily_reward_log = data.getSFSObject(DailyRewardLogField.daily_reward_log);
        let dailyRewardLog = new DailyRewardLog();
        dailyRewardLog.user_id = daily_reward_log.getInt(DailyRewardLogField.user_id);
        dailyRewardLog.created = daily_reward_log.getLong(DailyRewardLogField.created);
        dailyRewardLog.state = daily_reward_log.getUtfString(DailyRewardLogField.state);
        dailyRewardLog.day = daily_reward_log.getInt(DailyRewardLogField.day);
        dailyRewardLog.updated = daily_reward_log.getLong(DailyRewardLogField.updated);
        callback(dailyRewardSettings, dailyRewardLog);
    }
}