import AchievementScrollList from "./Achievement/AchievementScrollList.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";

export default class QuestAndAchievementTabAchievement extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 3;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.scrollScreenOnTab = null;
        this.signalInput = new Phaser.Signal();
        this.event = {
            claimReward: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.addScrollScreen();
    }

    addEventInput(evt, scope) {
        this.signalInput.add(evt, scope);
    }

    addScrollScreen() {
        this.scrollScreenOnTab = new AchievementScrollList();
        this.scrollScreenOnTab.event.claimReward.add(this.claimReward, this);
        this.addChild(this.scrollScreenOnTab);
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_Achievement);
        //
    }
    claimReward(achievement) {
        this.event.claimReward.dispatch(achievement);
    }

    show() {
        game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300 * window.GameConfig.RESIZE
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }

    destroy() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}