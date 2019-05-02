import EventModeDatafield from "../../datafield/EventModeDatafield.js";
import RoomEvent from "../../data/RoomEvent.js";
import EventModeRoomItem from "../../../../view/eventmode/item/selectroom/EventModeRoomItem.js";

export default class GetEventModeLoadList {
    static begin(data) {

        let obj = {
            isStart: [],
            isWaitting: [],
            isEnd: []
        };

        let isWaitting = [];
        let isStart = [];
        let isEnd = [];

        let events = data.getSFSArray(EventModeDatafield.events);
        for (let i = 0; i < events.size(); i++) {
            let event = events.getSFSObject(i);
            let item = new RoomEvent();
            item.finish_at = event.getLong(EventModeDatafield.finish_at);
            item.created = event.getLong(EventModeDatafield.created);
            item.description = event.getUtfString(EventModeDatafield.description);
            item.banner = event.getUtfString(EventModeDatafield.banner);
            item.active = event.getInt(EventModeDatafield.active);
            item.start_at = event.getLong(EventModeDatafield.start_at);
            item.event_type = event.getUtfString(EventModeDatafield.event_type);
            item.name = event.getUtfString(EventModeDatafield.name);
            item.medal = event.getUtfString(EventModeDatafield.medal);
            item.id = event.getLong(EventModeDatafield.id);
            item.state = event.getUtfString(EventModeDatafield.state);
            item.updated = event.getLong(EventModeDatafield.updated);
            if (event.containsKey(EventModeDatafield.number_user)) {
                item.number_user = event.getInt(EventModeDatafield.number_user);
            }

            if (event.containsKey(EventModeDatafield.reward_1st)) {
                let reward_1st = event.getSFSObject(EventModeDatafield.reward_1st);
                item.reward_1st.diamond = reward_1st.getInt(EventModeDatafield.diamond);
                item.reward_1st.event_id = reward_1st.getLong(EventModeDatafield.event_id);
                item.reward_1st.ticket = reward_1st.getInt(EventModeDatafield.ticket);
                item.reward_1st.created = reward_1st.getLong(EventModeDatafield.created);
                item.reward_1st.event_ranking = reward_1st.getUtfString(EventModeDatafield.event_ranking);
                item.reward_1st.updated = reward_1st.getLong(EventModeDatafield.updated);
                item.reward_1st.support_item = reward_1st.getInt(EventModeDatafield.support_item);
            }

            if (item.state === EventModeRoomItem.STATE_COMING) {
                isWaitting.push(item);
            } else if (item.state === EventModeRoomItem.STATE_STARTED) {
                isStart.push(item);
            } else {
                isEnd.push(item);
            }
        }

        obj.isWaitting = isWaitting.sort(GetEventModeLoadList.sortByTime);
        obj.isStart = isStart.sort(GetEventModeLoadList.sortByTime);
        obj.isEnd = isEnd.sort(GetEventModeLoadList.sortByTimeEnd);
        return obj;
    }

    static sortByTimeEnd(a, b) {
        if (a.finish_at < b.finish_at) {
            return 1;
        } else if (a.finish_at > b.finish_at) {
            return -1;
        } else {
            return 0;
        }
    }
    static sortByTime(a, b) {
        if (a.start_at < b.start_at) {
            return -1;
        } else if (a.start_at > b.start_at) {
            return 1;
        } else {
            return 0;
        }
    }
}