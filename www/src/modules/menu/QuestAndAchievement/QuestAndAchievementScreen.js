import QuestAndAchievementTabs from "./QuestAndAchievementTabs.js";
import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreen from "../../../view/ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllScreenDialog from "../../../view/ControllScreenDialog.js";
import ControllLoading from "../../../view/ControllLoading.js";
import PlayScriptScreen from "../../../view/playscript/playScriptScreen.js";
import MainData from "../../../model/MainData.js";
import IronSource from "../../../IronSource.js";
import EventGame from "../../../controller/EventGame.js";
import Common from "../../../common/Common.js";
import DataUser from "../../../model/user/DataUser.js";
import BaseScreenSprite from "../../../view/component/BaseScreenSprite.js";
import Language from "../../../model/Language.js";

export default class QuestAndAchievementScreen extends BaseScreenSprite {
    constructor(type) {
        super(game);
        this.type = type;
        this.header;
        this.tabsUnderHeader;
        this.scrollGroup;
        this.quests = [];
        this.questLogs = [];
        this.nextQuest;
        this.achievementClaim;
        this.typeClaim = 0;
        this.signalBack = new Phaser.Signal();
        // this.afterInit();
        this.arrResource = [
            // {
            //     type: "text",
            //     link: "img/config/positionCreateRoom.json",
            //     key: "positionCreateRoom"
            // },
            // {
            //     type: "atlas",
            //     link: "img/atlas/createroom.png",
            //     key: "createroom",
            //     linkJson: "img/atlas/createroom.json"
            // },
            // {
            //     type: "image",
            //     link: "img/background/bg-playlist.png",
            //     key: "bg-playlist"
            // }
            //Adding
            {
                type: "text",
                link: "img/config/questAndAchieveConfig.json",
                key: "positionQAndAConfig"
            }
        ]
        this.loadResource();
    }

    onLoadFileComplete() {
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.afterInit();
        this.setQuestAndQuestLogs();
    }

    afterInit() {
        this.addEventExtension();
        this.addHeaderTab(this.positionQAndAConfig.header);
        this.addHeaderResources(this.positionQAndAConfig.header);
        //
        ControllLoading.instance().hideLoading();
        //
        MainData.instance().achievements = [];
        MainData.instance().dailyQuestLists = [];
        //
        IronSource.instance().showBanerQuestScreen();
    }

