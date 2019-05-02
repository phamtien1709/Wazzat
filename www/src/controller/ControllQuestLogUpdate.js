export default class ControllQuestLogUpdate {
    constructor() {
        this.quest_log = null;
    }

    static instance() {
        if (this.controllQuestLogUpdate) {

        } else {
            this.controllQuestLogUpdate = new ControllQuestLogUpdate();
        }

        return this.controllQuestLogUpdate;
    }

    getUpdate(params) {
        let questLog = {};
        if (params.containsKey("quest_log")) {
            let quest_log = params.getSFSObject("quest_log");
            questLog.user_id = quest_log.getInt("user_id");
            questLog.created = quest_log.getLong("created");
            questLog.quest_id = quest_log.getInt("quest_id");
            questLog.id = quest_log.getLong("id");
            questLog.state = quest_log.getUtfString("state");
            questLog.updated = quest_log.getLong("updated");
        }
        return questLog;
    }
}