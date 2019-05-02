import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import SocketController from "../../../../controller/SocketController.js";
import MainData from "../../../../model/MainData.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class NotReward extends BaseGroup {
    constructor(score) {
        super(game)
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.score = score;
        this.signalNextQuestion = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.timer = null;
        this.screenDim;
        this.tabGem;
        this.tabHeart;
        this.addScreenDim();
        this.addGemAndHeart();
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
        let txtGem;
        gem = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.gem_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.gem_reward.nameAtlas, this.positionPracticePopupConfig.gem_reward.nameSprite);
        txtGem = new Phaser.Text(game, 0, this.positionPracticePopupConfig.gem_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, this.positionPracticePopupConfig.gem_reward_txt.configs);
        let sumWidth = gem.width + txtGem.width;
        txtGem.x = ((this.tabGem.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGem.width - sumWidth) / 2) + txtGem.width + 10 * window.GameConfig.RESIZE;
        this.tabGem.addChild(gem);
        this.tabGem.addChild(txtGem);
    }

    addHeartDetail() {
        let heart;
        let txtHeart;
        heart = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.heart_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.heart_reward.nameAtlas, this.positionPracticePopupConfig.heart_reward.nameSprite);
        txtHeart = new Phaser.Text(game, 0, this.positionPracticePopupConfig.heart_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value, this.positionPracticePopupConfig.heart_reward_txt.configs);
        let sumWidth = heart.width + txtHeart.width;
        txtHeart.x = ((this.tabHeart.width - sumWidth) / 2) - 5;
        heart.x = ((this.tabHeart.width - sumWidth) / 2) + txtHeart.width + 10;
        this.tabHeart.addChild(heart);
        this.tabHeart.addChild(txtHeart);
    }

    addPopup() {
        this.congraTxt;
        this.txtDetailReward;
        this.btnContinue;
        this.timeCountDown;
        this.txtTimeout;
        //
        let lineTop = new Phaser.Sprite(game, this.positionPracticePopupConfig.popup_confirm_top_bg.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.nameAtlas, this.positionPracticePopupConfig.popup_confirm_top_bg.nameSprite);
        //
        this.popup = new Phaser.Sprite(game, this.positionPracticePopupConfig.lineRewardPopup.x * window.GameConfig.RESIZE, 1140 * window.GameConfig.RESIZE, null);
        this.popup.addChild(lineTop);
        //
        let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.rewardPopup.nameAtlas, this.positionPracticePopupConfig.rewardPopup.nameSprite);
        // popup.scale.set(1, 640 / 589);
        this.popup.addChild(boxPopup);
        this.addChild(this.popup);
        //
        this.addCongraTxt();
        this.addTxtDetailReward();
        this.addBtnContinue();
    }

    makeTweenPopup() {
        let tween = game.add.tween(this.popup).to({ y: (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPracticePopupConfig.lineRewardPopup.y) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        tween.start();
    }

    addCongraTxt() {
        this.congraTxt = new Phaser.Text(game, this.positionPracticePopupConfig.congrat_txt_not_reward.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.congrat_txt_not_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.congrat_txt_not_reward.text, this.positionPracticePopupConfig.congrat_txt_not_reward.configs);
        this.congraTxt.anchor.set(0.5, 0);
        this.popup.addChild(this.congraTxt);
    }

    addTxtDetailReward() {
        this.txtDetailReward = new Phaser.Text(game, this.positionPracticePopupConfig.txt_detail_not_reward.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_detail_not_reward.y * window.GameConfig.RESIZE, `${this.positionPracticePopupConfig.txt_detail_not_reward.text1} ${this.score} ${this.positionPracticePopupConfig.txt_detail_not_reward.text2}`, this.positionPracticePopupConfig.txt_detail_not_reward.configs);
        this.txtDetailReward.anchor.set(0.5, 0);
        this.txtDetailReward.addColor('#ffa33a', 19);
        this.txtDetailReward.addColor('#333333', 22);
        this.popup.addChild(this.txtDetailReward);
    }

    addBtnContinue() {
        this.btnContinue = new Phaser.Sprite(game, this.positionPracticePopupConfig.btn_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_continue.nameAtlas, this.positionPracticePopupConfig.btn_continue.nameSprite);
        this.btnContinue.anchor.set(0.5, 0);
        let txtBtn = new Phaser.Text(game, this.positionPracticePopupConfig.txt_btn_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_btn_continue.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_btn_continue.text, this.positionPracticePopupConfig.txt_btn_continue.configs);
        txtBtn.anchor.set(0.5, 0);
        this.btnContinue.inputEnabled = true;
        this.btnContinue.events.onInputUp.add(this.onClickContinue, this);
        this.btnContinue.addChild(txtBtn);
        //
        this.timeCountDown = 9;
        this.txtTimeout = new Phaser.Text(game, this.positionPracticePopupConfig.txt_timeout_continue.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_timeout_continue.y * window.GameConfig.RESIZE, `( ${this.timeCountDown} )`, this.positionPracticePopupConfig.txt_timeout_continue.configs);
        this.btnContinue.addChild(this.txtTimeout);
        this.timer = game.time.create(false);
        this.timer.loop(1000, this.handleTimer, this);
        this.timer.start();
        //
        this.popup.addChild(this.btnContinue);
    }

    onClickContinue() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        let tween = game.add.tween(this.popup).to({ y: -1200 * window.GameConfig.RESIZE }, 200, "Linear", false);
        tween.start();
        tween.onComplete.add(() => {
            this.signalNextQuestion.dispatch();
            this.destroy();
        }, this);
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
        // var now = Date.now();
        // var timeCountDown = this.timeCountDownThisWeekPractice - now;
        // LogConsole.log('asdasd');
        if (this.timeCountDown > 0) {
            this.timeCountDown--;
            this.txtTimeout.setText(`( ${this.timeCountDown} )`);
        }
        if (this.timeCountDown == 0) {
            this.signalNextQuestion.dispatch();
            this.destroy();
        }
        //`${hour}:${min}:${sec}`
    }

    destroy() {
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