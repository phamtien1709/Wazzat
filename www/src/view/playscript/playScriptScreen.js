import SpriteBase from "../component/SpriteBase.js";
import ButtonBase from "../component/ButtonBase.js";
import TextBase from "../component/TextBase.js";
import SocketController from "../../controller/SocketController.js";
import ControllSoundFx from "../../controller/ControllSoundFx.js";
import DataCommand from "../../common/DataCommand.js";
import MainData from "../../model/MainData.js";
import RankingItemHelp from "../ranking/item/RankingItemHelp.js";
import FaceBookCheckingTools from "../../FaceBookCheckingTools.js";
import Language from "../../model/Language.js";
import BaseGroup from "../BaseGroup.js";

export default class PlayScriptScreen extends Phaser.Group {
    constructor(type = null) {
        super(game);
        this.playScript = JSON.parse(game.cache.getText('playScript'));
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.type = type;
        this.event = {
            step1: new Phaser.Signal(),
            step2: new Phaser.Signal(),
            step3: new Phaser.Signal(),
            step4: new Phaser.Signal(),
            step5: new Phaser.Signal(),
            step6: new Phaser.Signal(),
            step7: new Phaser.Signal(),
            step8: new Phaser.Signal()
        }
        this.stepVal = 0;
        this.indexOfAnswer = 5;
        this.arrTutorial = [
            Language.instance().getData("196"),
            Language.instance().getData("197"),
            Language.instance().getData("198"),
            Language.instance().getData("199"),
            Language.instance().getData("200"),
            Language.instance().getData("201"),
            Language.instance().getData("202"),
            Language.instance().getData("203")
        ]
        // this.afterInit();
    }

    static get STEP1() {
        return "step1";
    }

    static get STEP2() {
        return "step2";
    }

    static get STEP3() {
        return "step3";
    }

    static get STEP4() {
        return "step8";
    }

    static get STEP5() {
        return "step5";
    }

    static get STEP6() {
        return "step6";
    }

    static get STEP7() {
        return "step7";
    }

    static get STEP8() {
        return "step4";
    }

    static get STEP9() {
        return "step9";
    }

    static get INIT() {
        return "INIT";
    }

    static get DONE_TURNBASE() {
        return "DONE_TURNBASE";
    }

    static get DONE_GET_QUEST() {
        return "DONE_GET_QUEST";
    }

    static get DONE_ALL() {
        return "DONE_ALL";
    }

