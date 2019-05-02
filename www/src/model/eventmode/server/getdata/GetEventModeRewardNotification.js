import EventModeDatafield from "../../datafield/EventModeDatafield.js";

export default class GetEventModeRewardNotification {
    static begin(data) {
        let obj = {
            event_top_rank_log: {},
            event: {},
            event_reward: {}
        }

        if (data.containsKey(EventModeDatafield.event_top_rank_log)) {
            let event_top_rank_log = data.getSFSObject(EventModeDatafield.event_top_rank_log);
            obj.event_top_rank_log.event_id = event_top_rank_log.getLong(EventModeDatafield.event_id);
            obj.event_top_rank_log.top = event_top_rank_log.getInt(EventModeDatafield.top);
            obj.event_top_rank_log.user_id = event_top_rank_log.getInt(EventModeDatafield.user_id);
            obj.event_top_rank_log.created = event_top_rank_log.getLong(EventModeDatafield.created);
            obj.event_top_rank_log.achieved = event_top_rank_log.getInt(EventModeDatafield.achieved);
            obj.event_top_rank_log.id = event_top_rank_log.getLong(EventModeDatafield.id);
            obj.event_top_rank_log.state = event_top_rank_log.getUtfString(EventModeDatafield.state);
            obj.event_top_rank_log.updated = event_top_rank_log.getLong(EventModeDatafield.updated);

        }
        if (data.containsKey(EventModeDatafield.event)) {
            let event = data.getSFSObject(EventModeDatafield.event);
            obj.event.finish_at = event.getLong(EventModeDatafield.finish_at);
            obj.event.created = event.getLong(EventModeDatafield.created);
            obj.event.description = event.getUtfString(EventModeDatafield.description);
            obj.event.banner = event.getUtfString(EventModeDatafield.banner);
            obj.event.active = event.getInt(EventModeDatafield.active);
            obj.event.start_at = event.getLong(EventModeDatafield.start_at);
            obj.event.event_type = event.getUtfString(EventModeDatafield.event_type);
            obj.event.name = event.getUtfString(EventModeDatafield.name);
            obj.event.medal = event.getUtfString(EventModeDatafield.medal);
            obj.event.id = event.getLong(EventModeDatafield.id);
            obj.event.state = event.getUtfString(EventModeDatafield.state);
            obj.event.updated = event.getLong(EventModeDatafield.updated);
        }
        if (data.containsKey(EventModeDatafield.event_reward)) {
            let event_reward = data.getSFSObject(EventModeDatafield.event_reward);
            obj.event_reward.diamond = event_reward.getInt(EventModeDatafield.diamond);
            obj.event_reward.event_id = event_reward.getLong(EventModeDatafield.event_id);
            obj.event_reward.ticket = event_reward.getInt(EventModeDatafield.ticket);
            obj.event_reward.event_ranking = event_reward.getUtfString(EventModeDatafield.event_ranking);
            obj.event_reward.updated = event_reward.getLong(EventModeDatafield.updated);
            obj.event_reward.support_item = event_reward.getInt(EventModeDatafield.support_item);
        }

        return obj;
    }
}