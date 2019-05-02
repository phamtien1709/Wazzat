import SocketController from "../../../../controller/SocketController.js";

export default class GetUserDetail {
    static begin(data) {
        let objData = {
            game_status: "",
            friend_status: "",
            number_achievement: 0,
            its_me: false,
            vip: false,
            vip_expired: 0,
            user: {
                level: 0,
                level_title: "",
                user_name: "",
                all_time_high_score: 0,
                last_login: 0,
                weekly_high_score: 0,
                description: "",
                id: 0,
                avatar: "",
                is_online: false,
                experience_score: 0
            },
            number_of_playlist: 0,
            count_friend: 0,
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

        let its_me = data.getBool("its_me");

        if (its_me === true) {
            let mySeft = SocketController.instance().dataMySeft;
            objData.user.level = mySeft.level;
            objData.user.level_title = data.getUtfString("level_title");
            objData.user.user_name = mySeft.user_name;
            objData.user.all_time_high_score = mySeft.all_time_high_score;
            objData.user.weekly_high_score = mySeft.weekly_high_score;
            objData.user.description = mySeft.description;
            objData.user.id = mySeft.user_id;
            objData.user.avatar = mySeft.avatar;
            objData.user.experience_score = mySeft.experience_score;
            objData.user.vip = mySeft.vip;
            objData.user.vip_expired = mySeft.vip_expired;

            let current_level = data.getSFSObject("current_level");
            objData.current_level.level = current_level.getInt("level");
            objData.current_level.id = current_level.getInt("id");
            objData.current_level.experience_score = current_level.getInt("experience_score");

            let next_level = data.getSFSObject("next_level");
            objData.next_level.level = next_level.getInt("level");
            objData.next_level.id = next_level.getInt("id");
            objData.next_level.experience_score = next_level.getInt("experience_score");
        } else {
            objData.game_status = data.getUtfString("game_status");
            objData.friend_status = data.getUtfString("friend_status");

            let user = data.getSFSObject("user");

            objData.user.level = user.getInt("level");
            objData.user.level_title = user.getUtfString("level_title");
            objData.user.user_name = user.getUtfString("user_name");
            objData.user.all_time_high_score = user.getInt("all_time_high_score");
            objData.user.last_login = user.getLong("last_login");
            objData.user.weekly_high_score = user.getInt("weekly_high_score");
            objData.user.description = user.getUtfString("description");
            objData.user.id = user.getInt("id");
            objData.user.avatar = user.getUtfString("avatar");
            objData.user.is_online = user.getBool("is_online");
            objData.user.experience_score = user.getInt("experience_score");
            objData.user.vip = user.getBool("vip");
        }

        objData.number_achievement = data.getInt("number_achievement");
        objData.number_of_playlist = data.getInt("number_of_playlist");
        objData.count_friend = data.getInt("count_friend");

        return objData;
    }
}