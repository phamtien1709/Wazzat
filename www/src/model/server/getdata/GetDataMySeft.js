import DataMySeft from "../../DataMySeft.js";
import DataField from "../../DataField.js";

export default class GetDataMySeft {
    static begin(mySelf) {
        let dataMySeft = new DataMySeft();
        dataMySeft.user_id = mySelf.getVariable(DataField.user_id).value;
        dataMySeft.user_name = mySelf.getVariable(DataField.user_name).value;
        if (mySelf.getVariable(DataField.avatar)) {
            dataMySeft.avatar = mySelf.getVariable(DataField.avatar).value;
        }
        if (mySelf.getVariable(DataField.gender)) {
            dataMySeft.gender = mySelf.getVariable(DataField.gender).value;
        }
        if (mySelf.getVariable(DataField.experience_score)) {
            dataMySeft.experience_score = mySelf.getVariable(DataField.experience_score).value;
        }
        if (mySelf.getVariable(DataField.heart)) {
            dataMySeft.heart = mySelf.getVariable(DataField.heart).value;
        }
        if (mySelf.getVariable(DataField.diamond)) {
            dataMySeft.diamond = mySelf.getVariable(DataField.diamond).value;
        }
        if (mySelf.getVariable(DataField.ticket)) {
            dataMySeft.ticket = mySelf.getVariable(DataField.ticket).value;
        }
        if (mySelf.getVariable(DataField.weekly_high_score)) {
            dataMySeft.weekly_high_score = mySelf.getVariable(DataField.weekly_high_score).value;
        }
        if (mySelf.getVariable(DataField.all_time_high_score)) {
            dataMySeft.all_time_high_score = mySelf.getVariable(DataField.all_time_high_score).value;
        }
        if (mySelf.getVariable(DataField.online_mode_genre)) {
            dataMySeft.online_mode_genre = mySelf.getVariable(DataField.online_mode_genre).value;
        }
        if (mySelf.getVariable(DataField.level)) {
            dataMySeft.level = mySelf.getVariable(DataField.level).value;
        }
        if (mySelf.getVariable(DataField.is_playing_game)) {
            dataMySeft.is_playing_game = mySelf.getVariable(DataField.is_playing_game).value;
        }
        if (mySelf.getVariable(DataField.support_item)) {
            dataMySeft.support_item = mySelf.getVariable(DataField.support_item).value;
        }
        if (mySelf.getVariable(DataField.lag_value)) {
            dataMySeft.lag_value = mySelf.getVariable(DataField.lag_value).value;
        }
        if (mySelf.getVariable(DataField.description)) {
            dataMySeft.description = mySelf.getVariable(DataField.description).value;
        }
        if (mySelf.getVariable(DataField.level_title)) {
            dataMySeft.level_title = mySelf.getVariable(DataField.level_title).value;
        }
        if (mySelf.getVariable(DataField.vip_expired)) {
            dataMySeft.vip_expired = mySelf.getVariable(DataField.vip_expired).value;
            let now = Date.now();
            if (now < dataMySeft.vip_expired) {
                dataMySeft.vip = true;
            } else {
                dataMySeft.vip = false;
            }
        }
        return dataMySeft;
    }
}