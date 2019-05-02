import EventModeDatafield from "../../datafield/EventModeDatafield.js";
import UserEventModeMap from "../../data/UserEventModeMap.js";
import RankEventMode from "../../data/RankEventMode.js";

export default class GetEventModeLoadDispalyPlayer {
    static begin(data) {
        let objData = {
            arrUser: [],
            topThree: []
        }

        let display_players = data.getSFSArray(EventModeDatafield.display_players);
        for (let i = 0; i < display_players.size(); i++) {
            let display_player = display_players.getSFSObject(i);
            let user = new UserEventModeMap();

            user.question_index = display_player.getInt(EventModeDatafield.question_index);
            user.user_id = display_player.getInt(EventModeDatafield.user_id);
            user.user_name = display_player.getUtfString(EventModeDatafield.user_name);
            user.avatar = display_player.getUtfString(EventModeDatafield.avatar);
            user.is_dead = display_player.getInt(EventModeDatafield.is_dead);
            user.vip = display_player.getBool(EventModeDatafield.vip);
            // user.vip = true;

            objData.arrUser.push(user);
        }

        let top_threes = data.getSFSArray(EventModeDatafield.top_three);
        for (let i = 0; i < top_threes.size(); i++) {
            let top_three = top_threes.getSFSObject(i);
            let userRank = new RankEventMode();
            userRank.user_id = top_three.getInt(EventModeDatafield.user_id);
            userRank.user_name = top_three.getUtfString(EventModeDatafield.user_name);
            userRank.achieved = top_three.getInt(EventModeDatafield.rank);
            userRank.avatar = top_three.getUtfString(EventModeDatafield.avatar);
            userRank.vip = top_three.getBool(EventModeDatafield.vip);
            // userRank.vip = true;
            objData.topThree.push(userRank);
        }

        return objData;
    }
}