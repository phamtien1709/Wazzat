import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import StarsAchievement from "../items/StarsAchievement.js";
import Language from "../../../../model/Language.js";
import ControllLoadCacheUrl from "../../../../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class AchievementSprite extends BaseGroup {
    constructor(configs, index) {
        super(game)
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.configs = configs;
        this.index = index;
        this.event = {
            claimReward: new Phaser.Signal()
        }
        // this.configs.is_done = true;
        this.afterInit();
        // LogConsole.log(this.configs);
    }

    afterInit() {
        this.medal;
        this.title;
        this.condition;
        this.tick;
        this.box;
        this.addMedal(this.positionQAndAConfig.achievement.medal);
        this.addTitle(this.positionQAndAConfig.achievement.title);
        this.addCondition(this.positionQAndAConfig.achievement.condition);
        this.paddingTitleAndCondition();
        if (this.configs.is_done == true) {
            if (this.configs.achievement_log.state == "INIT") {
                this.title.setText(`${this.configs.title} ${this.configs.current_level} (${this.configs.achieved}/${this.configs.required})`)
                this.addBoxClaim();
            } else {
                this.addTick();
            }
        } else {
            if (this.configs.current_level == 5) {
                this.addTick();
            } else {
                this.addBox();
            }
        }
        this.addLine();
        this.checkIsDone();
        this.addStar();
    }

    addMedal(configs) {
        this.medal = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.medal.scale.set(window.GameConfig.SCALE_MEDAL * window.GameConfig.RESIZE);
        this.loadMedal(this.configs.medal);
        this.addChild(this.medal);
    }

    loadMedal(url) {
        this.medalUrl = url;
        if (game.cache.checkImageKey(this.medalUrl)) {
            this.onLoadMedalComplete();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoadMedalComplete, this);
            ControllLoadCacheUrl.instance().addLoader(this.medalUrl);
        }

    }
    onLoadMedalComplete() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoadMedalComplete, this);
        if (game.cache.checkImageKey(this.medalUrl)) {
            setTimeout(() => {
                try {
                    if (game.cache.checkImageKey(this.medalUrl)) {
                        if (this) {
                            this.medal.loadTexture(this.medalUrl);
                        }
                    } else {

                    }
                } catch (error) {

                }
            }, 50 * this.index);
        }
    }

    addTitle(configs) {
        this.title = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, `${this.configs.title} ${this.configs.current_level + 1} (${this.configs.achieved}/${this.configs.required})`, configs.configs);
        if (this.configs.current_level == 5) {
            this.title.setText(`${this.configs.title} ${this.configs.current_level} (${this.configs.achieved}/${this.configs.required})`)
        }
        this.addChild(this.title);
    }

    addCondition(configs) {
        this.condition = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, this.configs.condition, configs.configs);
        this.addChild(this.condition);
    }

    paddingTitleAndCondition() {
        let sumHeight = this.title.height + this.condition.height;
        this.title.y = ((164 * window.GameConfig.RESIZE - sumHeight) / 2) - 5 * window.GameConfig.RESIZE;
        this.condition.y = ((164 * window.GameConfig.RESIZE - sumHeight) / 2) + this.title.height + 5 * window.GameConfig.RESIZE;
    }

    addTick() {
        let tick = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.tick.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.tick.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.tick.nameAtlas, this.positionQAndAConfig.achievement.tick.nameSprite);
        tick.anchor.set(0.5);
        this.addChild(tick);
    }

    addBox() {
        this.box = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.box.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.box.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.box.nameAtlas, this.positionQAndAConfig.achievement.box.nameSprite);
        this.box.anchor.set(0.5);
        this.box.alpha = 0.5;
        this.addIconAndTxtReward();
        this.addChild(this.box);
    }

    addIconAndTxtReward() {
        let icon = this.addIcon();
        let price = this.addReward();
        let sumWidth = icon.width + price.width;
        price.x = (((this.box.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE) - this.box.width / 2;
        icon.x = (((this.box.width - sumWidth) / 2) + price.width + 5 * window.GameConfig.RESIZE) - this.box.width / 2;
        this.box.addChild(icon);
        this.box.addChild(price);
    }

    addIcon() {
        var nameSprite;
        if (this.configs.reward_type == "DIAMOND") {
            nameSprite = "Gem";
        } else if (this.configs.reward_type == "TICKET") {
            nameSprite = "Ticket-tiny";
        } else if (this.configs.reward_type == "SUPPORT_ITEM") {
            nameSprite = "Mic_tiny";
        }
        return new Phaser.Sprite(game, 0, -8 * window.GameConfig.RESIZE, 'defaultSource', nameSprite);
    }

    addReward() {
        return new Phaser.Text(game, 0, -8 * window.GameConfig.RESIZE, this.configs.reward, {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "fontSize": 18
        });
    }

    addBoxClaim() {
        this.box = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.box_claim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.box_claim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.box_claim.nameAtlas, this.positionQAndAConfig.achievement.box_claim.nameSprite);
        this.box.anchor.set(0.5);
        this.box.inputEnabled = true;
        this.box.events.onInputUp.add(this.onClaimReward, this);
        // this.box.alpha = 0.5;
        this.addIconAndTxtBoxClaim();
        this.addChild(this.box);
    }

    addIconAndTxtBoxClaim() {
        let txtReceive = new Phaser.Text(game, this.positionQAndAConfig.achievement.box_claim.txt.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.box_claim.txt.y * window.GameConfig.RESIZE, Language.instance().getData("189"), this.positionQAndAConfig.achievement.box_claim.txt.configs);
        txtReceive.anchor.set(0.5);
        this.box.addChild(txtReceive);
        let icon = this.addIcon();
        icon.y = 14 * window.GameConfig.RESIZE;
        let price = this.addReward();
        price.y = 14 * window.GameConfig.RESIZE;
        let sumWidth = icon.width + price.width;
        price.x = (((this.box.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE) - this.box.width / 2;
        icon.x = (((this.box.width - sumWidth) / 2) + price.width + 5 * window.GameConfig.RESIZE) - this.box.width / 2;
        this.box.addChild(icon);
        this.box.addChild(price);
    }
    onClaimReward() {
        this.box.inputEnabled = false;
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.claimReward.dispatch(this.configs);
    }

    addLine() {
        let line = new Phaser.Sprite(game, 35 * window.GameConfig.RESIZE, 162 * window.GameConfig.RESIZE, 'defaultSource', 'Line');
        this.addChild(line);
    }

    addStar() {
        if (this.configs.achievement_log.state == "INIT") {
            this.stars = new StarsAchievement(80, 22, this.configs.current_level, 0.5);
            this.addChild(this.stars);
        } else {
            this.stars = new StarsAchievement(80, 22, this.configs.current_level + 1, 0.5);
            this.addChild(this.stars);
        }
        if (this.configs.current_level == 1) {

        } else if (this.configs.current_level == 2) {

        } else if (this.configs.current_level == 3) {

        } else if (this.configs.current_level == 4) {

        } else if (this.configs.current_level == 5) {

        }
    }

    checkIsDone() {
        if (this.configs.is_done == true) {
            this.alpha = 1;
        } else {
            // this.alpha = 1;
            if (this.configs.current_level == 0) {
                this.alpha = 0.4;
            } else {
                this.alpha = 1;
            }
        }
    }

    get height() {
        return 164 * window.GameConfig.RESIZE;
    }
}