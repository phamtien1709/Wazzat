import LoadAudioSource from "../../../controller/LoadData/LoadAudioSource.js";
import AnswerControllerSoloMode from "../items/button/AnswerControllerSoloMode.js";
import Timeout from "../../../modules/practiceMenu/PopupPractice/Ingame/Timeout.js";
import LosePopup from "../../../modules/practiceMenu/PopupPractice/Ingame/LosePopup.js";
import Reward from "../../../modules/practiceMenu/PopupPractice/Ingame/Reward.js";
import LoadingAnim from "../../component/LoadingAnim.js";
import RankingSoloMode from "../items/RankingSoloMode.js";
import DataCommand from "../../../common/DataCommand.js";
import DoneSoloMode from "../../../modules/practiceMenu/PopupPractice/Ingame/DoneSoloMode.js";
import ControllSound from "../../../controller/ControllSound.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import OnlineModeTrueFailAnswer from "../../onlinemode/item/OnlineModeTrueFailAnswer.js";
import ImageLoader from "../../../Component/ImageLoader.js";
import IronSource from "../../../IronSource.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import BaseGroup from "../../BaseGroup.js";

export default class SoloModePlay extends BaseGroup {
    constructor() {
        super(game);
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.positionPracticePopupConfig = JSON.parse(game.cache.getText('positionPracticePopupConfig'));
        this.event = {
            playAgain: new Phaser.Signal(),
            backToHome: new Phaser.Signal()
        }
    }

    afterInit() {
        this.countQuiz = 0;
        this.addEventExtension();
        this.bg = new Phaser.Sprite(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
        this.loadAudioSource = new LoadAudioSource();
        this.loadAudioSource.loadDataComplete.add(this.onLoadAudioComplete, this);
        this.loadAudioSource.loadDataFail.add(this.onLoadAudioFail, this);
        this.definedScreenPracticeModeAndLogicValue();
    }

    definedScreenPracticeModeAndLogicValue() {
        //add Signal On Choosed
        // variable
        this.choosed = false;
        this.dotsGroup = null;
        this.timeout = false;
        this.rankingListThisWeek = [];
        this.rankingListLastWeek = [];
        this.question;
        this.groupAnswer = null;
        this.RankingScreen = null;
        this.gotRewardStatus = false;
        //
        this.answerGroup = new Phaser.Group(game);
        this.addChild(this.answerGroup);
        this.addAvaAndMaskAva();
        this.addNameFB();
        this.addMapPracticeAndDotAnswer();
        this.addFlag();
        //create dot answer target
        this.addTabGemAndTabHeart();
        this.addLoadingSong();
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode_quiz_play);
        //
    }

    addLoadingSong() {
        this.stopAudio();
        var songChoiced = {
            key: 'songChoiced',
            url: this.questions[this.countQuiz].songEntity.fileUrl
        };
        this.question = this.questions[this.countQuiz];
        this.loadAudioSource.beginLoadAudio(songChoiced);
        //
        this.loadingAnim = new LoadingAnim();
        this.loadingAnim.moveTxtLoading();
        this.addChild(this.loadingAnim);
    }
    onLoadAudioComplete() {
        this.loadingAnim.destroy();
        this.removeChild(this.loadingAnim);
        // add mp3Song to variable to play music
        ControllSound.instance().playsound(this.questions[this.countQuiz].songEntity.fileUrl);
        this.addAnswerGroup();
    }
    onLoadAudioFail() {
        this.loadingAnim.destroy();
        this.removeChild(this.loadingAnim);
        // add mp3Song to variable to play music
        ControllSound.instance().playsound(this.questions[this.countQuiz].songEntity.fileUrl);
        this.addAnswerGroup();
    }
    stopAudio() {
        ControllSound.instance().removeSound();
    }

