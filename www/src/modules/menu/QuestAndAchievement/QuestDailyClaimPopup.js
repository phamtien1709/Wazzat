import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import PopupBg from "../../../view/popup/item/PopupBg.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../../view/ControllScreenDialog.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../../view/BaseGroup.js";

export default class QuestDailyClaimPopup extends BaseGroup {
    constructor(quest) {
        super(game)
        // "questDemo": {
        //     "id": 12,
        //     "quest": "Share game resuft on facebook",
        //     "required": 1,
        //     "reward": 50,
        //     "reward_type": "DIAMOND",
        //     "quest_type": 12
        // }
        this.quest = quest;
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.dailyRewardConfig = JSON.parse(game.cache.getText('dailyRewardConfig'));
        this.eventInput = {
            claim: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.screenDim;
        this.addScreenDim();
        this.headerResource;
        this.addHeaderResource();
        this.popup;
        this.addPopup();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Popup_Quest);
        //
        this.timeoutPopup = setTimeout(() => {
            this.makeTweenPopup();
        }, 1000);
    }

    addScreenDim() {
        this.screenDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.screenDim.inputEnabled = true;
        this.addChild(this.screenDim);
    }

    addHeaderResource() {
        this.headerResource = new Phaser.Group(game, 0, 0)
        this.addChild(this.headerResource);
        this.txtGem;
        this.txtTicket;
        this.txtMic;
        this.tabGemHeader;
        this.tabTicketHeader;
        this.tabMicHeader;
        this.addTabGemHeader(this.dailyRewardConfig.header);
        this.addTabTicketHeader(this.dailyRewardConfig.header);
        this.addTabMicHeader(this.dailyRewardConfig.header);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x * window.GameConfig.RESIZE, configs.tabGem.y * window.GameConfig.RESIZE, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.dailyRewardConfig.header.gem);
        this.txtGem = this.addTxtGem(this.dailyRewardConfig.header.txtResource);
        let sumWidth = gem.width + this.txtGem.width;
        this.txtGem.x = ((this.tabGemHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGemHeader.width - sumWidth) / 2) + this.txtGem.width + 10 * window.GameConfig.RESIZE;
        this.tabGemHeader.addChild(gem);
        this.tabGemHeader.addChild(this.txtGem);
        //
        this.headerResource.addChild(this.tabGemHeader);
    }

    addGem(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtGem(configs) {
        if (this.quest.reward_type == "DIAMOND") {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value - this.quest.reward, configs.configs);
        } else {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
        }
    }

    addTabTicketHeader(configs) {
        this.tabTicketHeader = new Phaser.Sprite(game, configs.tabTicket.x * window.GameConfig.RESIZE, configs.tabTicket.y * window.GameConfig.RESIZE, configs.tabTicket.nameAtlas, configs.tabTicket.nameSprite);
        //
        let ticket = this.addTicket(this.dailyRewardConfig.header.ticket);
        this.txtTicket = this.addTxtTicket(this.dailyRewardConfig.header.txtResource);
        let sumWidth = ticket.width + this.txtTicket.width;
        this.txtTicket.x = ((this.tabTicketHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        ticket.x = ((this.tabTicketHeader.width - sumWidth) / 2) + this.txtTicket.width + 10 * window.GameConfig.RESIZE;
        this.tabTicketHeader.addChild(ticket);
        this.tabTicketHeader.addChild(this.txtTicket);
        //
        this.headerResource.addChild(this.tabTicketHeader);
    }
    addTicket(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtTicket(configs) {
        if (this.quest.reward_type == "TICKET") {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value - this.quest.reward, configs.configs);
        } else {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value, configs.configs);
        }
    }

    addTabMicHeader(configs) {
        this.tabMicHeader = new Phaser.Sprite(game, configs.tabMic.x * window.GameConfig.RESIZE, configs.tabMic.y * window.GameConfig.RESIZE, configs.tabMic.nameAtlas, configs.tabMic.nameSprite);
        //
        let mic = this.addMic(this.dailyRewardConfig.header.micro);
        this.txtMic = this.addTxtMic(this.dailyRewardConfig.header.txtResource);
        let sumWidth = mic.width + this.txtMic.width;
        this.txtMic.x = ((this.tabMicHeader.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        mic.x = ((this.tabMicHeader.width - sumWidth) / 2) + this.txtMic.width + 10 * window.GameConfig.RESIZE;
        this.tabMicHeader.addChild(mic);
        this.tabMicHeader.addChild(this.txtMic);
        //
        this.headerResource.addChild(this.tabMicHeader);
    }
    addMic(configs) {
        return new Phaser.Sprite(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, configs.nameAtlas, configs.nameSprite);
    }

    addTxtMic(configs) {
        if (this.quest.reward_type == "SUPPORT_ITEM") {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value - this.quest.reward, configs.configs);
        } else {
            return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value, configs.configs);
        }
    }

    addPopup() {
        this.txtPopup;
        this.rewardClaimed;
        this.txtQuestReward;
        this.btnClaim;
        this.popup = new PopupBg();
        this.popup.x = 35 * window.GameConfig.RESIZE;
        this.popup.y = 1140 * window.GameConfig.RESIZE;
        this.popup.setHeight(400 * window.GameConfig.RESIZE);
        this.addTxtPopup();
        this.addRewardClaimed();
        this.addTxtQuestReward();
        this.addBtnClaim();
        this.addChild(this.popup);
    }

    addTxtPopup() {
        this.txtPopup = new Phaser.Text(game, this.positionQAndAConfig.txtPopupClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.txtPopupClaim.y * window.GameConfig.RESIZE, Language.instance().getData("272"), this.positionQAndAConfig.txtPopupClaim.configs);
        this.txtPopup.anchor.set(0.5, 0);
        this.popup.addChild(this.txtPopup);
    }

    addRewardClaimed() {
        this.rewardClaimed = new Phaser.Text(game, this.positionQAndAConfig.rewardClaimed.x * window.GameConfig.RESIZE, this.positionQAndAConfig.rewardClaimed.y * window.GameConfig.RESIZE, this.quest.reward, this.positionQAndAConfig.rewardClaimed.configs);
        //
        if (this.quest.reward_type == "DIAMOND") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.gemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.gemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.gemClaim.nameAtlas, this.positionQAndAConfig.gemClaim.nameSprite);
            gem.scale.set(1.2);
        } else if (this.quest.reward_type == "TICKET") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.ticketClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.ticketClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.ticketClaim.nameAtlas, this.positionQAndAConfig.ticketClaim.nameSprite);
            gem.scale.set(1.2);
        } else {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.sptItemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.sptItemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.sptItemClaim.nameAtlas, this.positionQAndAConfig.sptItemClaim.nameSprite);
            gem.scale.set(1.2);
        }
        //
        let sumWidth = this.rewardClaimed.width + gem.width;
        this.rewardClaimed.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) + this.rewardClaimed.width + 10 * window.GameConfig.RESIZE;
        //
        this.popup.addChild(this.rewardClaimed);
        this.popup.addChild(gem);
    }

    addTxtQuestReward() {
        this.txtQuestReward = new Phaser.Text(game, this.positionQAndAConfig.questReward.x * window.GameConfig.RESIZE, this.positionQAndAConfig.questReward.y * window.GameConfig.RESIZE, this.quest.quest, this.positionQAndAConfig.questReward.configs);
        this.txtQuestReward.anchor.set(0.5, 0);
        this.popup.addChild(this.txtQuestReward);
    }

    addBtnClaim() {
        this.btnClaim = new Phaser.Sprite(game, 285 * window.GameConfig.RESIZE, 295 * window.GameConfig.RESIZE, "questAndAchieveSprites", "Button_Nhan_popup");
        this.btnClaim.anchor.set(0.5, 0);
        let txt = new Phaser.Text(game, 0, 27 * window.GameConfig.RESIZE, Language.instance().getData("189"), {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 30
        });
        txt.anchor.set(0.5, 0);
        this.btnClaim.addChild(txt);
        this.btnClaim.inputEnabled = true;
        this.btnClaim.events.onInputUp.add(() => {
            this.btnClaim.inputEnabled = false;
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            //
            var finishPoint = {
                x: 0,
                y: 0
            };
            if (this.quest.reward_type == "DIAMOND") {
                finishPoint.x = 351;
                finishPoint.y = 55;
            } else if (this.quest.reward_type == "TICKET") {
                finishPoint.x = 529;
                finishPoint.y = 55;
            } else {
                finishPoint.x = 164;
                finishPoint.y = 55;
            }
            ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, {
                type: this.quest.reward_type,
                reward: this.quest.reward,
                finishPoint: finishPoint
            });
            this.timeUpdateRs = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                this.updateVariableResource(this.quest);
            }, this);
            ControllScreenDialog.instance().animClaimReward.event.tweenDoneAll.add(this.onClaimDone, this);
        }, this);
        this.popup.addChild(this.btnClaim);
    }

    updateVariableResource(quest) {
        if (quest.reward_type == "DIAMOND") {
            let tweenVariable = game.add.tween(this.txtGem).to({ text: SocketController.instance().dataMySeft.diamond }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                // LogConsole.log('vao');
                this.txtGem.text = parseInt(this.txtGem.text);
            }, this);
        } else if (quest.reward_type == "TICKET") {
            let tweenVariable = game.add.tween(this.txtTicket).to({ text: SocketController.instance().dataMySeft.ticket }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                // LogConsole.log('vao');
                this.txtTicket.text = parseInt(this.txtTicket.text);
            }, this);
        } else if (quest.reward_type == "SUPPORT_ITEM") {
            let tweenVariable = game.add.tween(this.txtMic).to({ text: SocketController.instance().dataMySeft.support_item }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                // LogConsole.log('vao');
                this.txtMic.text = parseInt(this.txtMic.text);
            }, this);
        }
    }

    onClaimDone() {
        ////
        let tween = game.add.tween(this.popup).to({ y: -430 * window.GameConfig.RESIZE }, 400, Phaser.Easing.Linear.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            // this.eventInput.claim.dispatch();
            this.destroy();
        }, this);
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.popupfinishquest);
        let tween = game.add.tween(this.popup).to({ y: (game.height - 763) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
    }

    onClose() {
        let tween = game.add.tween(this.popup).to({ y: -430 * window.GameConfig.RESIZE }, 200, Phaser.Easing.Linear.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
        this.popup.event.close.remove(this.onClose, this);
    }

    destroy() {
        game.time.events.remove(this.timeUpdateRs);
        if (this.children !== null) {
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
        super.destroy();
    }
}