import MainScrollList from "./Main/MainScrollList.js";
import DataCommand from "../../../common/DataCommand.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import ControllLoading from "../../../view/ControllLoading.js";
import DataUser from "../../../model/user/DataUser.js";

export default class QuestAndAchievementTabMain extends Phaser.Sprite {
    constructor(x, y, typeBefore, firstLoad = false) {
        super(game, x, y, null);
        this.type = 2;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.firstLoad = firstLoad;
        this.scrollScreenOnTab = null;
        this.signalInput = new Phaser.Signal();
        this.event = {
            claimReward: new Phaser.Signal(),
            nextQuestResponse: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        DataUser.instance().event.load_main_quest_complete.add(this.loadMainQuestComplete, this);
    }

    loadMainQuestComplete() {
        this.handleQuestMain();
        this.doneQuestLoadResponse();
    }

    addEventInput(evt, scope) {
        this.signalInput.add(evt, scope);
    }

    addScrollScreen() {
        this.removeScrollScreen();
        this.scrollScreenOnTab = new MainScrollList();
        this.scrollScreenOnTab.event.claimReward.add(this.claimReward, this);
        this.scrollScreenOnTab.setQuestsAndQuestLogs(MainData.instance().mainQuestLists, MainData.instance().mainQuestLogLists, MainData.instance().mainNextQuest);
        this.addChild(this.scrollScreenOnTab);
    }
    removeScrollScreen() {
        if (this.scrollScreenOnTab !== null) {
            game.world.remove(this.scrollScreenOnTab);
            this.scrollScreenOnTab.destroy();
            this.scrollScreenOnTab = null;
        }
    }

    claimReward(quest, quest_log_id) {
        this.quest = quest;
        this.quest_log_id = quest_log_id;
        this.destroy();
        this.event.claimReward.dispatch(quest, quest_log_id);
    }

    show() {
        ControllLoading.instance().showLoading();
        //
        if (this.firstLoad === false) {
            this.checkQuestLoadRequest();
            //
            if (MainData.instance().isMainQuestLoad.checking == false) {
                SocketController.instance().sendData(DataCommand.QUEST_CHECK_ACHIEVED_REQUEST, null);
                //
                MainData.instance().isMainQuestLoad.updated = Date.now();
                MainData.instance().isMainQuestLoad.checking = true;
            } else {
                MainData.instance().mainQuestLists = DataUser.instance().quests;
                MainData.instance().mainQuestLogLists = DataUser.instance().quest_logs;
                SocketController.instance().sendData(DataCommand.QUEST_CHECK_ACHIEVED_REQUEST, null);
            }
            //
            game.add.tween(this).to({
                x: 0
            }, 150, "Linear", true);
        } else {
            MainData.instance().mainQuestLists = DataUser.instance().quests;
            MainData.instance().mainQuestLogLists = DataUser.instance().quest_logs;
            this.loadMainQuestComplete();
            //
            game.add.tween(this).to({
                x: 0
            }, 150, "Linear", true);
        }
    }

    checkQuestLoadRequest() {
        if (MainData.instance().isMainQuestLoad.checking == true) {
            let now = Date.now();
            if ((now - MainData.instance().isMainQuestLoad.updated) < 6000) {
                MainData.instance().isMainQuestLoad.checking = true;
            } else {
                MainData.instance().isMainQuestLoad.checking = false;
            }
        } else {
            MainData.instance().isMainQuestLoad.checking = false;
        }
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300 * window.GameConfig.RESIZE
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
                this.destroy();
            }, this);
        }
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.QUEST_CLAIM_REWARD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.scrollScreenOnTab.destroy();
                this.scrollScreenOnTab = null;
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
        if (evtParams.cmd == DataCommand.QUEST_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {

            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
        if (evtParams.cmd == DataCommand.QUEST_CHECK_ACHIEVED_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleQuestLoadResponse(evtParams.params);
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
    }

    doneQuestLoadResponse() {
        this.addScrollScreen();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Quest_main);
        this.timeoutHideLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
    }

    handleQuestLoadResponse(res, callback) {
        MainData.instance().mainQuestLists = [];
        MainData.instance().mainQuestLogLists = [];
        MainData.instance().mainNextQuest = null;
        //
        let next_quest = res.getSFSObject('next_quest');
        MainData.instance().mainNextQuest = {
            next_quest_id: next_quest.getInt('next_quest_id'),
            next_quest_archieved: next_quest.getInt('next_quest_archieved')
        };
        // this.event.nextQuestResponse.dispatch()
        if (DataUser.instance().ktloadMainQuestComplete == true) {
            this.loadMainQuestComplete();
        } else {
            DataUser.instance().sendGetMainQuest();
        }
    }

    handleQuestMain() {
        MainData.instance().mainQuestLists = DataUser.instance().quests;
        MainData.instance().mainQuestLogLists = DataUser.instance().quest_logs;
    }

    destroy() {
        clearTimeout(this.timeoutHideLoading);
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        DataUser.instance().event.load_main_quest_complete.remove(this.loadMainQuestComplete, this);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}