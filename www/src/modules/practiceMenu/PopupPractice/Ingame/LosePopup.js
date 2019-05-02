import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../../FaceBookCheckingTools.js";
import SocketController from "../../../../controller/SocketController.js";
import SpriteBase from "../../../../view/component/SpriteBase.js";
import TextBase from "../../../../view/component/TextBase.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class LosePopup extends BaseGroup {
    constructor(score) {
        super(game)
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.score = score;
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.signalBtn = new Phaser.Signal();
        this.afterInit();
    }

    afterInit() {
        this.screenDim;
        this.tabGem;
        this.tabHeart;
        this.addScreenDim();
        this.addGemAndHeart();
        this.addEventExtension();
    }

    //
    addEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.add(this.onUpdateUserVars, this);
    }
    removeEventExtension() {
        SocketController.instance().events.onUserVarsUpdate.remove(this.onUpdateUserVars, this);
    }

    onUpdateUserVars() {
        if (SocketController.instance().dataMySeft.heart !== parseInt(this.txtHeart.text)) {
            this.txtHeart.text = SocketController.instance().dataMySeft.heart;
        }
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
        // let txtHeart;
        heart = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.heart_reward.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.heart_reward.nameAtlas, this.positionPracticePopupConfig.heart_reward.nameSprite);
        this.txtHeart = new Phaser.Text(game, 0, this.positionPracticePopupConfig.heart_reward_txt.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value, this.positionPracticePopupConfig.heart_reward_txt.configs);
        let sumWidth = heart.width + this.txtHeart.width;
        this.txtHeart.x = ((this.tabHeart.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        heart.x = ((this.tabHeart.width - sumWidth) / 2) + this.txtHeart.width + 10 * window.GameConfig.RESIZE;
        this.tabHeart.addChild(heart);
        this.tabHeart.addChild(this.txtHeart);
    }

    addPopup() {
        this.btnRank;
        this.btnHome;
        this.btnReplay;
        this.animLose;
        this.txtLose;
        //
        let lineTop = new Phaser.Sprite(game, this.positionPracticePopupConfig.popup_confirm_top_bg.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.popup_confirm_top_bg.nameAtlas, this.positionPracticePopupConfig.popup_confirm_top_bg.nameSprite);
        this.popup = new Phaser.Sprite(game, this.positionPracticePopupConfig.box_lose_practice.x * window.GameConfig.RESIZE, 1136 * window.GameConfig.RESIZE, null);
        this.popup.addChild(lineTop);
        let boxPopup = new Phaser.Sprite(game, 0, 0, this.positionPracticePopupConfig.box_lose_practice.nameAtlas, this.positionPracticePopupConfig.box_lose_practice.nameSprite);
        this.popup.addChild(boxPopup);
        this.addBtnRank();
        this.addBtnHome();
        this.addBtnReplay();
        this.addTxtLose();
        this.addAnimLose();
        this.addChild(this.popup);
    }

    addBtnRank() {
        this.btnRank = new Phaser.Button(game, this.positionPracticePopupConfig.btn_rank_practice_lose.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_rank_practice_lose.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_rank_practice_lose.nameAtlas, () => { }, this, null, this.positionPracticePopupConfig.btn_rank_practice_lose.nameSprite);
        //
        let icon = new SpriteBase(this.positionPracticePopupConfig.icon_rank);
        this.btnRank.addChild(icon);
        let txtIconRank = new TextBase(this.positionPracticePopupConfig.txt_icon_rank, Language.instance().getData("235"));
        this.btnRank.addChild(txtIconRank);
        // this.btnRank.anchor.set(0.5);
        this.btnRank.events.onInputUp.add(this.onClickRank, this);
        let animBtnRank = new Phaser.Sprite(game, 80 * window.GameConfig.RESIZE, 11 * window.GameConfig.RESIZE, 'btnRankAnim');
        this.btnRank.addChild(animBtnRank);
        let runRankAnim = animBtnRank.animations.add('run_rank');
        animBtnRank.animations.play('run_rank', 26, true);
        this.popup.addChild(this.btnRank);
    }

    onClickRank() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalBtn.dispatch({ type: "RANK" });
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode_ranking_button);
        //
    }

    addBtnHome() {
        this.btnHome = new Phaser.Button(game, this.positionPracticePopupConfig.btn_home_practice_lose.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_home_practice_lose.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_home_practice_lose.nameAtlas, () => { }, this, null, this.positionPracticePopupConfig.btn_home_practice_lose.nameSprite);
        this.popup.addChild(this.btnHome);
        this.btnHome.events.onInputUp.addOnce(this.onClickHome, this);
    }

    onClickHome() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.signalBtn.dispatch({ type: "HOME" });
    }

    addBtnReplay() {
        this.btnReplay = new Phaser.Button(game, this.positionPracticePopupConfig.btn_replay_practice.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_replay_practice.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.btn_replay_practice.nameAtlas, () => { }, this, null, this.positionPracticePopupConfig.btn_replay_practice.nameSprite);
        //
        let icon_heart = new SpriteBase(this.positionPracticePopupConfig.icon_heart);
        this.btnReplay.addChild(icon_heart);
        let txt_icon_heart = new TextBase(this.positionPracticePopupConfig.txt_icon_heart, `${Language.instance().getData("236")}${Language.instance().getData("321")}`);
        txt_icon_heart.addColor("#ffd3b5", Language.instance().getData("236").length);
        this.btnReplay.addChild(txt_icon_heart);
        //
        txt_icon_heart.x = (this.btnReplay.width - txt_icon_heart.width - icon_heart.width - 15) / 2;
        icon_heart.x = txt_icon_heart.x + txt_icon_heart.width + 15;
        //
        this.popup.addChild(this.btnReplay);
        this.btnReplay.events.onInputUp.add(this.onClickReplay, this);
    }

    onClickReplay() {
        this.btnReplay.inputEnabled = false;
        this.signalBtn.dispatch({ type: "REPLAY" });
        this.timeoutInput = setTimeout(() => {
            this.btnReplay.inputEnabled = true;
        }, 500);
    }

    addTxtLose() {
        this.txtLose = new Phaser.Text(game, this.positionPracticePopupConfig.txt_lose_timeout.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.txt_lose_timeout.y * window.GameConfig.RESIZE, `${Language.instance().getData("237")} : ${this.score}`, this.positionPracticePopupConfig.txt_lose_timeout.configs);
        this.txtLose.anchor.set(0.5, 0);
        this.popup.addChild(this.txtLose);
    }

    addAnimLose() {
        this.animLose = new Phaser.Sprite(game, 285 * window.GameConfig.RESIZE, 73 * window.GameConfig.RESIZE, 'wrong_practice');
        this.animLose.anchor.set(0.5, 0);
        let runTimeoutAnim = this.animLose.animations.add('run_load_wrong');
        this.popup.addChild(this.animLose);
    }

    makeTweenPopup() {
        ControllSoundFx.instance().playSound(ControllSoundFx.losesolomode);
        let tween = game.add.tween(this.popup).to({ y: (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPracticePopupConfig.box_lose_practice.y) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Bounce.Out, false);
        tween.start();
        tween.onComplete.add(() => {
            this.animLose.animations.play('run_load_wrong', 15, false);
        }, this)
    }

    destroy() {
        clearTimeout(this.timeoutInput);
        this.removeEventExtension();
        super.destroy();
    }
}