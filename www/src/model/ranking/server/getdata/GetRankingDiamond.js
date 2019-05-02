import RankingDataField from "../../datafield/RankingDataField.js";
import UserRankingDiamond from "../../data/UserRankingDiamond.js";

export default class GetRankingDiamond {
    static begin(data) {
        let objData = {
            position: -1,
            top_users: []
        }

        let top_users = data.getSFSArray(RankingDataField.top_users);
        for (let i = 0; i < top_users.size(); i++) {
            let top_user = top_users.getSFSObject(i);
            let user = new UserRankingDiamond();

            user.user_name = top_user.getUtfString(RankingDataField.user_name);
            user.created = top_user.getLong(RankingDataField.created);
            user.active = top_user.getInt(RankingDataField.active);
            user.id = top_user.getInt(RankingDataField.id);
            user.avatar = top_user.getUtfString(RankingDataField.avatar);
            user.updated = top_user.getLong(RankingDataField.updated);

            if (top_user.containsKey(RankingDataField.diamond)) {
                user.diamond = top_user.getInt(RankingDataField.diamond);
            }
            if (top_user.containsKey(RankingDataField.level)) {
                user.level = top_user.getInt(RankingDataField.level);
            }
            if (top_user.containsKey(RankingDataField.experience_score)) {
                user.experience_score = top_user.getInt(RankingDataField.experience_score);
            }
            if (top_user.containsKey(RankingDataField.vip)) {
                user.vip = top_user.getBool(RankingDataField.vip);
            }
            objData.top_users.push(user);
        }

        objData.position = data.getLong(RankingDataField.position);

        return objData;
    }


}