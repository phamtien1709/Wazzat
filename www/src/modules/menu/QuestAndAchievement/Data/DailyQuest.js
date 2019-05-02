export default class DailyQuest {
    constructor() {
        this.reward = 0;
        this.reward_type = "";
        this.achieved = 0;
        this.id = 0;
        this.quest = "";
        this.required = 0;
        this.quest_type = 0;
    }
    static get get_daily_quest() {
        return "daily_quest";
    }
}