import RankingDataField from "../../datafield/RankingDataField.js";
import UserRankingOnlineMode from "../../data/UserRankingOnlineMode.js";

export default class GetRankingOnlineMode {
    static begin(data) {
        let objData = {
            position: {
                rank: -1,
                count_win: 0,
                playlist_number: 0
            },
            top_users: []
        }

        let top_users = data.getSFSArray(RankingDataField.top_users);
        for (let i = 0; i < top_users.size(); i++) {
            let top_user = top_users.getSFSObject(i);
            let user = new UserRankingOnlineMode();

            user.gender = top_user.getUtfString(RankingDataField.gender);
            user.level = top_user.getInt(RankingDataField.level);
            user.user_name = top_user.getUtfString(RankingDataField.user_name);
            user.all_time_high_score = top_user.getInt(RankingDataField.all_time_high_score);
            user.last_login = top_user.getLong(RankingDataField.last_login);
            user.weekly_high_score = top_user.getInt(RankingDataField.weekly_high_score);
            user.id = top_user.getInt(RankingDataField.id)
            user.avatar = top_user.getUtfString(RankingDataField.avatar);
            user.count_win = top_user.getLong(RankingDataField.count_win);
            user.vip = top_user.getBool(RankingDataField.vip);
            // user.vip = true;

            if (top_user.containsKey(RankingDataField.playlist_number)) {
                user.playlist_number = top_user.getLong(RankingDataField.playlist_number);
            }

            objData.top_users.push(user);
        }

        //objData.top_users = objData.top_users.sort(GetRankingOnlineMode.compareCountWin);
        if (data.containsKey(RankingDataField.position)) {
            let position = data.getSFSObject(RankingDataField.position);

            if (position.containsKey(RankingDataField.rank)) {
                objData.position.rank = position.getInt(RankingDataField.rank);
                if (position.containsKey(RankingDataField.playlist_number)) {
                    objData.position.playlist_number = position.getLong(RankingDataField.playlist_number);
                } else {
                    objData.position.count_win = position.getLong(RankingDataField.count_win);
                }
            }
        }

        return objData;
    }

    static compareCountWin(a, b) {
        if (a.count_win > b.count_win) {
            return -1;
        } else if (a.count_win < b.count_win) {
            return 1;
        }

        return 0;
    }
}