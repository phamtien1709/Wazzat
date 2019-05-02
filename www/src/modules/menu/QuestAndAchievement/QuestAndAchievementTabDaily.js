import DailyScrollList from "./Daily/DailyScrollList.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import DataCommand from "../../../common/DataCommand.js";
import DailyQuest from "./Data/DailyQuest.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import ControllLoading from "../../../view/ControllLoading.js";

export default class QuestAndAchievementTabDaily extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 1;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.scrollScreenOnTab = null;
        this.signalInput = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        // this.addScrollScreen();
    }

    addEventInput(evt, scope) {
        this.signalInput.add(evt, scope);
    }

    addScrollScreen() {
        this.scrollScreenOnTab = new DailyScrollList();
        this.addChild(this.scrollScreenOnTab);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.DAILY_QUEST_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleDailyQuest(evtParams.params, () => {
                    this.doneDailyQuestResponse();
                });
                // this.event.claimReward.dispatch(this.quest);
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
    }

    doneDailyQuestResponse() {
        this.addScrollScreen();
        this.scrollScreenOnTab.setQuestsAndQuestLogs(MainData.instance().dailyQuestLists);
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_Daily);
        this.timeoutHideLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
    }

    show() {
        ControllLoading.instance().showLoading();
        //
        this.checkDailyQuestLoadRequest();
        if (MainData.instance().isDailyQuestLoad.checking == false) {
            if (MainData.instance().dailyQuestLists.length > 0) {
                this.doneDailyQuestResponse();
            } else {
                SocketController.instance().sendData(DataCommand.DAILY_QUEST_LOAD_REQUEST, null);
            }
            MainData.instance().isDailyQuestLoad.checking = true;
            MainData.instance().isDailyQuestLoad.updated = Date.now();
        } else {
            this.doneDailyQuestResponse();
        }
        game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_Daily);
        //
    }

    checkDailyQuestLoadRequest() {
        if (MainData.instance().isDailyQuestLoad.checking == true) {
            let now = Date.now();
            if (now - MainData.instance().isDailyQuestLoad.updated < 6000) {
                if (MainData.instance().dailyQuestLists.length > 0) {
                    MainData.instance().isDailyQuestLoad.checking = true;
                } else {
                    MainData.instance().isDailyQuestLoad.checking = false;
                }
            } else {
                MainData.instance().isDailyQuestLoad.checking = false;
            }
        } else {
            MainData.instance().isDailyQuestLoad.checking = false;
        }
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
                x: (-game.width - 300 * window.GameConfig.RESIZE)
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }

    handleDailyQuest(res, callback) {
        MainData.instance().dailyQuestLists = [];
        let quests = res.getSFSArray('daily_quest');
        for (let i = 0; i < quests.size(); i++) {
            let quest = new DailyQuest();
            let questRes = quests.getSFSObject(i);
            quest.reward = questRes.getInt('reward');
            quest.reward_type = questRes.getUtfString('reward_type');
            quest.achieved = questRes.getInt('achieved');
            quest.id = questRes.getInt('id');
            quest.quest = questRes.getUtfString('quest');
            quest.required = questRes.getInt('required');
            quest.quest_type = questRes.getInt('quest_type');
            MainData.instance().dailyQuestLists.push(quest);
        }
        callback();
    }

    destroy() {
        clearTimeout(this.timeoutHideLoading);
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}