import DailyQuest from "./DailyQuest.js";

export default class DailyQuestNotification {
    static handle(data) {
        let quest = new DailyQuest();
        if (data.containsKey(DailyQuest.get_daily_quest)) {
            let questRes = data.getSFSObject('daily_quest');
            quest.reward = questRes.getInt('reward');
            quest.reward_type = questRes.getUtfString('reward_type');
            quest.id = questRes.getInt('id');
            quest.quest = questRes.getUtfString('quest');
            quest.required = questRes.getInt('required');
            quest.quest_type = questRes.getInt('quest_type');
        }
        return quest;
    }
}