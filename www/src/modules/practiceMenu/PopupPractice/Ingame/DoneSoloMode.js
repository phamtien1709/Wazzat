import SoloModeDiamondRewardMoveToTop from "../../../../view/items/SoloModeDiamondRewardMoveToTop.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import SocketController from "../../../../controller/SocketController.js";
import SpriteBase from "../../../../view/component/SpriteBase.js";
import TextBase from "../../../../view/component/TextBase.js";
import ButtonBase from "../../../../view/component/ButtonBase.js";
import DataCommand from "../../../../common/DataCommand.js";
import MainData from "../../../../model/MainData.js";
import IronSource from "../../../../IronSource.js";
import FacebookAction from "../../../../common/FacebookAction.js";
import Language from "../../../../model/Language.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class DoneSoloMode extends BaseGroup {
    constructor(score, reward, playlist) {
        super(game)
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.score = score;
        this.reward = reward;
        this.playlist = playlist;
        this.isWatchRewardVideo = false;
        this.isWatchRewardVideoDone = false;
        this.event = {
            goHome: new Phaser.Signal(),
            getRank: new Phaser.Signal(),
            claim: new Phaser.Signal(),
            stopSong: new Phaser.Signal()
        };
        this.targetTween = this.positionPracticePopupConfig.lineRewardPopup.y;
        this.afterInit();
    }

    afterInit() {
        this.timer = null;
        this.screenDim;
        this.tabGem;
        this.tabHeart;
        this.addScreenDim();
        this.addGemAndHeart();
        this.addEventExtension();
    }

    interstitialClosed() {
        this.tweenDestroy();
    }

    interstitialShowFailed() {
        this.tweenDestroy();

    }

    rewardedVideoEnded() {

    }

    rewardedVideoClosed() {

    }

    rewardedVideoRewardReceived() {
        this.isWatchRewardVideoDone = true;
        this.event.claim.dispatch(1);
    }

    interstitialFailedToLoad() {
        this.tweenDestroy();
    }

    rewardedVideoFailed() {
        this.btnClaimNotWatch.inputEnabled = true;
        this.btnWatching.inputEnabled = true;
    }

    addScreenDim() {
        this.screenDim = new Phaser.Sprite(game, 0, 0, 'screen-dim');
        this.screenDim.inputEnabled = true;
        this.addChild(this.screenDim);
    }

    addGemAndHeart() {
        this.tabGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabGem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGem.nameAtlas, this.positionPracticePopupConfig.tabGem.nameSprite);
        this.addGemDetail();
        this.addChild(this.tabGem);
        this.tabHeart = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabHeart.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeart.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeart.nameAtlas, this.positionPracticePopupConfig.tabHeart.nameSprite);
        this.addHeartDetail();
        this.addChild(this.tabHeart);
    }

    addGemDetail() {
        let gem;
        this.txtGemReceived;
        gem = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.gem_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.gem_reward.nameAtlas, this.positionPracticePopupConfig.gem_reward.nameSprite);
        this.txtGemReceived = new Phaser.Text(game, 0, this.positionPracticePopupConfig.gem_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, this.positionPracticePopupConfig.gem_reward_txt.configs);
        let sumWidth = gem.width + this.txtGemReceived.width;
        this.txtGemReceived.x = ((this.tabGem.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGem.width - sumWidth) / 2) + this.txtGemReceived.width + 10 * window.GameConfig.RESIZE;
        this.tabGem.addChild(gem);
        this.tabGem.addChild(this.txtGemReceived);
    }

    addHeartDetail() {
        let heart;
        let txtHeart;
        heart = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.heart_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.heart_reward.nameAtlas, this.positionPracticePopupConfig.heart_reward.nameSprite);
        txtHeart = new Phaser.Text(game, 0, this.positionPracticePopupConfig.heart_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value, this.positionPracticePopupConfig.heart_reward_txt.configs);
        let sumWidth = heart.width + txtHeart.width;
        txtHeart.x = ((this.tabHeart.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        heart.x = ((this.tabHeart.width - sumWidth) / 2) + txtHeart.width + 10 * window.GameConfig.RESIZE;
        this.tabHeart.addChild(heart);
        this.tabHeart.addChild(txtHeart);
    }

    addPopup() {
        this.congraTxt;
        this.txtDetailReward;
        this.btnClaimNotWatch;
        this.timeCountDown;
        this.txtTimeout;
        this.iconGem;
        //
        let lineTop = new Phaser.Sprite(game, this.positionPracticePopupConfig.popup_confirm_top_bg.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.nameAtlas, this.positionPracticePopupConfig.popup_confirm_top_bg.nameSprite);
        //
        this.popup = new Phaser.Sprite(game, this.positionPracticePopupConfig.lineRewardPopup.x * window.GameConfig.RESIZE, 1140 * window.GameConfig.RESIZE, null);
        this.popup.addChild(lineTop);
        //
        if (this.reward == 0) {
            let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, this.positionPracticePopupConfig.rewardPopup.nameSprite);
            // popup.scale.set(1, 640 / 589);
            this.popup.addChild(boxPopup);
        } else {
            if (SocketController.instance().dataMySeft.vip === true) {
                let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, 'Box');
                boxPopup.scale.set(1, 453 / 593);
                let childBox = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, this.positionPracticePopupConfig.rewardPopup.nameSprite);
                this.popup.addChild(boxPopup);
                this.popup.addChild(childBox);
            } else {
                let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, 'Box');
                boxPopup.scale.set(1, 567 / 593);
                let childBox = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, this.positionPracticePopupConfig.rewardPopup.nameSprite);
                this.popup.addChild(boxPopup);
                this.popup.addChild(childBox);
            }
        }
        this.addChild(this.popup);
        //
        this.addCongraTxt();
        this.addTxtDetailReward();
        this.addIconCircle();
        this.addBtnShare();
        this.addBtnHome();
        this.addBtnRank();
        this.addFireWork();
        if (this.reward !== 0) {
            this.addBtnClaim();
            this.addBtnWatch();
            this.moveChildOfPopup();
            this.checkDevice();
        } else {
            IronSource.instance().showInterstitialDoneSoloMode();
            this.changePosChild();
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
        FacebookAction.instance().share();
    }

    onShared() {

    }

    checkDevice() {
        if (window.cordova && typeof device !== 'undefined') {

        } else {
            if (this.btnWatching) {
                this.btnWatching.inputEnabled = false;
            }
        }
    }


    moveChildOfPopup() {
        this.targetTween -= 70;
        this.congraTxt.y += 70;
        this.txtDetailReward.y += 70;
        this.btnShare.y += 70;
        this.btnRank.y += 70;
    }

    changePosChild() {
        this.btnRank.revive();
        this.btnShare.kill();
        this.btnHome.revive();
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.getrewardsolomode);
        let tween = game.add.tween(this.popup).to({ y: (game.height - MainData.instance().STANDARD_HEIGHT + this.targetTween) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            if (this.reward !== 0) {
                this.addAnimGem();
            }
        }, this);
    }

    addGemFly() {
        if (SocketController.instance().dataMySeft.vip === true) {
            this.gemIcon = new SoloModeDiamondRewardMoveToTop(this.reward * 2);
            this.gemIcon.event.tweenGemPls.add(this.tweenGemPls, this);
            this.addChild(this.gemIcon);
        } else {
            this.gemIcon = new SoloModeDiamondRewardMoveToTop(this.reward);
            this.gemIcon.event.tweenGemPls.add(this.tweenGemPls, this);
            this.addChild(this.gemIcon);
        }
    }

    addAnimGem() {
        this.sSGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.anim_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.anim_gem.nameSprite);
        this.sSGem.anchor.set(0.5);
        this.animGem = this.sSGem.animations.add('animGemReward');
        this.animGem.enableUpdate = true;
        this.animGem.onUpdate.add(this.onUpdateGemReward, this);
        this.animGem.play(35, false, false);
        this.popup.addChild(this.sSGem);
    }

    onUpdateGemReward(anim, frame) {
        if (frame.index === 58) {
            anim.frame = 42;
        }
    }

    tweenGemPls() {
        let tweenScore = game.add.tween(this.txtGemReceived).to({ text: SocketController.instance().dataMySeft.diamond }, 1000, "Linear", false);
        tweenScore.start();
        tweenScore.onUpdateCallback(() => {
            this.txtGemReceived.text = parseInt(this.txtGemReceived.text);
        }, this);
        tweenScore.onComplete.add(() => {
            this.event.goHome.dispatch();
        });
    }

    addCongraTxt() {
        this.congraTxt = new Phaser.Text(game, this.positionPracticePopupConfig.congrat_txt_reward.x * window.GameConfig.RESIZE, 70 * window.GameConfig.RESIZE, Language.instance().getData("238"), this.positionPracticePopupConfig.congrat_txt_reward.configs);
        this.congraTxt.anchor.set(0.5, 0);
        this.popup.addChild(this.congraTxt);
    }

    addTxtDetailReward() {
        this.txtDetailReward = new Phaser.Text(game, this.positionPracticePopupConfig.txt_detail_reward.x * window.GameConfig.RESIZE, 135 * window.GameConfig.RESIZE, `${Language.instance().getData("241")} ${this.playlist.name}`, {
            "font": "GilroyMedium",
            "fill": "#333333",
            "align": "center",
            "wordWrap": true,
            "wordWrapWidth": 450,
            "fontSize": 24
        });
        this.txtDetailReward.anchor.set(0.5, 0);
        this.txtDetailReward.addColor('#ffa33a', 45);
        this.popup.addChild(this.txtDetailReward);
    }

    addIconCircle() {
        if (this.reward !== 0) {
            this.iconCircle = new Phaser.Sprite(game, this.positionPracticePopupConfig.icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.icon_gem.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.icon_gem.nameAtlas, this.positionPracticePopupConfig.icon_gem.nameSprite);
            this.iconCircle.anchor.set(0.5);
            this.popup.addChild(this.iconCircle);
            //
            if (SocketController.instance().dataMySeft.vip === true) {
                let txtReward = new Phaser.Text(game, this.positionPracticePopupConfig.reward_icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.reward_icon_gem.y * window.GameConfig.RESIZE, `+${parseInt(this.reward) * 2}`, this.positionPracticePopupConfig.reward_icon_gem.configs);
                txtReward.anchor.set(0.5, 0);
                game.time.events.loop(10, this.animationUpdateCircle, this);
                this.popup.addChild(txtReward);
            } else {
                let txtReward = new Phaser.Text(game, this.positionPracticePopupConfig.reward_icon_gem.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.reward_icon_gem.y * window.GameConfig.RESIZE, `+${this.reward}`, this.positionPracticePopupConfig.reward_icon_gem.configs);
                txtReward.anchor.set(0.5, 0);
                game.time.events.loop(10, this.animationUpdateCircle, this);
                this.popup.addChild(txtReward);
            }
        }
    }

    animationUpdateCircle() {
        this.iconCircle.angle += 3;
    }

    addBtnHome() {
        this.btnHome = new Phaser.Button(game, 33 * window.GameConfig.RESIZE, 265 * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_home_practice56.nameAtlas, this.onClickHome, this, null, this.positionPracticePopupConfig.btn_home_practice56.nameSprite);
        if (this.reward !== 0) {
            this.btnHome.inputEnabled = false;
            this.btnHome.alpha = 0.5;
        }
        this.popup.addChild(this.btnHome);
        this.btnHome.kill();
    }

    onClickHome() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.goHome.dispatch();
        this.destroy();
    }

    addBtnRank() {
        this.btnFoundametal = new Phaser.Sprite(game, 149 * window.GameConfig.RESIZE, 265 * window.GameConfig.RESIZE, null);
        this.btnRank = new Phaser.Button(game, 0, 0, this.positionPracticePopupConfig.btn_rank_practice56.nameAtlas, this.onClickRank, this, null, this.positionPracticePopupConfig.btn_rank_practice56.nameSprite);
        //
        let icon = new SpriteBase(this.positionPracticePopupConfig.icon_rank);
        this.btnRank.addChild(icon);
        let txtIconRank = new TextBase(this.positionPracticePopupConfig.txt_icon_rank, Language.instance().getData("235"));
        this.btnRank.addChild(txtIconRank);
        // this.btnRank.anchor.set(0.5);
        let animBtnRank = new Phaser.Sprite(game, 80 * window.GameConfig.RESIZE, 11 * window.GameConfig.RESIZE, 'btnRankAnim');
        this.btnRank.addChild(animBtnRank);
        let runRankAnim = animBtnRank.animations.add('run_rank');
        animBtnRank.animations.play('run_rank', 26, true);
        //
        this.btnFoundametal.addChild(this.btnRank);
        this.popup.addChild(this.btnFoundametal);
        this.btnRank.kill();
        //
    }

    onClickRank() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.getRank.dispatch();
    }

    addBtnClaim() {
        this.btnClaimNotWatch = new Phaser.Sprite(game, this.positionPracticePopupConfig.btn_continue_reward56.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward56.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue_reward56.nameAtlas, this.positionPracticePopupConfig.btn_continue_reward56.nameSprite);
        this.btnClaimNotWatch.anchor.set(0.5, 0);
        let txtBtn = new Phaser.Text(game, this.positionPracticePopupConfig.txt_btn_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_btn_continue.y * window.GameConfig.RESIZE, "NHẬN", this.positionPracticePopupConfig.txt_btn_continue.configs);
        txtBtn.anchor.set(0.5, 0);
        this.btnClaimNotWatch.inputEnabled = true;
        this.btnClaimNotWatch.events.onInputUp.add(this.onClickClaim, this);
        this.btnClaimNotWatch.addChild(txtBtn);
        this.popup.addChild(this.btnClaimNotWatch);
    }

    onClickClaim() {
        this.isWatchRewardVideo = false;
        this.btnClaimNotWatch.inputEnabled = false;
        if (this.btnWatching) {
            this.btnWatching.inputEnabled = false;
        }
        this.event.stopSong.dispatch();
        this.event.claim.dispatch(0);
    }

    addBtnWatch() {
        if (SocketController.instance().dataMySeft.vip === true) {

        } else {
            this.btnWatching = new ButtonBase(this.positionPracticePopupConfig.btn_watch_video_reward56, this.onClickWatching, this);
            this.btnWatching.anchor.set(0.5, 0);
            let cam = new SpriteBase(this.positionPracticePopupConfig.btn_watch_video_reward56.camera);
            this.btnWatching.addChild(cam);
            let txt1 = new TextBase(this.positionPracticePopupConfig.btn_watch_video_reward56.txt1, Language.instance().getData("191"));
            txt1.anchor.set(0.5, 0);
            txt1.x = 0;
            let txt2 = new TextBase(this.positionPracticePopupConfig.btn_watch_video_reward56.txt2, Language.instance().getData("190"));
            txt2.x = cam.x - txt2.width - 4;
            this.btnWatching.addChild(txt1);
            this.btnWatching.addChild(txt2);
            this.popup.addChild(this.btnWatching);
            //
            // if (MainData.instance().platform !== "web") {
            this.btnWatching.inputEnabled = false;
            this.btnWatching.alpha = 0.5;
            // }
        }
    }

    onClickWatching() {
        this.isWatchRewardVideo = true;
        this.btnClaimNotWatch.inputEnabled = false;
        if (this.btnWatching) {
            this.btnWatching.inputEnabled = false;
        }
        this.event.stopSong.dispatch();
        // ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        IronSource.instance().showRewardVideoX2DiamondSoloMode();
    }

    addFireWork() {
        var winAnim = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 350 * window.GameConfig.RESIZE, 'firework');
        winAnim.anchor.set(0.5);
        winAnim.scale.set(1);
        this.addChild(winAnim);
        var runSSWin = winAnim.animations.add('run_win');
        winAnim.animations.play('run_win', 40, true);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SOLO_MODE_GOT_REWARD_RESPONSE) {
            LogConsole.log(evtParams.params.getDump());
            if (evtParams.params.getUtfString('status') == "OK") {
                this.addGemFly();
                this.btnClaimNotWatch.alpha = 0.5;
                if (this.btnWatching) {
                    this.btnWatching.alpha = 0.5;
                }
                this.btnHome.inputEnabled = true;
                this.btnHome.alpha = 1;
            }
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
        FacebookAction.instance().event.share.remove(this.onShared, this);
    }

    destroy() {
        this.removeEventExtension();
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