    addAvaAndMaskAva() {
        // mask ava in front  of ava sprite 
        var maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.beginFill(0xffffff);
        maskAva.drawCircle(this.positionPracticeScreenConfig.avaPractice.x * window.GameConfig.RESIZE, this.positionPracticeScreenConfig.avaPractice.y * window.GameConfig.RESIZE, 147 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        //fsf
        var ava = new ImageLoader(this.positionPracticeScreenConfig.avaPractice.x * window.GameConfig.RESIZE, this.positionPracticeScreenConfig.avaPractice.y * window.GameConfig.RESIZE, 'ava-default', 'ava_fb', 0);
        ava.sprite.anchor.set(0.5);
        ava.sprite.scale.set(window.GameConfig.SCALE_AVA_USER * window.GameConfig.RESIZE);
        ava.sprite.mask = maskAva;
        this.addChild(ava.sprite);
        //
        if (SocketController.instance().dataMySeft.vip === true) {
            let frameAva = new Phaser.Sprite(game, this.positionPracticeScreenConfig.avaPractice.x * window.GameConfig.RESIZE, (this.positionPracticeScreenConfig.avaPractice.y + 2) * window.GameConfig.RESIZE, 'vipSource', 'Ava_Vip');
            frameAva.anchor.set(0.5);
            this.addChild(frameAva);
        } else {
            // let frameAva = new Phaser.Sprite(game, this.positionPracticeScreenConfig.avaPractice.x * window.GameConfig.RESIZE, this.positionPracticeScreenConfig.avaPractice.y * window.GameConfig.RESIZE, 'vipSource', 'Ava_Vip');
            // frameAva.anchor.set(0.5);
            // this.addChild(frameAva);
        }
        //
        this.trueOrFalse = new OnlineModeTrueFailAnswer();
        this.trueOrFalse.setSize(315 * window.GameConfig.RESIZE, 315 * window.GameConfig.RESIZE);
        this.trueOrFalse.x = (-160 + 5) * window.GameConfig.RESIZE + ava.sprite.x;
        this.trueOrFalse.y = (-160 + 5) * window.GameConfig.RESIZE + ava.sprite.y;
        this.addChild(this.trueOrFalse);
    }
    setTrueAva() {
        this.trueOrFalse.setTrueAnswer();
    }
    setFalseAva() {
        this.trueOrFalse.setFailtAnswer();
    }
    addTabGemAndTabHeart() {
        this.tabGem = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabGemMain.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGemMain.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabGemMain.nameAtlas, this.positionPracticePopupConfig.tabGemMain.nameSprite);
        this.addGemDetail();
        this.addChild(this.tabGem);
        this.tabHeart = new Phaser.Sprite(game, this.positionPracticePopupConfig.tabHeartMain.x * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeartMain.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.tabHeartMain.nameAtlas, this.positionPracticePopupConfig.tabHeartMain.nameSprite);
        this.addHeartDetail();
        this.addChild(this.tabHeart);
    }
    addGemDetail() {
        let gem;
        this.txtGem;
        gem = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.gem_rewardMain.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.gem_rewardMain.nameAtlas, this.positionPracticePopupConfig.gem_rewardMain.nameSprite);
        this.txtGem = new Phaser.Text(game, 0, this.positionPracticePopupConfig.gem_reward_txtMain.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('diamond').value, this.positionPracticePopupConfig.gem_reward_txtMain.configs);
        let sumWidth = gem.width + this.txtGem.width;
        this.txtGem.x = ((this.tabGem.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        gem.x = ((this.tabGem.width - sumWidth) / 2) + this.txtGem.width + 5 * window.GameConfig.RESIZE;
        this.tabGem.addChild(gem);
        this.tabGem.addChild(this.txtGem);
    }
    addHeartDetail() {
        let heart;
        let txtHeart;
        heart = new Phaser.Sprite(game, 0, this.positionPracticePopupConfig.heart_rewardMain.y * window.GameConfig.RESIZE, this.positionPracticePopupConfig.heart_rewardMain.nameAtlas, this.positionPracticePopupConfig.heart_rewardMain.nameSprite);
        txtHeart = new Phaser.Text(game, 0, this.positionPracticePopupConfig.heart_reward_txtMain.y * window.GameConfig.RESIZE, SocketController.instance().socket.mySelf.getVariable('heart').value, this.positionPracticePopupConfig.heart_reward_txtMain.configs);
        let sumWidth = heart.width + txtHeart.width;
        txtHeart.x = ((this.tabHeart.width - sumWidth) / 2) - 5 * window.GameConfig.RESIZE;
        heart.x = ((this.tabHeart.width - sumWidth) / 2) + txtHeart.width + 5 * window.GameConfig.RESIZE;
        this.tabHeart.addChild(heart);
        this.tabHeart.addChild(txtHeart);
    }
    addMapPracticeAndDotAnswer() {
        var map = new Phaser.Sprite(game, game.world.centerX, 419 * window.GameConfig.RESIZE, 'practiceMenuSprites', 'Map');
        map.anchor.set(0.5);
        this.addChild(map);
        //create answer and diamond text
        this.addDotsGroup();
        for (let i = 0; i < window.MQ.posAchievementPractice.length; i++) {
            // LogConsole.log(window.MQ.posAchievementPractice[i]);
            this.CreateAnswerAndDiamondText(
                window.MQ.posAchievementPractice[i].answerPosX * window.GameConfig.RESIZE,
                window.MQ.posAchievementPractice[i].answerPosY * window.GameConfig.RESIZE,
                window.MQ.posAchievementPractice[i].diamondPosX * window.GameConfig.RESIZE,
                window.MQ.posAchievementPractice[i].diamondPosY * window.GameConfig.RESIZE,
                this.rewards[i].number_question,
                this.rewards[i].reward,
                this.rewards[i].reward_type,
                window.MQ.posCirclePractice[i].x * window.GameConfig.RESIZE,
                window.MQ.posCirclePractice[i].y * window.GameConfig.RESIZE);
        }
    }
    addNameFB() {
        var nameFB = new Phaser.Text(game, this.positionPracticeScreenConfig.nameFBPractice.x * window.GameConfig.RESIZE, this.positionPracticeScreenConfig.nameFBPractice.y * window.GameConfig.RESIZE, `You`, this.positionPracticeScreenConfig.nameFBPractice.configs);
        nameFB.anchor.set(0.5);
        this.addChild(nameFB);
    }
    CreateAnswerAndDiamondText(answerPosX, answerPosY, diamondPosX, diamondPosY, valAnswer, valReward, rewardType, posCircleX, posCircleY) {
        // console.log('reward_TYPE:' + rewardType);
        if (rewardType == "DIAMOND") {
            let diamond = new Phaser.Sprite(game, (diamondPosX + 10), (diamondPosY), this.positionPracticeScreenConfig.diamond.nameAtlas, this.positionPracticeScreenConfig.diamond.nameSprite);
            diamond.anchor.set(0, 0.5);
            diamond.scale.set(0.7);
            this.dotsGroup.addChild(diamond);
        } else if (rewardType == "TICKET") {
            let diamond = new Phaser.Sprite(game, (diamondPosX + 10), (diamondPosY), this.positionPracticeScreenConfig.diamond.nameAtlas, 'Ticket');
            diamond.anchor.set(0, 0.5);
            diamond.scale.set(0.7);
            this.dotsGroup.addChild(diamond);
        } else if (rewardType == "SUPPORT_ITEM") {
            let diamond = new Phaser.Sprite(game, (diamondPosX + 10), (diamondPosY), this.positionPracticeScreenConfig.diamond.nameAtlas, 'Mic');
            diamond.anchor.set(0, 0.5);
            diamond.scale.set(0.7);
            this.dotsGroup.addChild(diamond);
        }
        let txt_diamond = new Phaser.Text(game, (diamondPosX), diamondPosY, `${valReward}`, {
            font: `Gilroy`,
            fill: "white",
            fontSize: 17.5
        });
        txt_diamond.anchor.set(1, 0.5);
        this.dotsGroup.addChild(txt_diamond);
        let txt_answered = new Phaser.Text(game, answerPosX, answerPosY, `${valAnswer}`, {
            font: `Gilroy`,
            fill: "white",
            fontSize: 17.5
        })
        txt_answered.anchor.set(0.5);
        this.dotsGroup.addChild(txt_answered);
        if (this.archived.achieved >= valAnswer) {
            txt_answered.alpha = 1;
            if (this.countQuiz == valAnswer) {
                let circle = new Phaser.Sprite(game, posCircleX, posCircleY, 'practiceMenuSprites', 'Circle_Achieved');
                circle.anchor.set(0.5);
                this.dotsGroup.addChild(circle);
            } else {
                if (this.countQuiz > valAnswer) {
                    let circle = new Phaser.Sprite(game, posCircleX, posCircleY, 'practiceMenuSprites', 'Circle_Achieved');
                    circle.anchor.set(0.5);
                    this.dotsGroup.addChild(circle);
                } else {
                    let circle = new Phaser.Sprite(game, posCircleX, posCircleY, 'practiceMenuSprites', 'Circle_Active');
                    circle.anchor.set(0.5);
                    this.dotsGroup.addChild(circle);
                }
            }
            // }
        } else {
            txt_answered.alpha = 0.5;
        }
    }
    createDotAnswered() {
        var objDot = window.MQ.posDotPractice.find((ele) => {
            return ele.num == this.countQuiz;
        });
        if (objDot !== undefined) {
            var dot = new Phaser.Sprite(game, objDot.x * window.GameConfig.RESIZE, objDot.y * window.GameConfig.RESIZE, 'practiceMenuSprites', 'Circle_Active_Small');
            dot.anchor.set(0.5);
            this.dotsGroup.addChild(dot);
            if ((objDot.num > 2 && objDot.num < 8) || (objDot.num > 12 && objDot.num < 25) || (objDot.num > 33 && objDot.num < 56)) {
                var num = new Phaser.Text(game, objDot.x * window.GameConfig.RESIZE, (objDot.y + 12) * window.GameConfig.RESIZE, `${objDot.num}`, {
                    font: `Gilroy`,
                    fill: "white",
                    fontSize: 18
                });
                num.anchor.set(0.5, 0);
                this.dotsGroup.addChild(num);
            } else if (objDot.num > 8 && objDot.num < 12) {
                var num = new Phaser.Text(game, (objDot.x + 12) * window.GameConfig.RESIZE, objDot.y * window.GameConfig.RESIZE, `${objDot.num}`, {
                    font: `Gilroy`,
                    fill: "white",
                    fontSize: 18
                });
                num.anchor.set(0, 0.5);
                this.dotsGroup.addChild(num);
            } else if (objDot.num > 25 && objDot.num < 33) {
                var num = new Phaser.Text(game, (objDot.x - 12) * window.GameConfig.RESIZE, objDot.y * window.GameConfig.RESIZE, `${objDot.num}`, {
                    font: `Gilroy`,
                    fill: "white",
                    fontSize: 18
                });
                num.anchor.set(1, 0.5);
                this.dotsGroup.addChild(num);
            }
        }
        this.addFlag();
    }

    addFlag() {
        //
        var objFlag = window.MQ.posDotPractice.find(ele => {
            return ele.num == this.highest_number_of_correct;
        });
        if (objFlag !== undefined) {
            if (this.countQuiz < objFlag.num) {
                if (objFlag.x !== window.MQ.posDotPractice[0].x) {
                    var flag = new Phaser.Sprite(game, objFlag.x * window.GameConfig.RESIZE, objFlag.y * window.GameConfig.RESIZE, 'practiceMenuSprites', 'Flag_small');
                    flag.anchor.set(0.5);
                    this.dotsGroup.addChild(flag);
                    if ((objFlag.num > 2 && objFlag.num < 8) || (objFlag.num > 12 && objFlag.num < 25) || (objFlag.num > 33 && objFlag.num < 56)) {
                        flag.y -= 3;
                        let num = new Phaser.Text(game, (objFlag.x - 3) * window.GameConfig.RESIZE, (objFlag.y + 15) * window.GameConfig.RESIZE, `${objFlag.num}`, {
                            font: `Gilroy`,
                            fill: "white",
                            fontSize: 15
                        });
                        num.anchor.set(0.5, 0);
                        this.dotsGroup.addChild(num);
                    } else if (objFlag.num > 8 && objFlag.num < 12) {
                        flag.x += 5;
                        let num = new Phaser.Text(game, (objFlag.x + 15) * window.GameConfig.RESIZE, (objFlag.y + 5) * window.GameConfig.RESIZE, `${objFlag.num}`, {
                            font: `Gilroy`,
                            fill: "white",
                            fontSize: 15
                        });
                        num.anchor.set(0, 0.5);
                        this.dotsGroup.addChild(num);
                    } else if (objFlag.num > 25 && objFlag.num < 33) {
                        flag.x += 5;
                        let num = new Phaser.Text(game, (objFlag.x - 15) * window.GameConfig.RESIZE, (objFlag.y + 7) * window.GameConfig.RESIZE, `${objFlag.num}`, {
                            font: `Gilroy`,
                            fill: "white",
                            fontSize: 15
                        });
                        num.anchor.set(1, 0.5);
                        this.dotsGroup.addChild(num);
                    }
                } else {
                    let objAchieFlag = window.MQ.posCirclePractice.find(ele => {
                        return ele.num == this.highest_number_of_correct;
                    })
                    if (objAchieFlag !== undefined) {
                        var flag = new Phaser.Sprite(game, objAchieFlag.x * window.GameConfig.RESIZE, (objAchieFlag.y - 5) * window.GameConfig.RESIZE, 'practiceMenuSprites', 'Flag');
                        flag.anchor.set(0.5);
                        this.dotsGroup.addChild(flag);
                    }
                }
            }
        }
    }
    addDotsGroup() {
        this.removeDotsGroup();
        this.dotsGroup = new Phaser.Group(game);
        this.addChild(this.dotsGroup);
    }
    removeDotsGroup() {
        if (this.dotsGroup !== null) {
            this.removeChild(this.dotsGroup);
            this.dotsGroup.destroy();
            this.dotsGroup = null;
        }
    }
    addAnswerGroup() {
        this.removeAnswerGroup();
        this.groupAnswer = new Phaser.Group(game);
        this.addChild(this.groupAnswer);
        this.createFourAnswerTab();
        this.addSpriteTime();
        //
        // this.addCorrectLOL();
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_start_solomode);
        //
    }

