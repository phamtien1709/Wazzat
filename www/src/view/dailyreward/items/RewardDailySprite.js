import SpriteBase from "../../component/SpriteBase.js";
import Language from "../../../model/Language.js";

export default class RewardDailySprite extends Phaser.Sprite {
    constructor(x, y, configs, state) {
        super(game, x, y, null);
        this.dailyRewardConfig = JSON.parse(game.cache.getText('dailyRewardConfig'));
        this.configs = configs;
        this.state = state;
        this.afterInit();
    }

    static get DIAMOND() {
        return "DIAMOND";
    }
    static get SUPPORT_ITEM() {
        return "SUPPORT_ITEM";
    }
    static get TICKET() {
        return "TICKET";
    }

    static get INIT() {
        return "INIT";
    }
    static get NOT_INIT() {
        return "NOT_INIT";
    }
    static get REWARDED() {
        return "REWARDED";
    }

    afterInit() {
        this.box;
        this.resourceSprite;
        this.rewardTxt;
        this.day;
        LogConsole.log(this.configs);
        this.addBox();
        this.addResourceSprite();
        this.addRewardTxt();
        this.addDay();
    }

    addBox() {
        LogConsole.log("addBox");
        if (this.state == RewardDailySprite.INIT) {
            this.box = new SpriteBase(this.dailyRewardConfig.daily_reward.box_init);
            this.addChild(this.box);
        } else {
            this.box = new SpriteBase(this.dailyRewardConfig.daily_reward.box);
            this.addChild(this.box);
        }
    }

    addResourceSprite() {
        LogConsole.log("addResourceSprite");
        if (this.configs.reward_type == RewardDailySprite.DIAMOND) {
            this.resourceSprite = new SpriteBase(this.dailyRewardConfig.daily_reward.resource.diamond);
            this.resourceSprite.anchor.set(0.5);
            this.addChild(this.resourceSprite);
        } else if (this.configs.reward_type == RewardDailySprite.SUPPORT_ITEM) {
            this.resourceSprite = new SpriteBase(this.dailyRewardConfig.daily_reward.resource.spt_item);
            this.resourceSprite.anchor.set(0.5);
            this.addChild(this.resourceSprite);
        } else {
            this.resourceSprite = new SpriteBase(this.dailyRewardConfig.daily_reward.resource.ticket);
            this.resourceSprite.anchor.set(0.5);
            this.addChild(this.resourceSprite);
        }
        //
        if (this.state == RewardDailySprite.INIT) {
            this.tweenParent = game.add.tween(this.resourceSprite).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.In, true);
            this.tweenParent.loop();
            let rotate = 0.1;
            this.tweenParent.onUpdateCallback(() => {
                this.resourceSprite.rotation += rotate;
                if (this.resourceSprite.rotation > 0.2) {
                    rotate = -0.07;
                } else if (this.resourceSprite.rotation < -0.2) {
                    rotate = 0.07;
                }
            }, this);
        }
        // this.resourceSprite
    }

    addRewardTxt() {
        LogConsole.log("addRewardTxt");
        if (this.state == RewardDailySprite.REWARDED) {
            this.rewardTxt = new SpriteBase(this.dailyRewardConfig.daily_reward.icon_rewarded);
            this.rewardTxt.anchor.set(0.5);
            this.addChild(this.rewardTxt);
        } else {
            this.rewardTxt = new Phaser.Text(game, this.dailyRewardConfig.daily_reward.txt_reward.x * window.GameConfig.RESIZE, this.dailyRewardConfig.daily_reward.txt_reward.y * window.GameConfig.RESIZE, this.configs.reward, this.dailyRewardConfig.daily_reward.txt_reward.style);
            this.rewardTxt.anchor.set(0.5, 0);
            this.addChild(this.rewardTxt);
        }
    }

    addDay() {
        LogConsole.log("addDay");
        this.day = new Phaser.Text(game, this.dailyRewardConfig.daily_reward.txt_day.x * window.GameConfig.RESIZE, this.dailyRewardConfig.daily_reward.txt_day.y * window.GameConfig.RESIZE, `${Language.instance().getData(187)} ${this.configs.day}`, this.dailyRewardConfig.daily_reward.txt_day.style);
        this.day.anchor.set(0.5, 0);
        this.addChild(this.day);
    }

    changeRewarded() {
        this.tweenParent.stop();
        this.resourceSprite.rotation = 0;
        this.rewardTxt.destroy();
        this.rewardTxt = null;

        this.rewardTxt = new SpriteBase(this.dailyRewardConfig.daily_reward.icon_rewarded);
        this.rewardTxt.anchor.set(0.5);
        this.addChild(this.rewardTxt);
    }

    destroy() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}