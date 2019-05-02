import DailyRewardPopupChild from "../items/DailyRewardPopupChild.js";
import DataCommand from "../../../common/DataCommand.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import SocketController from "../../../controller/SocketController.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import MainData from "../../../model/MainData.js";
import BaseGroup from "../../BaseGroup.js";

export default class DailyRewardPopup extends BaseGroup {
    constructor(dailyRewardSettings, dailyRewardLog) {
        super(game)
        this.dailyRewardConfig = JSON.parse(game.cache.getText('dailyRewardConfig'));
        this.dailyRewardSettings = dailyRewardSettings;
        this.dailyRewardLog = dailyRewardLog;
        this.event = {
            claimDone: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        this.bg;
        this.headerResource;
        this.popup;
        this.addBg();
        this.addHeaderResource();
        this.addPopup();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Daily_reward);
        //
    }

    addBg() {
        this.bg = new Phaser.Button(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
    }

    addHeaderResource() {
        this.headerResource = new Phaser.Group(game)
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
        let ticket = this.addTicket(this.dailyRewardConfig.header.ticket);
        this.txtTicket = this.addTxtTicket(this.dailyRewardConfig.header.txtResource);
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
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('support_item').value, configs.configs);
    }

    addPopup() {
        this.popup = new DailyRewardPopupChild(this.dailyRewardSettings, this.dailyRewardLog);
        this.popup.event.claimDailyReward.add(this.onClaimDaily, this);
        this.addChild(this.popup);
        let tween = game.add.tween(this.popup).to({ y: game.height - MainData.instance().STANDARD_HEIGHT }, 1800, Phaser.Easing.Elastic.Out, false);
        tween.start();
        ControllSoundFx.instance().playSound(ControllSoundFx.dailyreward);
    }

    onClaimDaily(rewardObj, is_watched_ads) {
        this.rewardObj = rewardObj;
        this.is_watched_ads = is_watched_ads;
        this.sendClaim();
    }

    sendClaim() {
        let params = new SFS2X.SFSObject();
        params.putInt('is_watched_ads', this.is_watched_ads)
        SocketController.instance().sendData(DataCommand.DAILY_REWARD_CLAIM_REQUEST, params);
    }

    onClaimDailyDone() {
        this.popup.changeItemChildInit();
        //
        var finishPoint = {
            x: 0,
            y: 0
        };
        if (this.rewardObj.reward_type == "DIAMOND") {
            finishPoint.x = 351;
            finishPoint.y = 54;
        } else if (this.rewardObj.reward_type == "TICKET") {
            finishPoint.x = 529;
            finishPoint.y = 54;
        } else {
            finishPoint.x = 164;
            finishPoint.y = 54;
        }
        let reward = this.rewardObj.reward;
        if (this.is_watched_ads == 1) {
            reward = reward * 2;
        }
        ControllScreenDialog.instance().changeScreen(ConfigScreenName.ANIM_CLAIM_REWARD, {
            type: this.rewardObj.reward_type,
            reward: reward,
            finishPoint: finishPoint
        })
        this.timeTweenUpdateRs = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.updateVariableResource(this.rewardObj);
            this.timeTweenDispatchClaim = game.time.events.add(Phaser.Timer.SECOND * 1.5, () => {
                this.event.claimDone.dispatch();
                this.destroy();
            }, this);
        }, this);
    }
    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }
    //
    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.DAILY_REWARD_CLAIM_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.onClaimDailyDone();
            }
        }
    }

    updateVariableResource(reward) {
        if (reward.reward_type == "DIAMOND") {
            this.txtGem.setText(SocketController.instance().socket.mySelf.getVariable('diamond').value - reward.reward);
            let tweenVariable = game.add.tween(this.txtGem).to({ text: SocketController.instance().socket.mySelf.getVariable('diamond').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtGem.text = parseInt(this.txtGem.text);
            }, this);
        } else if (reward.reward_type == "TICKET") {
            this.txtTicket.setText(SocketController.instance().socket.mySelf.getVariable('ticket').value - reward.reward);
            let tweenVariable = game.add.tween(this.txtTicket).to({ text: SocketController.instance().socket.mySelf.getVariable('ticket').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtTicket.text = parseInt(this.txtTicket.text);
            }, this);
        } else if (reward.reward_type == "SUPPORT_ITEM") {
            this.txtMic.setText(SocketController.instance().socket.mySelf.getVariable('support_item').value - reward.reward);
            let tweenVariable = game.add.tween(this.txtMic).to({ text: SocketController.instance().socket.mySelf.getVariable('support_item').value }, 300, "Linear", false);
            tweenVariable.start();
            tweenVariable.onUpdateCallback(() => {
                this.txtMic.text = parseInt(this.txtMic.text);
            }, this);
        }
    }

    destroy() {
        this.removeEventExtension();
        this.popup.event.claimDailyReward.remove(this.onClaimDaily, this);
        game.time.events.remove(this.timeTweenDispatchClaim);
        game.time.events.remove(this.timeTweenDispatchClaim);
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}