    removeAnswerGroup() {
        if (this.groupAnswer !== null) {
            this.removeChild(this.groupAnswer);
            this.groupAnswer.destroy();
            this.groupAnswer = null;
        }
    }
    addSpriteTime() {
        //spriteTime not have design is be add to test Time tween
        this.spriteTime = new Phaser.Sprite(game, 0, (game.height - 531) * window.GameConfig.RESIZE, 'otherSprites', 'tween-time');
        this.spriteTime.anchor.set(0, 0.5);
        this.addChild(this.spriteTime);
        this.tweenSpriteTime = game.add.tween(this.spriteTime.scale).to({
            x: 70,
            y: 1
        }, 10000, "Linear");
        this.tweenSpriteTime.start();
        this.tweenSpriteTime.onComplete.add(() => {
            this.timeout = true;
            // LogConsole.log('in');
            this.answerA.sprite.inputEnabled = false;
            this.answerB.sprite.inputEnabled = false;
            this.answerC.sprite.inputEnabled = false;
            this.answerD.sprite.inputEnabled = false;
            if (!this.choosed) {
                setTimeout(() => {
                    this.createTimeoutLostPopup();
                }, 1500);
            }
        });
    }
    createFourAnswerTab() {
        LogConsole.log(this.question);
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.answerA = new AnswerControllerSoloMode(game.width / 2, ((game.height - 459) + (i * 122)) * window.GameConfig.RESIZE, {
                    "answer": this.question.answers[i],
                    "value": i + 1
                });
                this.answerA.event.chooseAnswer.add(this.onChoosedAnswered, this);
                this.groupAnswer.addChild(this.answerA);
            }
            if (i == 1) {
                this.answerB = new AnswerControllerSoloMode(game.width / 2, ((game.height - 459) + (i * 122)) * window.GameConfig.RESIZE, {
                    "answer": this.question.answers[i],
                    "value": i + 1
                });
                this.answerB.event.chooseAnswer.add(this.onChoosedAnswered, this);
                this.groupAnswer.addChild(this.answerB);
            }
            if (i == 2) {
                this.answerC = new AnswerControllerSoloMode(game.width / 2, ((game.height - 459) + (i * 122)) * window.GameConfig.RESIZE, {
                    "answer": this.question.answers[i],
                    "value": i + 1
                });
                this.answerC.event.chooseAnswer.add(this.onChoosedAnswered, this);
                this.groupAnswer.addChild(this.answerC);
            }
            if (i == 3) {
                this.answerD = new AnswerControllerSoloMode(game.width / 2, ((game.height - 459) + (i * 122)) * window.GameConfig.RESIZE, {
                    "answer": this.question.answers[i],
                    "value": i + 1
                });
                this.answerD.event.chooseAnswer.add(this.onChoosedAnswered, this);
                this.groupAnswer.addChild(this.answerD);
            }
        }
    }
    onChoosedAnswered(answer) {
        // LogConsole.log(answer);
        this.choosed = true;
        this.answerA.sprite.inputEnabled = false;
        this.answerB.sprite.inputEnabled = false;
        this.answerC.sprite.inputEnabled = false;
        this.answerD.sprite.inputEnabled = false;
        this.answered = answer.value;
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.setTrueFalseTabAnswer(this.answerA, i + 1);
            }
            if (i == 1) {
                this.setTrueFalseTabAnswer(this.answerB, i + 1);
            }
            if (i == 2) {
                this.setTrueFalseTabAnswer(this.answerC, i + 1);
            }
            if (i == 3) {
                this.setTrueFalseTabAnswer(this.answerD, i + 1);
            }
        }
        if ((answer.value) == this.questions[this.countQuiz].correctAnswer) {
            this.setTrueAva();
            ControllSoundFx.instance().playSound(ControllSoundFx.streakanswer);
            this.answerResult = true;
            this.userChoosedCorrectAnswer();
        } else {
            this.setFalseAva();
            this.answerResult = false;
            this.userChoosedWrongAnswer();
        }
    }
    setTrueFalseTabAnswer(sprite, index) {
        if (index == this.answered) {
            if (index == (this.questions[this.countQuiz].correctAnswer)) {
                sprite.displayScreenWhenAnswerRight();
            } else {
                sprite.displayScreenWhenAnswerWrong();
            }
        } else {
            if (index == this.questions[this.countQuiz].correctAnswer) {
                sprite.displayScreenWhenAnswerRight();
            } else {
                sprite.displayScreenWhenAnswerNotChoosed();
            }
        }
    }
    createTimeoutLostPopup() {
        if (!this.choosed) {
            var timeoutPopup = new Timeout(this.countQuiz);
            timeoutPopup.addPopup();
            timeoutPopup.signalBtn.add(this.losePopupEvent, this);
            this.addChild(timeoutPopup);
            timeoutPopup.makeTweenPopup();
            this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
            //
            IronSource.instance().gameoverSoloMode();
            IronSource.instance().showInterstitialGameOverSoloMode();
        }
    }
    userChoosedWrongAnswer() {
        this.stopAudio();
        setTimeout(() => {
            this.createLosePopup();
            this.countQuiz = 0;
        }, 1500);
        this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
    }
    createLosePopup() {
        var losePopup = new LosePopup(this.countQuiz);
        losePopup.addPopup();
        losePopup.signalBtn.add(this.losePopupEvent, this);
        this.addChild(losePopup);
        losePopup.makeTweenPopup();
        //
        IronSource.instance().gameoverSoloMode();
        IronSource.instance().showInterstitialGameOverSoloMode();
    }
    losePopupEvent(res) {
        if (res.type == "RANK") {
            this.stopAudio();
            this.getRanking();
        } else if (res.type == "HOME") {
            this.stopAudio();
            this.event.backToHome.dispatch();
        } else if (res.type == "REPLAY") {
            this.stopAudio();
            this.event.playAgain.dispatch(this.playlist);
        }
    }
    userChoosedCorrectAnswer() {
        this.countQuiz += 1;
        if (this.countQuiz > this.archived.achieved) {
            let obj = this.rewards.filter(ele => ele.number_question == this.countQuiz);
            if (obj[0] !== undefined) {
                this.sendGetNextQuestion();
            } else {
                if (this.countQuiz == this.questions.length) {
                    this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
                    setTimeout(() => {
                        var popup = new DoneSoloMode(this.questions.length, 0, {
                            name: this.playlist.name,
                            id: this.playlist.id
                        });
                        popup.addPopup();
                        popup.makeTweenPopup();
                        popup.event.goHome.add(this.doneSoloModeGoHome, this);
                        popup.event.getRank.add(this.doneSoloModeGetRank, this);
                        this.addChild(popup);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.resetQuestion();
                    }, 1000);
                }
            }
        } else {
            let obj = this.rewards.filter(ele => ele.number_question == this.countQuiz);
            // LogConsole.log(obj);
            if (obj[0] !== undefined) {
                this.sendGetNextQuestion();
                //
            } else {
                if (this.countQuiz == this.questions.length) {
                    this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
                    setTimeout(() => {
                        var popup = new DoneSoloMode(this.questions.length, 0, {
                            name: this.playlist.name,
                            id: this.playlist.id
                        });
                        popup.addPopup();
                        popup.makeTweenPopup();
                        popup.event.goHome.add(this.doneSoloModeGoHome, this);
                        popup.event.getRank.add(this.doneSoloModeGetRank, this);
                        this.addChild(popup);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.resetQuestion();
                    }, 1000);
                }
            }
        }
    }

    doneSoloModeClaim(is_watched_ads) {
        this.is_watched_ads = is_watched_ads;
        this.sendSoloModeGotReward(this.countQuiz, this.playlist.id, is_watched_ads);
    }

    createRewardPopup(val, num, type) {
        var popupReward = new Reward(num, val, type);
        popupReward.addPopup();
        this.addChild(popupReward);
        popupReward.makeTweenPopup();
        popupReward.signalClaim.addOnce(this.onReceivedReward, this);
        popupReward.signalNextQuestion.addOnce(this.onNextQuestion, this);
        popupReward.signalStop.addOnce(this.onSignalStop, this);
    }

    onSignalStop() {
        this.stopAudio();
    }

    createPopupNotReward(answer) {
        this.resetQuestion();
    }

    sendGetNextQuestion() {
        //
        let current_number_question = this.rewards.findIndex((element) => {
            return element.number_question == this.countQuiz;
        })
        let song_ids = new SFS2X.SFSArray();
        for (let i = 0; i < this.questions.length; i++) {
            song_ids.addLong(this.questions[i].songEntity.id);
        }
        if (this.rewards[current_number_question].number_question < 56) {
            let params = new SFS2X.SFSObject();
            params.putInt('playlist_id', this.playlist.id);
            params.putInt('next_question_number', this.rewards[current_number_question + 1].number_question);
            params.putSFSArray('song_ids', song_ids);
            SocketController.instance().sendData(DataCommand.SOLO_MODE_NEXT_QUESTION_REQUEST, params);
        } else {
            this.checkWhatReward();
        }
    }

    checkWhatReward() {
        let obj = this.rewards.filter(ele => ele.number_question == this.countQuiz);
        if (this.countQuiz > this.archived.achieved) {
            this.archived.achieved = this.countQuiz;
            this.gotRewardStatus = true;
            if (this.countQuiz < this.questions.length) {
                if (obj[0].number_question !== 56) {
                    setTimeout(() => {
                        this.createRewardPopup(obj[0].reward, obj[0].number_question, obj[0].reward_type);
                    }, 600);
                }
            } else {
                this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
                setTimeout(() => {
                    var popup = new DoneSoloMode(this.questions.length, this.rewards[this.rewards.length - 1].reward, {
                        name: this.playlist.name,
                        id: this.playlist.id
                    });
                    popup.addPopup();
                    popup.makeTweenPopup();
                    popup.event.goHome.add(this.doneSoloModeGoHome, this);
                    popup.event.getRank.add(this.doneSoloModeGetRank, this);
                    popup.event.claim.add(this.doneSoloModeClaim, this);
                    popup.event.stopSong.add(this.onSignalStop, this);
                    this.addChild(popup);
                }, 1000);
            }
        } else {
            if (this.countQuiz < this.questions.length) {
                setTimeout(() => {
                    this.createPopupNotReward(obj[0].number_question);
                }, 600);
            } else {
                this.sendSoloModeFinishRequest(this.countQuiz, this.playlist.id);
                setTimeout(() => {
                    var popup = new DoneSoloMode(this.questions.length, 0, {
                        name: this.playlist.name,
                        id: this.playlist.id
                    });
                    popup.addPopup();
                    popup.makeTweenPopup();
                    popup.event.goHome.add(this.doneSoloModeGoHome, this);
                    popup.event.getRank.add(this.doneSoloModeGetRank, this);
                    this.addChild(popup);
                }, 1000);
            }
        }
    }

    onNextQuestion() {
        this.resetQuestion();
    }

    onReceivedReward(is_watched_ads) {
        this.is_watched_ads = is_watched_ads;
        this.sendSoloModeGotReward(this.countQuiz, this.playlist.id, is_watched_ads);
    }

    sendSoloModeGotReward(achieved, playlistId, is_watched_ads) {
        this.archived.achieved = achieved;
        var soloModeResult = new SFS2X.SFSObject();
        soloModeResult.putInt('playlist_id', playlistId);
        soloModeResult.putInt('new_achieved', achieved);
        soloModeResult.putInt('is_watched_ads', is_watched_ads);
        //
        SocketController.instance().sendData(DataCommand.SOLO_MODE_GOT_REWARD_REQUEST, soloModeResult);
    }

    getRanking() {
        this.RankingScreen = new RankingSoloMode();
        this.RankingScreen.setData([], [], this.playlist);
        this.addChild(this.RankingScreen);
    }

    setData(questions, archived, rewards, playlist, highest_number_of_correct) {
        this.questions = questions;
        this.archived = archived;
        this.rewards = rewards;
        this.playlist = playlist;
        this.highest_number_of_correct = highest_number_of_correct;
    }
    resetQuestion() {
        if (this.countQuiz < this.questions.length) {
            this.choosed = false;
            this.gotRewardStatus = false;
            this.addDotsGroup();
            for (let i = 0; i < window.MQ.posAchievementPractice.length; i++) {
                // LogConsole.log(window.MQ.posAchievementPractice[i]);
                this.CreateAnswerAndDiamondText(
                    window.MQ.posAchievementPractice[i].answerPosX * window.GameConfig.RESIZE,
                    window.MQ.posAchievementPractice[i].answerPosY * window.GameConfig.RESIZE,
                    window.MQ.posAchievementPractice[i].diamondPosX * window.GameConfig.RESIZE,
                    window.MQ.posAchievementPractice[i].diamondPosY * window.GameConfig.RESIZE,
                    this.rewards[i].number_question,
                    this.rewards[i].reward,
                    this.rewards[i].reward_type,
                    window.MQ.posCirclePractice[i].x * window.GameConfig.RESIZE,
                    window.MQ.posCirclePractice[i].y * window.GameConfig.RESIZE);
            }
            this.createDotAnswered();
            this.tweenSpriteTime.stop();
            this.spriteTime.destroy();
            this.answerA.destroy();
            this.answerB.destroy();
            this.answerC.destroy();
            this.answerD.destroy();
            this.removeAnswerGroup();
            this.addLoadingSong();

            // this.addCorrectLOL();
            //
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SOLO_MODE_FINISH_RESPONSE) {
            if (evtParams.params.getUtfString('status') == 'OK') {
                //
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_solomode);
                //
                LogConsole.log(evtParams.params.getDump());
                if (this.countQuiz == this.questions.length) {
                    if (this.gotRewardStatus == false) {

                    }
                }
            }
        }
        if (evtParams.cmd == DataCommand.SOLO_MODE_GOT_REWARD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                if (this.countQuiz == this.questions.length) {
                    this.txtGem.setText(SocketController.instance().dataMySeft.diamond);
                } else {
                    this.txtGem.setText(SocketController.instance().socket.mySelf.getVariable('diamond').value);
                }
            } else {
                console.warn(evtParams.params.getUtfString('message'));
            }
        }
        if (evtParams.cmd == DataCommand.SOLO_MODE_NEXT_QUESTION_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handlePracticeQuestions(evtParams.params, () => {
                    this.checkWhatReward();
                });
            }
        }
    }

    handlePracticeQuestions(params, callback) {
        var questions = params.getSFSArray('questions');
        var questionArrs = [];
        for (let i = 0; i < questions.size(); i++) {
            let question = questions.getSFSObject(i);
            let answer1 = question.getUtfString('answer1');
            let answer2 = question.getUtfString('answer2');
            let answer3 = question.getUtfString('answer3');
            let answer4 = question.getUtfString('answer4');
            let correctAnswer = question.getInt('correct_answer');
            let fileUrl = question.getUtfString('file_path');
            let listenLink = question.getUtfString('file_path');
            let idSong = question.getLong('song_id');
            questionArrs.push({
                answers: [
                    answer1,
                    answer2,
                    answer3,
                    answer4
                ],
                correctAnswer: correctAnswer,
                songEntity: {
                    listenLink: listenLink,
                    id: idSong,
                    fileUrl: fileUrl
                }
            });
        }

        for (let j = 0; j < questionArrs.length; j++) {
            this.questions.push(questionArrs[j]);
        }
        callback();
    }

    doneSoloModeGoHome() {
        this.stopAudio();
        this.event.backToHome.dispatch();
    }
    doneSoloModeGetRank() {
        this.stopAudio();
        this.getRanking();
    }


    sendSoloModeFinishRequest(numberOfCorrtect, playlistId) {
        var soloModeResult = new SFS2X.SFSObject();
        soloModeResult.putInt('playlist_id', playlistId);
        soloModeResult.putInt('number_of_correct', numberOfCorrtect);
        SocketController.instance().sendData(DataCommand.SOLO_MODE_FINISH_REQUEST, soloModeResult);
    }

    destroy() {
        this.removeEventExtension();
        this.loadAudioSource.remove();
        this.tweenSpriteTime.stop();
        game.tweens.removeFrom(this.spriteTime);
        ControllSound.instance().removeAllSound();
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