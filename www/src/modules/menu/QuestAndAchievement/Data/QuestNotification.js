import Quest from "./Quest.js";

export default class QuestNotification {
    static handle(data) {
        let quest = new Quest();
        if (data.containsKey(Quest.get_quest)) {
            let questRes = data.getSFSObject('quest');
            quest.reward = questRes.getInt('reward');
            quest.id = questRes.getInt('id');
            quest.quest = questRes.getUtfString('quest');
            quest.required = questRes.getInt('required');
            quest.quest_type = questRes.getInt('quest_type');
            quest.order = questRes.getInt('order');
            quest.reward_type = questRes.getUtfString('reward_type');
        }
        return quest;
    }
}