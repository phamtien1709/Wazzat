import PopupBg from "../../../../view/popup/item/PopupBg.js";
import TextBase from "../../../../view/component/TextBase.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../../FaceBookCheckingTools.js";
import StarsAchievement from "../items/StarsAchievement.js";
import Language from "../../../../model/Language.js";
import ControllLoadCacheUrl from "../../../../view/component/ControllLoadCacheUrl.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class AchievementClaimPopup extends BaseGroup {
    constructor(achievement) {
        super(game)
        // let achievementDemo = {
        //     // is_done: true,
        //     medal: "https://yanadmin.gamezoka.com/storage/assets/medal/achievement/16_Giaosuamnhac.png",
        //     reward: 300,
        //     reward_type: "DIAMOND",
        //     title: "Giáo sư âm nhạc",
        //     new_level: 5
        // }
        this.achievement = achievement;
        this.positionQAndAConfig = JSON.parse(game.cache.getText('positionQAndAConfig'));
        this.eventInput = {
            claim: new Phaser.Signal()
        };
        this.afterInit();
    }

    afterInit() {
        this.screenDim;
        this.popup;
        this.addScreenDim();
        this.addPopup();
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

    addPopup() {
        this.txtPopup;
        this.rewardClaimed;
        this.txtQuestReward;
        this.btnClaim;
        this.medal;
        this.congraTxt;
        this.popup = new PopupBg();
        this.popup.x = 35 * window.GameConfig.RESIZE;
        this.popup.y = 1500 * window.GameConfig.RESIZE;
        this.popup.setHeight(486 * window.GameConfig.RESIZE);
        this.addChild(this.popup);
        this.addTxtPopup();
        this.addCongraTxt();
        this.addRewardClaimed();
        this.addAchievementTitle();
        this.addBtnClaim();
        this.addMedal();
        this.addFireWork();
        this.loadMedal(this.achievement.medal);
        this.addStars();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Popup_Achievement);
        //
    }

    addStars() {
        this.stars = new StarsAchievement(285, -125, this.achievement.new_level, 1);
        this.popup.addChild(this.stars);
    }

    addTxtPopup() {
        this.txtPopup = new Phaser.Text(game, this.positionQAndAConfig.achievement.txtPopupClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.txtPopupClaim.y * window.GameConfig.RESIZE, Language.instance().getData("273"), this.positionQAndAConfig.achievement.txtPopupClaim.configs);
        this.txtPopup.anchor.set(0.5, 0);
        let txtDetail = new TextBase(this.positionQAndAConfig.achievement.txt_phan_thuonng, Language.instance().getData("233"));
        txtDetail.anchor.set(0.5, 0);
        this.popup.addChild(txtDetail);
        this.popup.addChild(this.txtPopup);
    }

    addCongraTxt() {
        this.congraTxt = new Phaser.Text(game, this.positionQAndAConfig.achievement.congrat_txt_reward.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.congrat_txt_reward.y * window.GameConfig.RESIZE, Language.instance().getData("238"), this.positionQAndAConfig.achievement.congrat_txt_reward.configs);
        this.congraTxt.anchor.set(0.5, 0);
        this.popup.addChild(this.congraTxt);
    }

    addRewardClaimed() {
        this.rewardClaimed = new Phaser.Text(game, this.positionQAndAConfig.achievement.rewardClaimed.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.rewardClaimed.y * window.GameConfig.RESIZE, this.achievement.reward, this.positionQAndAConfig.achievement.rewardClaimed.configs);
        //
        if (this.achievement.reward_type == "DIAMOND") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.gemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.gemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.gemClaim.nameAtlas, this.positionQAndAConfig.achievement.gemClaim.nameSprite);
            gem.scale.set(1.2);
        } else if (this.achievement.reward_type == "TICKET") {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.ticketClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.ticketClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.ticketClaim.nameAtlas, this.positionQAndAConfig.achievement.ticketClaim.nameSprite);
            gem.scale.set(1.2);
        } else {
            var gem = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.sptItemClaim.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.sptItemClaim.y * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.sptItemClaim.nameAtlas, this.positionQAndAConfig.achievement.sptItemClaim.nameSprite);
            gem.scale.set(1.2);
        }
        //
        let sumWidth = this.rewardClaimed.width + gem.width;
        this.rewardClaimed.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((570 * window.GameConfig.RESIZE - sumWidth) / 2) + this.rewardClaimed.width + 5 * window.GameConfig.RESIZE;
        //
        this.popup.addChild(this.rewardClaimed);
        this.popup.addChild(gem);
    }

    addAchievementTitle() {
        this.txtQuestReward = new Phaser.Text(game, this.positionQAndAConfig.achievement.achievement_title.x * window.GameConfig.RESIZE, this.positionQAndAConfig.achievement.achievement_title.y * window.GameConfig.RESIZE, `${this.achievement.title} ${this.achievement.new_level}`, this.positionQAndAConfig.achievement.achievement_title.configs);
        this.txtQuestReward.anchor.set(0.5, 0);
        this.popup.addChild(this.txtQuestReward);
    }

    addBtnClaim() {
        this.btnClaim = new Phaser.Sprite(game, 285 * window.GameConfig.RESIZE, 385 * window.GameConfig.RESIZE, "practicePopupSprites", "Button_Tiep_Tuc");
        this.btnClaim.anchor.set(0.5, 0);
        let txt = new Phaser.Text(game, 0, 21 * window.GameConfig.RESIZE, Language.instance().getData("189"), {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 31
        });
        txt.anchor.set(0.5, 0);
        this.btnClaim.addChild(txt);
        this.btnClaim.inputEnabled = true;
        this.btnClaim.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            let tween = game.add.tween(this.popup).to({ y: -420 * window.GameConfig.RESIZE }, 200, Phaser.Easing.Linear.Out, false);
            tween.start();
            tween.onComplete.add(() => {
                this.eventInput.claim.dispatch();
                this.destroy();
            }, this);
        }, this);
        this.popup.addChild(this.btnClaim);
    }

    addMedal() {
        this.medal = new Phaser.Sprite(game, this.positionQAndAConfig.achievement.medal_popup.x, this.positionQAndAConfig.achievement.medal_popup.y, this.positionQAndAConfig.achievement.medal_popup.nameAtlas, this.positionQAndAConfig.achievement.medal_popup.nameSprite);
        this.medal.anchor.set(0.5);
        this.medal.scale.set(0.6);
        this.popup.addChild(this.medal);
    }

    loadMedal(url) {
        this.key = url;
        if (game.cache.checkImageKey(url)) {
            this.onLoad();
        } else {
            //
            ControllLoadCacheUrl.instance().event.load_image_complate.add(this.onLoad, this);
            ControllLoadCacheUrl.instance().addLoader(this.key);
        }
    }

    onLoad() {
        ControllLoadCacheUrl.instance().event.load_image_complate.remove(this.onLoad, this);
        try {
            if (game.cache.checkImageKey(this.key)) {
                if (this) {
                    this.medal.loadTexture(`${this.key}`);
                }
            } else {

            }
        } catch (error) {

        }
    }

    loadStart() {
        LogConsole.log("loadStart");
    }

    addFireWork() {
        var winAnim = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 355 * window.GameConfig.RESIZE, 'firework');
        winAnim.anchor.set(0.5);
        // winAnim.scale.set();
        this.addChild(winAnim);
        var runSSWin = winAnim.animations.add('run_win');
        winAnim.animations.play('run_win', 40, true);
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.popupfinishachievement);
        let tween = game.add.tween(this.popup).to({ y: (game.height - 781) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
    }

    onClose() {
        let tween = game.add.tween(this.popup).to({ y: -420 * window.GameConfig.RESIZE }, 200, Phaser.Easing.Linear.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            this.destroy();
        }, this);
        this.popup.event.close.remove(this.onClose, this);
    }
}