    afterInit() {
        // console.log('ANYBODYHERE???' + this.type)
        // console.log(MainData.instance().playScript.playing_guide);
        this.bg = new Phaser.Button(game, 0, 0, 'BG_Opacity');
        this.addChild(this.bg);
        this.addButtonSkip();
        this.addEventExtension();
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.PLAY_SCRIPT_DONE_GET_QUEST_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.destroy();
            }
        }
    }

    addButtonSkip() {
        this.btnSkip = new ButtonBase(this.playScript.play_script_btn_skip, this.onSkipPS, this);
        this.btnSkip.y = game.height - MainData.instance().STANDARD_HEIGHT + this.playScript.play_script_btn_skip.y;
        this.btnSkip.anchor.set(0.5);
        let txt = new TextBase(this.playScript.play_script_btn_skip.text, Language.instance().getData(195));
        txt.anchor.set(0.5);
        this.btnSkip.addChild(txt);
        this.btnSkip.kill();
        this.addChild(this.btnSkip);
    }

    onSkipPS() {
        // console.log('onSkipPS');
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script_Skip + '_' + this.stepVal);
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        SocketController.instance().sendData(DataCommand.PLAY_SCRIPT_DONE_ALL_REQUEST, null);
    }

    addHand(x, y) {
        this.hand = new Phaser.Sprite(game, x, y, this.playScript.play_script_hand.nameAtlas, this.playScript.play_script_hand.nameSprite);
        let tweenHand = game.add.tween(this.hand).to({ y: '+30' }, 200, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenHand.start();
        this.addChild(this.hand);
    }

    addHelperStep1() {
        let helper = new RankingItemHelp(this.arrTutorial[0]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 60;
        this.addChild(helper);
        this.btnSkip.revive();
    }
    addStep1ChooseAnswerQuest1(answerEntity, countQuiz) {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step1');
        this.indexOfAnswer = 5;
        let correctAnswer = answerEntity.correctAnswer;
        this.indexOfAnswer = correctAnswer - 1;
        let answer = answerEntity.answers[correctAnswer - 1];
        this.stepVal = PlayScriptScreen.STEP1;
        this.bg.loadTexture('BG_Opacity');
        this.countQuiz = countQuiz;
        let tabAnswer = new ButtonBase({
            "x": 0,
            "y": 0,
            "nameAtlas": "playSprites",
            "nameSprite": "Tab_Dapan_01"
        }, this.onClickTab, this);
        tabAnswer.anchor.set(0.5);
        tabAnswer.position.x = 320;
        if (correctAnswer == 1) {
            tabAnswer.position.y = (game.height - 576);
        } else if (correctAnswer == 2) {
            tabAnswer.position.y = (game.height - 576) + 122;
        } else if (correctAnswer == 3) {
            tabAnswer.position.y = (game.height - 576) + 122 * 2;
        } else {
            tabAnswer.position.y = (game.height - 576) + 122 * 3;
        }
        let txtTab = new TextBase({
            "x": 0,
            "y": 0,
            "text": "",
            "style": {
                font: `GilroyMedium`,
                fill: "black",
                align: "center",
                fontSize: 28,
                boundsAlignH: "center",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 400
            }
        }, answer);
        txtTab.anchor.set(0.5);
        tabAnswer.addChild(txtTab);
        //
        //
        let tweenTab = game.add.tween(tabAnswer.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenTab.start();
        this.addChild(tabAnswer);
        this.addHand(tabAnswer.x + 150, tabAnswer.y);
    }

    addHelperStep2() {
        let helper = new RankingItemHelp(this.arrTutorial[1]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 90;
        this.addChild(helper);
        this.btnSkip.revive();
    }
    addStep2ChooseAnswerQuest2(answerEntity, countQuiz) {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step2');
        this.indexOfAnswer = 5;
        let correctAnswer = answerEntity.correctAnswer;
        this.indexOfAnswer = correctAnswer - 1;
        let answer = answerEntity.answers[correctAnswer - 1];
        // console.log(answerEntity);
        this.stepVal = PlayScriptScreen.STEP2;
        this.bg.loadTexture('BG_Opacity');
        this.countQuiz = countQuiz;
        let tabAnswer = new ButtonBase({
            "x": 0,
            "y": 0,
            "nameAtlas": "playSprites",
            "nameSprite": "Tab_Dapan_01"
        }, this.onClickTab, this);
        tabAnswer.anchor.set(0.5);
        tabAnswer.position.x = 320;
        if (correctAnswer == 1) {
            tabAnswer.position.y = (game.height - 576);
        } else if (correctAnswer == 2) {
            tabAnswer.position.y = (game.height - 576) + 122;
        } else if (correctAnswer == 3) {
            tabAnswer.position.y = (game.height - 576) + 122 * 2;
        } else {
            tabAnswer.position.y = (game.height - 576) + 122 * 3;
        }
        let txtTab = new TextBase({
            "x": 0,
            "y": 0,
            "text": "",
            "style": {
                font: `GilroyMedium`,
                fill: "black",
                align: "center",
                fontSize: 28,
                boundsAlignH: "center",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 400
            }
        }, answer);
        txtTab.anchor.set(0.5);
        tabAnswer.addChild(txtTab);
        let tweenTab = game.add.tween(tabAnswer.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenTab.start();
        this.addChild(tabAnswer);
        this.addHand(tabAnswer.x + 150, tabAnswer.y);
    }

    addHelperStep3() {
        let helper = new RankingItemHelp(this.arrTutorial[2]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 90;
        this.addChild(helper);
        this.btnSkip.revive();
    }
    addStep3ChooseAnswerQuest3(answerEntity, countQuiz) {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step3');
        this.indexOfAnswer = 5;
        let correctAnswer = answerEntity.correctAnswer;
        this.indexOfAnswer = correctAnswer - 1;
        let answer = answerEntity.answers[correctAnswer - 1];
        // console.log(answerEntity);
        this.stepVal = PlayScriptScreen.STEP3;
        this.bg.loadTexture('BG_Opacity');
        this.countQuiz = countQuiz;
        let tabAnswer = new ButtonBase({
            "x": 0,
            "y": 0,
            "nameAtlas": "playSprites",
            "nameSprite": "Tab_Dapan_01"
        }, this.onClickTab, this);
        tabAnswer.anchor.set(0.5);
        tabAnswer.position.x = 320;
        if (correctAnswer == 1) {
            tabAnswer.position.y = (game.height - 576);
        } else if (correctAnswer == 2) {
            tabAnswer.position.y = (game.height - 576) + 122;
        } else if (correctAnswer == 3) {
            tabAnswer.position.y = (game.height - 576) + 122 * 2;
        } else {
            tabAnswer.position.y = (game.height - 576) + 122 * 3;
        }
        let txtTab = new TextBase({
            "x": 0,
            "y": 0,
            "text": "",
            "style": {
                font: `GilroyMedium`,
                fill: "black",
                align: "center",
                fontSize: 28,
                boundsAlignH: "center",
                boundsAlignV: "middle",
                wordWrap: true,
                wordWrapWidth: 400
            }
        }, answer);
        txtTab.anchor.set(0.5);
        tabAnswer.addChild(txtTab);
        let tweenTab = game.add.tween(tabAnswer.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenTab.start();
        this.addChild(tabAnswer);
        this.addHand(tabAnswer.x + 150, tabAnswer.y);
    }

    addHelperStep4() {
        let helper = new RankingItemHelp(this.arrTutorial[3]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 650;
        this.addChild(helper);
    }
    addStep4UseSupportItem() {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step8');
        // this.btnSkip.revive();
        this.stepVal = PlayScriptScreen.STEP4;
        this.bg.loadTexture('BG_Opacity_100');
        //
        this.btn_remove_answer = new Phaser.Button(game, this.positionPlayConfig.btn_remove_answer.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.btn_remove_answer.y) * window.GameConfig.RESIZE, this.positionPlayConfig.btn_remove_answer.nameAtlas, () => { }, this, null, this.positionPlayConfig.btn_remove_answer.nameSprite);
        this.btn_remove_answer.anchor.set(0.5);
        // this.btn_remove_answer.kill();
        //
        var txt_remove_answer = new Phaser.Text(game, this.positionPlayConfig.txt_remove_answer.x * window.GameConfig.RESIZE, this.positionPlayConfig.txt_remove_answer.y * window.GameConfig.RESIZE, Language.instance().getData("271"), this.positionPlayConfig.txt_remove_answer.configs);
        txt_remove_answer.anchor.set(0.5);
        //
        var txt_dis_1 = new TextBase(this.positionPlayConfig.txt_dis_one, this.positionPlayConfig.txt_dis_one.text);
        txt_dis_1.anchor.set(0.5);
        this.btn_remove_answer.addChild(txt_dis_1);
        //
        var spt_item_remove_answer = new Phaser.Sprite(game, this.positionPlayConfig.diamond_remove_answer.x * window.GameConfig.RESIZE, this.positionPlayConfig.diamond_remove_answer.y * window.GameConfig.RESIZE, this.positionPlayConfig.diamond_remove_answer.nameAtlas, this.positionPlayConfig.diamond_remove_answer.nameSprite);
        spt_item_remove_answer.anchor.set(1, 0.5);
        //
        var circleCountSptItem = new SpriteBase(this.positionPlayConfig.mic_so_luong);
        circleCountSptItem.anchor.set(0.5);
        //
        this.countMic = SocketController.instance().socket.mySelf.getVariable('support_item').value;
        this.numberOfSptItem = new TextBase(this.positionPlayConfig.number_mic_so_luong, SocketController.instance().socket.mySelf.getVariable('support_item').value);
        this.numberOfSptItem.anchor.set(0.5);
        //
        circleCountSptItem.addChild(this.numberOfSptItem);
        this.btn_remove_answer.addChild(circleCountSptItem);
        this.btn_remove_answer.addChild(spt_item_remove_answer);
        this.btn_remove_answer.addChild(txt_remove_answer);
        this.btn_remove_answer.events.onInputUp.add(this.inputBtnRemoveAnswer, this);
        this.addChild(this.btn_remove_answer);
        let tweenTab = game.add.tween(this.btn_remove_answer.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenTab.start();
        //
        // this.addHand(this.btn_remove_answer.x + 150, this.btn_remove_answer.y);
        this.addBtnYellow();
    }

    inputBtnRemoveAnswer() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.step4.dispatch();
        this.destroy();
    }

    addStep5ReceiveFirstReward() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step4');
        this.btnSkip.revive();
        this.stepVal = PlayScriptScreen.STEP5;
        this.bg.loadTexture('BG_Opacity');
        let helper = new RankingItemHelp(this.arrTutorial[4]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 90;
        this.addChild(helper);
        this.btnClaim = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, (game.height - 481) * window.GameConfig.RESIZE, "questAndAchieveSprites", "Button_Nhan_popup");
        this.btnClaim.anchor.set(0.5, 0);
        let txt = new Phaser.Text(game, 0, 24 * window.GameConfig.RESIZE, "NHẬN", {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 30
        });
        txt.anchor.set(0.5, 0);
        this.btnClaim.addChild(txt);
        this.btnClaim.inputEnabled = true;
        this.btnClaim.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.onClickTab();
        }, this);
        this.addChild(this.btnClaim);
        //
        this.addHand(this.btnClaim.x + 50, this.btnClaim.y + 40);
    }

    claimReward() {

    }

    addStep6BtnReceiveInQAndA() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step5');
        this.btnSkip.revive();
        this.stepVal = PlayScriptScreen.STEP6;
    }

    onClaim() {
        this.quest.destroy();
        this.hand.destroy();
        PlayScriptScreen.instance().event.step6.dispatch();
        // this.onClickTab();
    }

    addStep7CloseQAndA() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step6');
        this.btnSkip.revive();
        this.stepVal = PlayScriptScreen.STEP7;
        this.bg.loadTexture('BG_Opacity');
        //
        this.btnBack = new Phaser.Sprite(game, this.playScript.btn_back.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.playScript.btn_back.y) * window.GameConfig.RESIZE, this.playScript.btn_back.nameAtlas, this.playScript.btn_back.nameSprite);
        this.btnBack.anchor.set(0.5);
        this.btnBack.inputEnabled = true;
        this.btnBack.events.onInputUp.add(this.onBack, this);
        this.addChild(this.btnBack);
        //
        this.addHand(this.btnBack.x - 25, this.btnBack.y);
    }

    onBack() {
        this.onClickTab();
    }

    addStep8AcceptChallenge() {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step7');
        this.btnSkip.revive();
        this.stepVal = PlayScriptScreen.STEP8;
        this.bg.loadTexture('BG_Opacity');
        let helper = new RankingItemHelp(this.arrTutorial[6]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 90;
        this.addChild(helper);
        //
        this.btnAccept = new Phaser.Button(game,
            this.playScript.btn_accept.x * window.GameConfig.RESIZE, this.playScript.btn_accept.y * window.GameConfig.RESIZE,
            'otherSprites',
            this.onAccept,
            this, null, 'btnFirstGame'
        );
        this.btnAccept.anchor.set(0.5);
        this.addChild(this.btnAccept);
        let tweenBtn = game.add.tween(this.btnAccept.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenBtn.start();
        //
        this.addHand(this.btnAccept.x, this.btnAccept.y);
    }

    addBtnYellow() {
        let btn = new Phaser.Sprite(game, this.playScript.btn_yellow.x, this.playScript.btn_yellow.y, this.playScript.btn_yellow.nameAtlas, this.playScript.btn_yellow.nameSprite);
        btn.anchor.set(0.5);
        let tweenBtn = game.add.tween(btn).to({ y: '+30' }, 500, Phaser.Easing.Linear.None, true, 0, 1, true).loop(true);
        tweenBtn.start();
        this.addChild(btn);
    }

    onAccept() {
        this.onClickTab();
    }

    addStep9GoodLuck() {
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Screen_Play_Script + '_step9');
        this.stepVal = PlayScriptScreen.STEP9;
        this.bg.destroy();
        let helper = new RankingItemHelp(this.arrTutorial[7]);
        helper.txtContent.changeStyle({
            "font": "Gilroy",
            "fill": "#333333",
            "fontSize": 28,
            "wordWrap": true,
            "wordWrapWidth": 500,
            "align": "center"
        });
        helper.setWidthHeight();
        helper.position.x = (game.width - helper.width) / 2;
        helper.position.y = 90;
        this.addChild(helper);
        //
        this.tweenDestroy9 = game.time.events.add(Phaser.Timer.SECOND * 3, () => {
            let tweenTut = game.add.tween(helper).to({ y: -500 }, 2000, Phaser.Easing.Back.InOut, true);
            tweenTut.start();
            tweenTut.onComplete.add(() => {
                this.destroy();
            }, this);
        });
    }

    onClickTab() {
        // ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.stepVal == PlayScriptScreen.STEP1) {
            this.event.step1.dispatch(this.indexOfAnswer);
        }
        if (this.stepVal == PlayScriptScreen.STEP2) {
            this.event.step2.dispatch(this.indexOfAnswer);
        }
        if (this.stepVal == PlayScriptScreen.STEP3) {
            this.event.step3.dispatch(this.indexOfAnswer);
        }
        if (this.stepVal == PlayScriptScreen.STEP4) {
            this.event.step4.dispatch();
        }
        if (this.stepVal == PlayScriptScreen.STEP5) {
            this.event.step5.dispatch();
            PlayScriptScreen.instance().event.step5.dispatch();
        }
        if (this.stepVal == PlayScriptScreen.STEP6) {
            // this.event.step6.dispatch();
            PlayScriptScreen.instance().event.step6.dispatch();
        }
        if (this.stepVal == PlayScriptScreen.STEP7) {
            this.event.step7.dispatch();
            PlayScriptScreen.instance().event.step7.dispatch();
        }
        if (this.stepVal == PlayScriptScreen.STEP8) {
            this.event.step8.dispatch();
            PlayScriptScreen.instance().event.step8.dispatch();
        }
        this.destroy();
    }

    static instance() {
        if (this.playScriptScreen) {

        } else {
            this.playScriptScreen = new PlayScriptScreen();
        }
        return this.playScriptScreen;
    }

    changeBg() {
        this.bg.loadTexture('BG_Opacity_100');
    }

    removeAllTut() {
        this.bg.destroy();
        this.btnSkip.destroy();
    }

    destroy() {
        this.removeEventExtension();
        game.time.events.remove(this.tweenDestroy9);
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