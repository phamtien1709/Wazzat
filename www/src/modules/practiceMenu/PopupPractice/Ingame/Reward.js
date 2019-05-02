import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import SocketController from "../../../../controller/SocketController.js";
import SpriteBase from "../../../../view/component/SpriteBase.js";
import ButtonBase from "../../../../view/component/ButtonBase.js";
import TextBase from "../../../../view/component/TextBase.js";
import AnimClaimReward from "../../../menu/QuestAndAchievement/items/AnimClaimReward.js";
import IronSource from "../../../../IronSource.js";
import DataCommand from "../../../../common/DataCommand.js";
import MainData from "../../../../model/MainData.js";
import ControllDialog from "../../../../view/ControllDialog.js";
import SpriteScale9Base from "../../../../view/component/SpriteScale9Base.js";
import FacebookAction from "../../../../common/FacebookAction.js";
import Language from "../../../../model/Language.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class Reward extends BaseGroup {
    constructor(score, reward, rewardType) {
        super(game)
        // this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        // this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.rewardType = rewardType;
        this.score = score;
        this.reward = reward;
        this.isWatchRewardVideo = false;
        this.isWatchRewardVideoDone = false;
        this.signalNextQuestion = new Phaser.Signal();
        this.signalStop = new Phaser.Signal();
        this.signalClaim = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.addEventExtension();
        //
        this.timer = null;
        this.screenDim;
        this.tabGem;
        this.tabHeart;
        this.addScreenDim();
        // this.addGemAndHeart();
        //
        this.headerResource;
        this.addHeaderResource();
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
        this.addTabGemHeader(this.positionPracticePopupConfig.header);
        this.addTabTicketHeader(this.positionPracticePopupConfig.header);
        this.addTabMicHeader(this.positionPracticePopupConfig.header);
    }

    addTabGemHeader(configs) {
        this.tabGemHeader = new Phaser.Sprite(game, configs.tabGem.x * window.GameConfig.RESIZE, configs.tabGem.y * window.GameConfig.RESIZE, configs.tabGem.nameAtlas, configs.tabGem.nameSprite);
        //
        let gem = this.addGem(this.positionPracticePopupConfig.header.gem);
        this.txtGem = this.addTxtGem(this.positionPracticePopupConfig.header.txtResource);
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
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, configs.configs);
    }

    addTabTicketHeader(configs) {
        this.tabTicketHeader = new Phaser.Sprite(game, configs.tabTicket.x * window.GameConfig.RESIZE, configs.tabTicket.y * window.GameConfig.RESIZE, configs.tabTicket.nameAtlas, configs.tabTicket.nameSprite);
        //
        let ticket = this.addTicket(this.positionPracticePopupConfig.header.ticket);
        this.txtTicket = this.addTxtTicket(this.positionPracticePopupConfig.header.txtResource);
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
        return new Phaser.Text(game, configs.x * window.GameConfig.RESIZE, configs.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('ticket').value, configs.configs);
    }

    addTabMicHeader(configs) {
        this.tabMicHeader = new Phaser.Sprite(game, configs.tabMic.x * window.GameConfig.RESIZE, configs.tabMic.y * window.GameConfig.RESIZE, configs.tabMic.nameAtlas, configs.tabMic.nameSprite);
        //
        let mic = this.addMic(this.positionPracticePopupConfig.header.micro);
        this.txtMic = this.addTxtMic(this.positionPracticePopupConfig.header.txtResource);
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

    interstitialClosed() {
        this.tweenDestroy();
    }

    interstitialShowFailed() {
        this.tweenDestroy();

    }

    rewardedVideoEnded() {
        this.btnWatching.inputEnabled = true;
        this.btnContinue.inputEnabled = true;
    }

    rewardedVideoClosed() {
        this.btnWatching.inputEnabled = true;
        this.btnContinue.inputEnabled = true;
    }

    rewardedVideoRewardReceived() {
        this.isWatchRewardVideoDone = true;
        this.signalClaim.dispatch(1);
    }

    interstitialFailedToLoad() {
        this.tweenDestroy();
    }

    rewardedVideoFailed() {
        this.btnWatching.inputEnabled = true;
        this.btnContinue.inputEnabled = true;
    }

    addScreenDim() {
        this.screenDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.screenDim.inputEnabled = true;
        this.addChild(this.screenDim);
    }

    addPopup() {
        this.congraTxt;
        this.txtDetailReward;
        this.btnContinue;
        this.timeCountDown;
        this.txtTimeout;
        this.iconCircle;
        //
        let lineTop = new Phaser.Sprite(game, this.positionPracticePopupConfig.popup_confirm_top_bg.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.nameAtlas, this.positionPracticePopupConfig.popup_confirm_top_bg.nameSprite);
        //
        this.popup = new Phaser.Sprite(game, this.positionPracticePopupConfig.lineRewardPopup.x * window.GameConfig.RESIZE, 1140 * window.GameConfig.RESIZE, null);
        this.popup.addChild(lineTop);
        //
        let configs = {
            "x": 0,
            "y": 0,
            "nameAtlas": "defaultSource",
            "nameSprite": "bg_nhaptext",
            "left": 30,
            "right": 30,
            "top": 30,
            "bot": 30,
            "width": 570,
            "height": 490,
            "name": "choose_game_bg_input_text"
        }
        if (SocketController.instance().dataMySeft.vip === true) {
            configs = {
                "x": 0,
                "y": 0,
                "nameAtlas": "defaultSource",
                "nameSprite": "bg_nhaptext",
                "left": 30,
                "right": 30,
                "top": 30,
                "bot": 30,
                "width": 570,
                "height": 380,
                "name": "choose_game_bg_input_text"
            }
        }
        let fundametal = new SpriteScale9Base(configs);
        this.popup.addChild(fundametal);
        //
        let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, this.positionPracticePopupConfig.rewardPopup.nameSprite);
        // popup.scale.set(1, 640 / 589);
        this.popup.addChild(boxPopup);
        this.addChild(this.popup);
        //
        this.addCongraTxt();
        this.addTxtDetailReward();
        this.addBtnContinue();
        this.addIconCircle();
        this.addBtnWatch();
        this.addBtnShare();
        this.checkDevice();
    }

    checkDevice() {
        if (window.cordova && typeof device !== 'undefined') {

        } else {
            if (this.btnWatching) {
                this.btnWatching.inputEnabled = false;
            }
        }
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.getrewardsolomode);
        let tween = game.add.tween(this.popup).to({ y: (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPracticePopupConfig.lineRewardPopup.y) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
        tween.onComplete.add(() => {

        }, this);
        this.timeAnimGem = game.time.events.add(Phaser.Timer.SECOND * 0.5, () => {
            this.addAnimGem();
        }, this);
    }

    addCongraTxt() {
        this.congraTxt = new Phaser.Text(game, this.positionPracticePopupConfig.congrat_txt_reward.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.congrat_txt_reward.y * window.GameConfig.RESIZE, Language.instance().getData("238"), this.positionPracticePopupConfig.congrat_txt_reward.configs);
        this.congraTxt.anchor.set(0.5, 0);
        this.popup.addChild(this.congraTxt);
    }

    addTxtDetailReward() {
        this.txtDetailReward = new Phaser.Text(game, this.positionPracticePopupConfig.txt_detail_reward.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_detail_reward.y * window.GameConfig.RESIZE, `${Language.instance().getData("239")} ${this.score} ${Language.instance().getData("240")}`, this.positionPracticePopupConfig.txt_detail_reward.configs);
        this.txtDetailReward.anchor.set(0.5, 0);
        this.txtDetailReward.addColor('#ffa33a', Language.instance().getData("239").length);
        this.txtDetailReward.addColor('#333333', Language.instance().getData("239").length + 3);
        this.popup.addChild(this.txtDetailReward);
    }

    addBtnContinue() {
        if (SocketController.instance().dataMySeft.vip === true) {
            this.btnContinue = new Phaser.Sprite(game, this.positionPracticePopupConfig.btn_continue_reward_vip.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward_vip.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward_vip.nameAtlas, this.positionPracticePopupConfig.btn_continue_reward_vip.nameSprite);
            this.btnContinue.anchor.set(0.5, 0);
            let txtBtn = new Phaser.Text(game, this.positionPracticePopupConfig.txt_btn_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_btn_continue.y * window.GameConfig.RESIZE, Language.instance().getData("105"), this.positionPracticePopupConfig.txt_btn_continue.configs);
            txtBtn.anchor.set(0.5, 0);
            this.btnContinue.inputEnabled = true;
            this.btnContinue.events.onInputUp.add(this.onClickContinue, this);
            this.btnContinue.addChild(txtBtn);
            this.popup.addChild(this.btnContinue);
        } else {
            this.btnContinue = new Phaser.Sprite(game, this.positionPracticePopupConfig.btn_continue_reward.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward.nameAtlas, this.positionPracticePopupConfig.btn_continue_reward.nameSprite);
            this.btnContinue.anchor.set(0.5, 0);
            let txtBtn = new Phaser.Text(game, this.positionPracticePopupConfig.txt_btn_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_btn_continue.y * window.GameConfig.RESIZE, Language.instance().getData("105"), this.positionPracticePopupConfig.txt_btn_continue.configs);
            txtBtn.anchor.set(0.5, 0);
            this.btnContinue.inputEnabled = true;
            this.btnContinue.events.onInputUp.add(this.onClickContinue, this);
            this.btnContinue.addChild(txtBtn);
            this.popup.addChild(this.btnContinue);
        }
    }

    addBtnShare() {
        this.btnShare = new Phaser.Sprite(game, this.positionPracticePopupConfig.btn_fb_share.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_fb_share.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_fb_share.nameAtlas, this.positionPracticePopupConfig.btn_fb_share.nameSprite);
        this.btnShare.anchor.set(0.5, 0);
        this.btnShare.inputEnabled = true;
        this.btnShare.events.onInputUp.add(this.onClickShare, this);
        if (Language.instance().currentLanguage == "en") {
            let txtBtn = new Phaser.Text(game, -18, 30, "SHARE", {
                "font": "GilroyBold",
                "fill": "white",
                "align": "center",
                "fontSize": 28
            })
            this.btnShare.addChild(txtBtn);
        } else {
            let txtBtn = new Phaser.Text(game, -18, 30, "CHIA SẺ", {
                "font": "GilroyBold",
                "fill": "white",
                "align": "center",
                "fontSize": 28
            })
            this.btnShare.addChild(txtBtn);
        }
        this.popup.addChild(this.btnShare);
    }

    onClickShare() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // FacebookAction.instance().event.share.add(this.onShared, this);
        FacebookAction.instance().share();
    }

    onShared() {

    }

    addIconCircle() {
        this.iconCircle = new Phaser.Sprite(game, this.positionPracticePopupConfig.icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.icon_gem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.icon_gem.nameAtlas, this.positionPracticePopupConfig.icon_gem.nameSprite);
        this.iconCircle.anchor.set(0.5);
        game.time.events.loop(10, this.animationUpdateCircle, this);
        this.popup.addChild(this.iconCircle);
        if (SocketController.instance().dataMySeft.vip === true) {
            let txtReward = new Phaser.Text(game, this.positionPracticePopupConfig.reward_icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.reward_icon_gem.y * window.GameConfig.RESIZE, `+${parseInt(this.reward) * 2}`, this.positionPracticePopupConfig.reward_icon_gem.configs);
            txtReward.anchor.set(0.5, 0);
            this.popup.addChild(txtReward);
        } else {
            let txtReward = new Phaser.Text(game, this.positionPracticePopupConfig.reward_icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.reward_icon_gem.y * window.GameConfig.RESIZE, `+${this.reward}`, this.positionPracticePopupConfig.reward_icon_gem.configs);
            txtReward.anchor.set(0.5, 0);
            this.popup.addChild(txtReward);
        }
    }

    animationUpdateCircle() {
        this.iconCircle.angle += 3;
    }

    addAnimGem() {
        if (this.rewardType == "DIAMOND") {
            this.sSGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.anim_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.nameSprite);
            this.sSGem.anchor.set(0.5);
            this.animGem = this.sSGem.animations.add('animGemReward');
            this.animGem.enableUpdate = true;
            this.animGem.onUpdate.add(this.onUpdateGemReward, this);
            this.animGem.play(35, false, false);
            this.popup.addChild(this.sSGem);
        } else if (this.rewardType == "TICKET") {
            this.sSGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.anim_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.y * window.GameConfig.RESIZE, 'rewardTicketSoloMode');
            this.sSGem.anchor.set(0.5);
            this.animGem = this.sSGem.animations.add('animTicketReward');
            this.animGem.enableUpdate = true;
            this.animGem.onUpdate.add(this.onUpdateGemReward, this);
            this.animGem.play(35, false, false);
            this.popup.addChild(this.sSGem);
        } else if (this.rewardType == "SUPPORT_ITEM") {
            this.sSGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.anim_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.y * window.GameConfig.RESIZE, 'rewardSptSoloMode');
            this.sSGem.anchor.set(0.5);
            this.animGem = this.sSGem.animations.add('animSptReward');
            this.animGem.enableUpdate = true;
            this.animGem.onUpdate.add(this.onUpdateGemReward, this);
            this.animGem.play(35, false, false);
            this.popup.addChild(this.sSGem);
        }
    }

    onUpdateGemReward(anim, frame) {
        if (frame.index === 53) {
            anim.frame = 37;
        }
    }

    onClickContinue() {
        this.isWatchRewardVideo = false;
        if (this.btnWatching) {
            this.btnWatching.inputEnabled = false;
        }
        this.btnContinue.inputEnabled = false;
        this.signalStop.dispatch();
        this.signalClaim.dispatch(0);
        //
    }

    makeAnimWhenClaimed() {
        //
        let reward = this.reward;
        if (this.isWatchRewardVideo == true) {
            reward = reward * 2;
        }
        else if (SocketController.instance().dataMySeft.vip === true) {
            reward = reward * 2;
        }
        //
        var finishPoint = {
            x: 0,
            y: 0
        };
        if (this.rewardType == "DIAMOND") {
            finishPoint.x = 351;
            finishPoint.y = 55;
        } else if (this.rewardType == "TICKET") {
            finishPoint.x = 529;
            finishPoint.y = 55;
        } else {
            finishPoint.x = 164;
            finishPoint.y = 55;
        }
        //
        let animClaim = new AnimClaimReward(this.rewardType, reward, finishPoint)
        this.addChild(animClaim);
        if (this.rewardType == "DIAMOND") {
            //
            let tweenRsr = game.add.tween(this.txtGem).to({ text: SocketController.instance().socket.mySelf.getVariable('diamond').value }, 300, "Linear", false);
            this.tweenTxtRsr(tweenRsr, this.txtGem);
        } else if (this.rewardType == "TICKET") {
            //
            let tweenRsr = game.add.tween(this.txtTicket).to({ text: SocketController.instance().socket.mySelf.getVariable('ticket').value }, 300, "Linear", false);
            this.tweenTxtRsr(tweenRsr, this.txtTicket);
        } else {
            //
            let tweenRsr = game.add.tween(this.txtMic).to({ text: SocketController.instance().socket.mySelf.getVariable('support_item').value }, 300, "Linear", false);
            this.tweenTxtRsr(tweenRsr, this.txtMic);
        }
    }

    tweenTxtRsr(tween, txt) {
        this.timeStartTween = game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            tween.start();
        }, this);
        tween.onUpdateCallback(() => {
            // LogConsole.log('vao');
            txt.text = parseInt(txt.text);
        }, this);
        tween.onComplete.add(() => {
            //TODO: addADS
            if (window.cordova && typeof device !== 'undefined') {
                if (this.isWatchRewardVideo == true) {
                    this.tweenDestroy();
                } else {
                    this.tweenDestroy();
                }
            } else {
                this.tweenDestroy();
            }
        }, this);
    }

    tweenDestroy() {
        //
        let tween = game.add.tween(this.popup).to({ y: -1200 * window.GameConfig.RESIZE }, 200, "Linear", false);
        this.timeTweenDestroy = game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            tween.start();
        }, this)
        tween.onComplete.add(() => {
            this.signalNextQuestion.dispatch();
            this.destroy();
        }, this);
    }

    addBtnWatch() {
        if (SocketController.instance().dataMySeft.vip === true) {

        } else {
            this.btnWatching = new ButtonBase(this.positionPracticePopupConfig.btn_watch_video_reward, this.onClickWatching, this);
            this.btnWatching.anchor.set(0.5, 0);
            let cam = new SpriteBase(this.positionPracticePopupConfig.btn_watch_video_reward.camera);
            this.btnWatching.addChild(cam);
            let txt1 = new TextBase(this.positionPracticePopupConfig.btn_watch_video_reward.txt1, Language.instance().getData("191"));
            txt1.anchor.set(0.5, 0);
            txt1.x = 0;
            let txt2 = new TextBase(this.positionPracticePopupConfig.btn_watch_video_reward.txt2, Language.instance().getData("190"));
            txt2.x = cam.x - txt2.width - 4;
            this.btnWatching.addChild(txt1);
            this.btnWatching.addChild(txt2);
            this.popup.addChild(this.btnWatching);
            //
            // if (MainData.instance().platform === "ios") {
            this.btnWatching.inputEnabled = false;
            this.btnWatching.alpha = 0.5;
            // }
        }
    }

    onClickWatching() {
        this.isWatchRewardVideo = true;
        this.btnWatching.inputEnabled = false;
        this.btnContinue.inputEnabled = false;
        this.signalStop.dispatch();
        IronSource.instance().showRewardVideoX2DiamondSoloMode();
    }

    addTimeCountDown(timeCountDownThisWeekPractice) {
        this.timeCountDownThisWeekPractice = timeCountDownThisWeekPractice;
        this.timeCounter = new Phaser.Text(game, this.positionRankingConfig.txt_timeCounter.x * window.GameConfig.RESIZE, this.positionRankingConfig.txt_timeCounter.y * window.GameConfig.RESIZE, this.positionRankingConfig.txt_timeCounter.text, this.positionRankingConfig.txt_timeCounter.configs);
        this.timer = game.time.create(false);
        this.timer.loop(1000, this.handleTimer, this);
        this.timer.start();
        this.addChild(this.timeCounter);
    }

    handleTimer() {
        if (this.timeCountDown > 0) {
            this.timeCountDown--;
            this.txtTimeout.setText(`( ${this.timeCountDown} )`);
        }
        if (this.timeCountDown == 0) {
            this.signalNextQuestion.dispatch();
            this.destroy();
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        IronSource.instance().event.rewardedVideoRewardReceived.add(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.interstitialClosed.add(this.interstitialClosed, this);
        IronSource.instance().event.rewardedVideoEnded.add(this.rewardedVideoEnded, this);
        IronSource.instance().event.rewardedVideoClosed.add(this.rewardedVideoClosed, this);
        IronSource.instance().event.interstitialFailedToLoad.add(this.interstitialFailedToLoad, this);
        IronSource.instance().event.rewardedVideoFailed.add(this.rewardedVideoFailed, this);
        IronSource.instance().event.interstitialShowFailed.add(this.interstitialShowFailed, this);
        FacebookAction.instance().event.share.add(this.onShared, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        IronSource.instance().event.rewardedVideoRewardReceived.remove(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.interstitialClosed.remove(this.interstitialClosed, this);
        IronSource.instance().event.rewardedVideoEnded.remove(this.rewardedVideoEnded, this);
        IronSource.instance().event.rewardedVideoClosed.remove(this.rewardedVideoRewardReceived, this);
        IronSource.instance().event.interstitialFailedToLoad.remove(this.interstitialFailedToLoad, this);
        IronSource.instance().event.interstitialShowFailed.remove(this.interstitialShowFailed, this);
        IronSource.instance().event.rewardedVideoFailed.remove(this.rewardedVideoFailed, this);
        FacebookAction.instance().event.share.remove(this.onShared, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SOLO_MODE_GOT_REWARD_RESPONSE) {
            LogConsole.log(evtParams.params.getDump());
            if (evtParams.params.getUtfString('status') == "OK") {
                this.makeAnimWhenClaimed();
            }
        }
    }

    destroy() {
        this.removeEventExtension();
        game.time.events.remove(this.timeAnimGem);
        game.time.events.remove(this.timeStartTween);
        game.time.events.remove(this.timeTweenDestroy);
        if (this.timer !== null) {
            this.timer.stop();
            this.timer.destroy();
            this.timer = null;
        }
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