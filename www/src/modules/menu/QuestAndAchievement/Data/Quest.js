export default class Quest {
    constructor() {
        this.reward = 0;
        this.id = 0;
        this.quest = "";
        this.required = 0;
        this.quest_type = 0;
        this.order = 0;
        this.reward_type = "";
    }
    static get get_quest() {
        return "quest"
    }
    static get get_reward() {
        return "reward"
    }
    static get get_id() {
        return "id"
    }
    static get get_quest() {
        return "quest"
    }
    static get get_required() {
        return "required"
    }
    static get get_quest_type() {
        return "quest_type"
    }
    static get get_order() {
        return "order"
    }
    static get get_reward_type() {
        return "reward_type"
    }
}