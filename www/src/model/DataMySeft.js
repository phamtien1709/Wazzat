import SocketController from "../controller/SocketController.js";

export default class DataMySeft {
    constructor() {
        this.user_id = 0;
        this.user_name = "";
        this.avatar = "";
        this.gender = "";
        this.experience_score = 0;
        this.heart = 0;
        this.diamond = 0;
        this.ticket = 0;
        this.weekly_high_score = 0;
        this.all_time_high_score = 0;
        this.online_mode_genre = 0;
        this.level = 1;
        this.vip = 0;
        this.is_playing_game = false;
        this.support_item = 0;
        this.lag_value = 0;
        this.current_level_score = 0;
        this.next_level_score = 0;
        this.description = "";
        this.level_title = "";
        this.vip_expired = 0;
    }

    setUserName(_namechange) {
        this.user_name = _namechange;
        SocketController.instance().events.onUserVarsUpdate.dispatch();
    }

    setGender(_gender) {
        this.gender = _gender;
        SocketController.instance().events.onUserVarsUpdate.dispatch();
    }
    setDescription(_description) {
        this.description = _description;
        SocketController.instance().events.onUserVarsUpdate.dispatch();
    }

    setAvatar(_avatar) {
        this.avatar = _avatar;
        SocketController.instance().events.onUserVarsUpdate.dispatch();
    }
}