    addHeaderResources(configs) {
        this.headerResource = new Phaser.Sprite(game, configs.tab_chonplaylist.x * window.GameConfig.RESIZE, configs.tab_chonplaylist.y * window.GameConfig.RESIZE, configs.tab_chonplaylist.nameAtlas, configs.tab_chonplaylist.nameSprite);
        this.addChild(this.headerResource);
        this.txtQuest;
        this.btnBack;
        this.addTxtQuest(this.positionQAndAConfig.header.txt_quest);
        this.addButtonBack(configs.btn_back);
        this.txtGem;
        this.txtTicket;
        this.txtMic;
        this.tabGemHeader;
        this.tabTicketHeader;
        this.tabMicHeader;
        this.addTabGemHeader(this.positionQAndAConfig.header);
        this.addTabTicketHeader(this.positionQAndAConfig.header);
        this.addTabMicHeader(this.positionQAndAConfig.header);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x * window.GameConfig.RESIZE, configs.tabGem.y * window.GameConfig.RESIZE, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.positionQAndAConfig.header.gem);
        this.txtGem = this.addTxtGem(this.positionQAndAConfig.header.txtResource);
        let sumWidth = gem.width + this.txtGem.width;
        this.txtGem.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGemHeader.width - sumWidth) / 2) + this.txtGem.width + 5 * window.GameConfig.RESIZE;
        this.tabGemHeader.addChild(gem);
        this.tabGemHeader.addChild(this.txtGem);
        //
        this.headerResource.addChild(this.tabGemHeader);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtGem(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
    }

    addTabTicketHeader(configs) {
        this.tabTicketHeader = new Phaser.Sprite(game, configs.tabTicket.x * window.GameConfig.RESIZE, configs.tabTicket.y * window.GameConfig.RESIZE, configs.tabTicket.nameAtlas, configs.tabTicket.nameSprite);
        //
        let ticket = this.addTicket(this.positionQAndAConfig.header.ticket);
        this.txtTicket = this.addTxtTicket(this.positionQAndAConfig.header.txtResource);
        let sumWidth = ticket.width + this.txtTicket.width;
        this.txtTicket.x = ((this.tabTicketHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        ticket.x = ((this.tabTicketHeader.width - sumWidth) / 2) + this.txtTicket.width + 5 * window.GameConfig.RESIZE;
        this.tabTicketHeader.addChild(ticket);
        this.tabTicketHeader.addChild(this.txtTicket);
        //
        this.headerResource.addChild(this.tabTicketHeader);
    }

    addTicket(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtTicket(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value, configs.configs);
    }

    addTabMicHeader(configs) {
        this.tabMicHeader = new Phaser.Sprite(game, configs.tabMic.x * window.GameConfig.RESIZE, configs.tabMic.y * window.GameConfig.RESIZE, configs.tabMic.nameAtlas, configs.tabMic.nameSprite);
        //
        let mic = this.addMic(this.positionQAndAConfig.header.micro);
        this.txtMic = this.addTxtMic(this.positionQAndAConfig.header.txtResource);
        let sumWidth = mic.width + this.txtMic.width;
        this.txtMic.x = ((this.tabMicHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        mic.x = ((this.tabMicHeader.width - sumWidth) / 2) + this.txtMic.width + 5 * window.GameConfig.RESIZE;
        this.tabMicHeader.addChild(mic);
        this.tabMicHeader.addChild(this.txtMic);
        //
        this.headerResource.addChild(this.tabMicHeader);
    }


    addMic(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtMic(configs) {
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value, configs.configs);
    }

    addHeaderTab(configs) {
        this.headerTab = new Phaser.Sprite(game, configs.tab_quest.x * window.GameConfig.RESIZE, configs.tab_quest.y * window.GameConfig.RESIZE, configs.tab_quest.nameAtlas, configs.tab_quest.nameSprite);
        this.addChild(this.headerTab);
        //
    }

    addButtonBack(configs) {
        this.btnBack = new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.headerResource.addChild(this.btnBack);
    }

    onBack() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.removeAllChild();
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        this.destroy();
    }

    setQuestAndQuestLogs() {
        this.addTabsUnderHeader(this.type);
    }

    addTxtQuest(configs) {
        this.txtQuest = new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, Language.instance().getData("228"), configs.configs);
        this.txtQuest.anchor.set(0.5, 0);
        this.headerTab.addChild(this.txtQuest);
    }

    addTabsUnderHeader(type) {
        this.tabsUnderHeader = new QuestAndAchievementTabs();
        this.tabsUnderHeader.changeScreen(type);
        this.tabsUnderHeader.event.claimReward.add(this.claimReward, this);
        this.tabsUnderHeader.event.claimRewardQuest.add(this.claimRewardQuest, this);
        this.addChild(this.tabsUnderHeader);
        //
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_TURNBASE) {
            this.playScript = new PlayScriptScreen();
            this.playScript.afterInit();
            this.playScript.removeAllTut();
            this.playScript.addStep6BtnReceiveInQAndA();
            this.playScript.onSkipPS();
            this.addChild(this.playScript);
        }
    }

    claimRewardQuest(quest, quest_log_id) {
        this.questClaim = quest;
        this.questClaimId = quest_log_id;
        //
        this.sendRequestClaimQuest();
    }

    claimReward(achievement) {
        //
        this.achievementClaim = achievement;
        this.sendRequestClaimAchievement();
    }

    updateVariableResource(achievement) {
        if (achievement.reward_type == "DIAMOND") {
            this.txtGem.setText(SocketController.instance().socket.mySelf.getVariable('diamond').value - achievement.reward);
            let tweenVariable = game.add.tween(this.txtGem).to({ text: SocketController.instance().socket.mySelf.getVariable('diamond').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtGem.text = parseInt(this.txtGem.text);
            }, this);
            tweenVariable.onComplete.add(() => {
                this.checkAds();
            }, this);
        } else if (achievement.reward_type == "TICKET") {
            this.txtTicket.setText(SocketController.instance().socket.mySelf.getVariable('ticket').value - achievement.reward);
            let tweenVariable = game.add.tween(this.txtTicket).to({ text: SocketController.instance().socket.mySelf.getVariable('ticket').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtTicket.text = parseInt(this.txtTicket.text);
            }, this);
            tweenVariable.onComplete.add(() => {
                this.checkAds();
            }, this);
        } else if (achievement.reward_type == "SUPPORT_ITEM") {
            this.txtMic.setText(SocketController.instance().socket.mySelf.getVariable('support_item').value - achievement.reward);
            let tweenVariable = game.add.tween(this.txtMic).to({ text: SocketController.instance().socket.mySelf.getVariable('support_item').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtMic.text = parseInt(this.txtMic.text);
            }, this);
            tweenVariable.onComplete.add(() => {
                this.checkAds();
            }, this);
        }
    }

    checkAds() {
        if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_ALL) {
            if (this.typeClaim == 1) {
                IronSource.instance().questTakeReward();
                IronSource.instance().showInterstitialQuestTakereward();
            } else if (this.typeClaim == 2) {
                IronSource.instance().achievementTakeReward();
                IronSource.instance().showInterstitialachievementTakeReward();
            }
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.onBack, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.remove(this.onBack, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.ACHIEVEMENT_CLAIM_REWARD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                MainData.instance().achievements = [];
                this.typeClaim = 2;
                this.tabsUnderHeader.changeScreen(3);
                ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, {
                    type: this.achievementClaim.reward_type,
                    reward: this.achievementClaim.reward
                });
                this.timeUpdateAchievement = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                    this.updateVariableResource(this.achievementClaim);
                }, this);
                ControllLoading.instance().hideLoading();
            }
        }
        if (evtParams.cmd == DataCommand.QUEST_CLAIM_REWARD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.typeClaim = 1;
                this.tabsUnderHeader.changeScreen(2);
                ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, {
                    type: this.questClaim.reward_type,
                    reward: this.questClaim.reward
                })
                this.timeUpdateQuest = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                    this.updateVariableResource(this.questClaim);
                }, this);
                ControllLoading.instance().hideLoading();
                //
                this.timeUpdatePlayScript = game.time.events.add(Phaser.Timer.SECOND * 3.2, () => {
                    if (MainData.instance().playScript.playing_guide == PlayScriptScreen.DONE_TURNBASE) {
                        SocketController.instance().sendData(DataCommand.PLAY_SCRIPT_DONE_GET_QUEST_REQUEST, null);
                    }
                });
                //
                Common.changeQuestLogsOnClaim(this.questClaimId, DataUser.instance().quest_logs);
                this.questClaimId = null;
                SocketController.instance().sendData(DataCommand.QUEST_CHECK_ACHIEVED_REQUEST, null);
            }
        }
        if (evtParams.cmd == DataCommand.PLAY_SCRIPT_DONE_GET_QUEST_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.playScript = new PlayScriptScreen();
                this.playScript.afterInit();
                this.playScript.addStep7CloseQAndA();
                this.playScript.event.step7.add(this.cancleQuestTut, this);
                this.addChild(this.playScript);
            }
        }
        if (evtParams.cmd == DataCommand.PLAY_SCRIPT_DONE_ALL_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                MainData.instance().playScript.playing_guide = PlayScriptScreen.DONE_ALL;
                this.playScript.destroy();
            }
        }
    }

    cancleQuestTut() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.removeAllChild();
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        this.destroy();
    }

    sendRequestClaimQuest() {
        LogConsole.log(this.questClaim);
        var params = new SFS2X.SFSObject();
        params.putLong("quest_log_id", this.questClaimId);
        SocketController.instance().sendData(DataCommand.QUEST_CLAIM_REWARD_REQUEST, params);
        ControllLoading.instance().showLoading();
    }

    sendRequestClaimAchievement() {
        LogConsole.log(this.achievementClaim);
        var params = new SFS2X.SFSObject();
        params.putLong("achievement_log_id", this.achievementClaim.achievement_log.id);
        SocketController.instance().sendData(DataCommand.ACHIEVEMENT_CLAIM_REWARD_REQUEST, params);
        ControllLoading.instance().showLoading();
    }

    removeAllChild() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }

    destroy() {
        this.removeEventExtension();
        IronSource.instance().hideBanner();
        game.time.events.remove(this.timeUpdateAchievement);
        game.time.events.remove(this.timeUpdateQuest);
        game.time.events.remove(this.timeUpdatePlayScript);
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