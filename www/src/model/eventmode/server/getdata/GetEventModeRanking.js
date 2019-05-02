import EventModeDatafield from "../../datafield/EventModeDatafield.js";
import RankEventMode from "../../data/RankEventMode.js";
import RewardEventMode from "../../data/RewardEventMode.js";

export default class GetEventModeRanking {
    static begin(data) {
        let objData = {
            arrRanking: [],
            rankMe: new RankEventMode(),
            arrReward: []
        }

        if (data.containsKey(EventModeDatafield.event_ranking)) {
            let event_rankings = data.getSFSArray(EventModeDatafield.event_ranking);
            for (let i = 0; i < event_rankings.size(); i++) {
                let event_ranking = event_rankings.getSFSObject(i);
                let userRank = new RankEventMode();
                userRank.event_id = event_ranking.getLong(EventModeDatafield.event_id);
                userRank.user_id = event_ranking.getInt(EventModeDatafield.user_id);
                userRank.created = event_ranking.getLong(EventModeDatafield.created);
                userRank.user_name = event_ranking.getUtfString(EventModeDatafield.user_name);
                userRank.position = event_ranking.getInt(EventModeDatafield.position);
                userRank.achieved = event_ranking.getInt(EventModeDatafield.achieved);
                userRank.id = event_ranking.getLong(EventModeDatafield.id);
                userRank.avatar = event_ranking.getUtfString(EventModeDatafield.avatar);
                userRank.updated = event_ranking.getLong(EventModeDatafield.updated);
                userRank.vip = event_ranking.getBool(EventModeDatafield.vip);
                objData.arrRanking.push(userRank);
            }
        }

        if (data.containsKey(EventModeDatafield.your_rank)) {
            let your_rank = data.getSFSObject(EventModeDatafield.your_rank);
            objData.rankMe.event_id = your_rank.getLong(EventModeDatafield.event_id);
            objData.rankMe.user_id = your_rank.getInt(EventModeDatafield.user_id);
            objData.rankMe.created = your_rank.getLong(EventModeDatafield.created);
            objData.rankMe.user_name = your_rank.getUtfString(EventModeDatafield.user_name);
            objData.rankMe.position = your_rank.getInt(EventModeDatafield.position);
            objData.rankMe.achieved = your_rank.getInt(EventModeDatafield.achieved);
            objData.rankMe.id = your_rank.getLong(EventModeDatafield.id);
            objData.rankMe.avatar = your_rank.getUtfString(EventModeDatafield.avatar);
            objData.rankMe.updated = your_rank.getLong(EventModeDatafield.updated);
            objData.rankMe.vip = your_rank.getBool(EventModeDatafield.vip);
        }

        if (data.containsKey(EventModeDatafield.event_reward)) {
            let event_rewards = data.getSFSArray(EventModeDatafield.event_reward);
            for (let i = 0; i < event_rewards.size(); i++) {
                let event_reward = event_rewards.getSFSObject(i);
                let reward = new RewardEventMode();
                reward.diamond = event_reward.getInt(EventModeDatafield.diamond);
                reward.event_id = event_reward.getLong(EventModeDatafield.event_id);
                reward.ticket = event_reward.getInt(EventModeDatafield.ticket);
                reward.created = event_reward.getLong(EventModeDatafield.created);
                reward.event_ranking = event_reward.getUtfString(EventModeDatafield.event_ranking);
                reward.updated = event_reward.getLong(EventModeDatafield.updated);
                reward.support_item = event_reward.getInt(EventModeDatafield.support_item);

                objData.arrReward.push(reward);
            }
        }


        return objData;
    }

}