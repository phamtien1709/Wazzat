import QuestAndAchievementTabDaily from "./QuestAndAchievementTabDaily.js";
import QuestAndAchievementTabMain from "./QuestAndAchievementTabMain.js";
import QuestAndAchievementTabAchievement from "./QuestAndAchievementTabAchievement.js";
import Common from "../../../common/Common.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import Language from "../../../model/Language.js";

export default class QuestAndAchievementTabs extends Phaser.Sprite {
    constructor() {
        super(game, 0, 175 * window.GameConfig.RESIZE, null);
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.tabDaily;
        this.tabMain;
        this.tabAchievement;
        this.lineDoc;
        this.event = {
            claimReward: new Phaser.Signal(),
            claimRewardQuest: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.typeNew;
        this.typeOld;
        this.mainQuests;
        this.mainQuestLogs;
        this.mainNextQuest;
        this.firstLoadMain = false;
        this.addBtnNavBar();
        this.addLineDoc(this.positionQAndAConfig.tabUnderHeader.line_doc);
    }

    addBtnNavBar() {
        this.addDailyBtn();
        this.addActiveDailyBtn();
        this.addMainBtn();
        this.addActiveMainBtn();
        this.addAchievementBtn();
        this.addActiveAchievementBtn();
        this.buildBtnArray();
    }

    setMainQuestsAndQuestLogs(quests, questLogs, nextQuest) {
        this.mainQuests = quests;
        this.mainQuestLogs = questLogs;
        this.mainNextQuest = nextQuest;
    }

    adjustPositionCenter(icon, txt, parent) {
        let sumWidth = icon.width + txt.width;
        icon.x = (parent.width - sumWidth) / 2;
        txt.x = icon.x + icon.width + 10;
    }

    addDailyBtn() {
        this.dailyBtn = new Phaser.Button(game, 0, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconDailyBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.daily.disactive.icon);
        let txtDailyBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.daily.disactive.txt, Language.instance().getData("229"));
        this.dailyBtn.addChild(iconDailyBtn);
        this.dailyBtn.addChild(txtDailyBtn);
        this.adjustPositionCenter(iconDailyBtn, txtDailyBtn, this.dailyBtn);
        this.dailyBtn.events.onInputUp.add(this.onClickDailyBtn, this);
        //
        this.addChild(this.dailyBtn);
    }

    onClickDailyBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_Daily_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.dailyBtn, this.dailyActiveBtn);
        this.typeNew = 1;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 1;
    }

    addActiveDailyBtn() {
        this.dailyActiveBtn = new Phaser.Button(game, 0, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconDailyActiveBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.daily.active.icon);
        let txtDailyActiveBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.daily.active.txt, Language.instance().getData("229"));
        this.dailyActiveBtn.addChild(iconDailyActiveBtn);
        this.dailyActiveBtn.addChild(txtDailyActiveBtn);
        this.adjustPositionCenter(iconDailyActiveBtn, txtDailyActiveBtn, this.dailyActiveBtn);
        this.addLineUnder(this.dailyActiveBtn, this.positionQAndAConfig.tabUnderHeader.daily.active.line);
        //
        this.addChild(this.dailyActiveBtn);
    }

    addMainBtn() {
        this.mainBtn = new Phaser.Button(game, 215 * window.GameConfig.RESIZE, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconMainBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.main.disactive.icon);
        let txtMainBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.main.disactive.txt, Language.instance().getData("230"));
        this.mainBtn.addChild(iconMainBtn);
        this.mainBtn.addChild(txtMainBtn);
        this.adjustPositionCenter(iconMainBtn, txtMainBtn, this.mainBtn);
        this.mainBtn.events.onInputUp.add(this.onClickMainBtn, this);
        //
        this.addChild(this.mainBtn);
    }

    onClickMainBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_main_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.mainBtn, this.mainActiveBtn);
        this.typeNew = 2;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 2;
    }

    addActiveMainBtn() {
        this.mainActiveBtn = new Phaser.Button(game, 215 * window.GameConfig.RESIZE, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconMainActiveBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.main.active.icon);
        let txtMainActiveBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.main.active.txt, Language.instance().getData("230"));
        this.mainActiveBtn.addChild(iconMainActiveBtn);
        this.mainActiveBtn.addChild(txtMainActiveBtn);
        this.adjustPositionCenter(iconMainActiveBtn, txtMainActiveBtn, this.mainActiveBtn);
        this.addLineUnder(this.mainActiveBtn, this.positionQAndAConfig.tabUnderHeader.main.active.line);
        //
        this.addChild(this.mainActiveBtn);
    }

    addAchievementBtn() {
        this.achievementBtn = new Phaser.Button(game, 427 * window.GameConfig.RESIZE, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconAchievementBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.achievement.disactive.icon);
        let txtAchievementBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.achievement.disactive.txt, Language.instance().getData("231"));
        this.achievementBtn.addChild(iconAchievementBtn);
        this.achievementBtn.addChild(txtAchievementBtn);
        this.adjustPositionCenter(iconAchievementBtn, txtAchievementBtn, this.achievementBtn);
        this.achievementBtn.events.onInputUp.add(this.onClickAchievementBtn, this);
        //
        this.addChild(this.achievementBtn);
    }

    onClickAchievementBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_Achievement_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        Common.switchButton(this.btnArray, this.activeBtnArray, this.achievementBtn, this.achievementActiveBtn);
        this.typeNew = 3;
        this.changeScreen(this.typeNew, this.typeOld);
        this.typeOld = 3;
    }

    addActiveAchievementBtn() {
        this.achievementActiveBtn = new Phaser.Button(game, 427 * window.GameConfig.RESIZE, 0, "questAndAchieveSprites", () => { }, this, null, "Tab_Menu_Quest");
        let iconAchievementActiveBtn = this.addIcon(this.positionQAndAConfig.tabUnderHeader.achievement.active.icon);
        let txtAchievementActiveBtn = this.addTxt(this.positionQAndAConfig.tabUnderHeader.achievement.active.txt, Language.instance().getData("231"));
        this.achievementActiveBtn.addChild(iconAchievementActiveBtn);
        this.achievementActiveBtn.addChild(txtAchievementActiveBtn);
        this.adjustPositionCenter(iconAchievementActiveBtn, txtAchievementActiveBtn, this.achievementActiveBtn);
        this.addLineUnder(this.achievementActiveBtn, this.positionQAndAConfig.tabUnderHeader.achievement.active.line);
        //
        this.addChild(this.achievementActiveBtn);
    }

    addIcon(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxt(configs, txtConfig) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, txtConfig, configs.configs);
    }

    addLineUnder(parent, configs) {
        let line = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        parent.addChild(line);
    }

    buildBtnArray() {
        this.activeBtnArray = [
            this.dailyActiveBtn,
            this.mainActiveBtn,
            this.achievementActiveBtn
        ];
        this.btnArray = [
            this.dailyBtn,
            this.mainBtn,
            this.achievementBtn
        ];
    }

    changeScreen(typeNew, typeOld) {
        if (typeNew == 1) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.dailyBtn, this.dailyActiveBtn);
            this.tabDaily = new QuestAndAchievementTabDaily(0, 0, typeOld);
            this.addChild(this.tabDaily);
            this.tabDaily.show();
            this.hideScreen(typeNew, typeOld);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        } else if (typeNew == 2) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.mainBtn, this.mainActiveBtn);
            this.tabMain = new QuestAndAchievementTabMain(0, 0, typeOld, this.firstLoadMain);
            this.firstLoadMain = true;
            this.tabMain.event.claimReward.add(this.claimRewardQuest, this);
            this.hideScreen(typeNew, typeOld);
            this.tabMain.show();
            this.addChild(this.tabMain);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        } else if (typeNew == 3) {
            Common.switchButton(this.btnArray, this.activeBtnArray, this.achievementBtn, this.achievementActiveBtn);
            this.tabAchievement = new QuestAndAchievementTabAchievement(0, 0, typeOld);
            this.tabAchievement.event.claimReward.add(this.claimReward, this);
            this.hideScreen(typeNew, typeOld);
            this.tabAchievement.show();
            this.addChild(this.tabAchievement);
            if (typeOld == undefined) {
                this.typeOld = typeNew;
            }
        }
    }

    claimRewardQuest(quest, quest_log_id) {
        this.event.claimRewardQuest.dispatch(quest, quest_log_id);
    }

    claimReward(achievement) {
        this.event.claimReward.dispatch(achievement);
    }

    hideScreen(typeNew, typeOld) {
        if (typeOld == 1) {
            this.tabDaily.hide(typeNew);
        } else if (typeOld == 2) {
            this.tabMain.hide(typeNew);
        } else if (typeOld == 3) {
            this.tabAchievement.hide(typeNew);
        }
    }

    addLineDoc(configs) {
        for (let i = 1; i < 3; i++) {
            let lineDoc = new Phaser.Sprite(game, configs.x * i * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
            this.addChild(lineDoc);
        }
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