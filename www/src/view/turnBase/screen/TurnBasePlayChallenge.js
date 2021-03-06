import UserSpriteRight from "../../../modules/play/UserSpriteRight.js";
import UserSpriteLeft from "../../../modules/play/UserSpriteLeft.js";
import LoadingAnim from "../../component/LoadingAnim.js";
import AnswerPlayController from "../item/button/AnswerPlayController.js";
import OnlineModeTrueFailAnswer from "../../onlinemode/item/OnlineModeTrueFailAnswer.js";
import DataCommand from "../../../common/DataCommand.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import Common from "../../../common/Common.js";
import ControllSound from "../../../controller/ControllSound.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import OnlineModeActionPhase from "../../onlinemode/item/OnlineModeActionPhase.js";
import MainData from "../../../model/MainData.js";
import SqlLiteController from "../../../SqlLiteController.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBasePlayChallenge extends BaseGroup {
    constructor() {
        super(game);
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.event = {
            resultGame: new Phaser.Signal()
        };
        this.checkUseSpt = false;
    }

    afterInit() {
        this.addEventExtension();
        this.addScreenLoadTurnBase();
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    addScreenLoadTurnBase() {
        //
        this.score = 0;
        this.scoreOpp = 0;
        this.countQuiz = 0;
        this.correctList = [];
        this.wrongList = [];
        this.streak = 1;
        this.answers = [];
        this.result;
        this.bg = new Phaser.Sprite(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
        let lineTop = new SpriteBase(this.positionPlayConfig.line_top);
        this.addChild(lineTop);
        this.loadScreenPlayChallenged('Lượt tiếp');
        this.addNamePlaylistAndTextLoading();
        this.addActionPhase();
    }

    addNamePlaylistAndTextLoading() {
        this.namePlaylist = new Phaser.Text(game, this.positionPlayConfig.namePlaylist.x * window.GameConfig.RESIZE, (this.positionPlayConfig.namePlaylist.y + 80) * window.GameConfig.RESIZE, this.playlist.name, this.positionPlayConfig.namePlaylist.configs);
        this.namePlaylist.anchor.set(0.5);
        this.addChild(this.namePlaylist);
        let tweenNamePlaylist = game.add.tween(this.namePlaylist).to({ y: this.positionPlayConfig.namePlaylist.y * window.GameConfig.RESIZE }, 300, Phaser.Easing.Linear.Out, false);
        tweenNamePlaylist.start();
        this.loadingAnim = new LoadingAnim();
        this.addChild(this.loadingAnim);
    }

    addActionPhase() {
        this.actionPhase = new OnlineModeActionPhase();
        this.actionPhase.position.x = (this.game.width - this.actionPhase.width) / 2
        this.addChild(this.actionPhase);
    }

    loadScreenPlayChallenged(scoreOpp) {
        let versus = new Phaser.Sprite(game, this.positionPlayConfig.versus.x * window.GameConfig.RESIZE, this.positionPlayConfig.versus.y * window.GameConfig.RESIZE, this.positionPlayConfig.versus.nameAtlas, this.positionPlayConfig.versus.nameSprite);
        versus.anchor.set(0.5);
        let txt_versus = new Phaser.Text(game, this.positionPlayConfig.txt_versus.x * window.GameConfig.RESIZE, this.positionPlayConfig.txt_versus.y * window.GameConfig.RESIZE, this.positionPlayConfig.txt_versus.text, this.positionPlayConfig.txt_versus.configs);
        txt_versus.anchor.set(0.5);
        versus.addChild(txt_versus);
        versus.scale.set(0.1);
        this.addChild(versus);
        let tweenVs = game.add.tween(versus.scale).to({ x: 1, y: 1 }, 400, "Linear");
        tweenVs.start();
        //
        this.UserSpriteRight = new UserSpriteRight();
        this.UserSpriteRight.setAva('ava_fb', SocketController.instance().dataMySeft.vip);
        this.UserSpriteRight.setPosition();
        this.UserSpriteRight.setNameAndScore('You', this.score);
        this.UserSpriteRight.setLevelPlaylist(this.user_playlist_mapping);
        this.UserSpriteRight.addDotOnline();
        this.addChild(this.UserSpriteRight);
        this.UserSpriteRight.makeTweenAvaLoading();
        //        
        this.trueOrFalseUser = new OnlineModeTrueFailAnswer();
        this.trueOrFalseUser.setSize(330 * window.GameConfig.RESIZE, 330 * window.GameConfig.RESIZE);
        this.trueOrFalseUser.x = (-160 + 480) * window.GameConfig.RESIZE;
        this.trueOrFalseUser.y = (-160 + 10 + 125) * window.GameConfig.RESIZE;
        this.addChild(this.trueOrFalseUser);
        //
        this.UserSpriteLeft = new UserSpriteLeft(this.opponent);
        this.UserSpriteLeft.setAva(this.opponent.avatar, this.opponent.vip);
        this.UserSpriteLeft.setPosition();
        this.UserSpriteLeft.setNameAndScore(this.opponent.userName, scoreOpp);
        this.UserSpriteLeft.setLevelPlaylist(this.opponent_playlist_mapping);
        this.UserSpriteLeft.addDotOnline();
        this.addChild(this.UserSpriteLeft);
        //
        this.trueOrFalseOpp = new OnlineModeTrueFailAnswer();
        this.trueOrFalseOpp.setSize(330 * window.GameConfig.RESIZE, 330 * window.GameConfig.RESIZE);
        this.trueOrFalseOpp.x = (-160 + 150) * window.GameConfig.RESIZE;
        this.trueOrFalseOpp.y = (-160 + 10 + 125) * window.GameConfig.RESIZE;
        this.addChild(this.trueOrFalseOpp);
        this.UserSpriteLeft.makeTweenAvaLoading();
        //
        this.loadAfter();
    }

    loadAfter() {
        var arrSongs = [];
        for (let i = 0; i < 5; i++) {
            arrSongs.push(this.questions[i].songEntity.fileUrl);
        }
        ControllSound.instance().loadSoundArray(arrSongs);
        ControllSound.instance().event.loadComplete.add(this.loadComplete, this);
    }

    setData(questions, opponent, user_playlist_mapping, opponent_playlist_mapping, playlist) {
        this.questions = questions;
        this.opponent = opponent;
        this.user_playlist_mapping = user_playlist_mapping;
        this.opponent_playlist_mapping = opponent_playlist_mapping;
        this.playlist = playlist;
    }

    loadComplete() {
        LogConsole.log('load complete');
        this.loadingAnim.destroy();
        this.makeTweenToPlay();
    }

    loadStart() {

    }

    makeTweenToPlay() {
        //
        if (this.countQuiz == 0) {
            this.UserSpriteLeft.makeTweenAva();
            this.UserSpriteRight.makeTweenAva();
        } else {

        }
        //
        this.addBtnRemoveAnswer();
        this.createGamePlayChallenged();
    }

    createGamePlayChallenged() {
        //this is play song
        this.timeCounter = game.time.create();
        // this.songChoicedPlay = game.add.audio(`songChoiced${this.countQuiz}`);
        if (this.countQuiz == 0) {
            this.createLoadingScreenAfterStart();
        } else {
            // create answer
            this.displayAnswering();
        }
    }

    addCircleNormal() {
        for (let i = 0; i < 5; i++) {
            if (this.countQuiz == 0) {
                setTimeout(() => {
                    let circleNormal = new Phaser.Sprite(game, (this.positionPlayConfig.circleNormal.x + i * 62) * window.GameConfig.RESIZE, ((game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.circleNormal.y) + 50) * window.GameConfig.RESIZE, this.positionPlayConfig.circleNormal.nameAtlas, this.positionPlayConfig.circleNormal.nameSprite);
                    circleNormal.anchor.set(0.5);
                    let tweenCircle = game.add.tween(circleNormal).to({ y: (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.circleNormal.y) * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
                    tweenCircle.start();
                    this.addChild(circleNormal);
                }, i * 50);
            }
        }
    }

    addCorrectListSprites() {
        for (let i = 0; i < this.correctList.length; i++) {
            var circleWhite = new Phaser.Sprite(game, (this.positionPlayConfig.circleWhite.x + this.correctList[i].countQuiz * 62) * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.circleWhite.y) * window.GameConfig.RESIZE, this.positionPlayConfig.circleWhite.nameAtlas, this.positionPlayConfig.circleWhite.nameSprite);
            circleWhite.anchor.set(0.5);
            this.addChild(circleWhite);
            var correctMini = new Phaser.Text(game, 0, 3 * window.GameConfig.RESIZE,
                this.correctList[i].time.toFixed(1), {
                    font: "GilroyBold",
                    fontSize: 15
                });
            correctMini.anchor.set(0.5);
            circleWhite.addChild(correctMini);
        }
    }

    addWrongListSprites() {
        for (let i = 0; i < this.wrongList.length; i++) {
            var circleWhite = new Phaser.Sprite(game, (this.positionPlayConfig.circleWhite.x + this.wrongList[i] * 62) * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.circleWhite.y) * window.GameConfig.RESIZE, this.positionPlayConfig.circleWhite.nameAtlas, this.positionPlayConfig.circleWhite.nameSprite);
            circleWhite.anchor.set(0.5);
            this.addChild(circleWhite);
            var wrongMini = new Phaser.Sprite(game,
                0, 0, this.positionPlayConfig.wrongMini.nameAtlas, this.positionPlayConfig.wrongMini.nameSprite);
            wrongMini.anchor.set(0.5);
            circleWhite.addChild(wrongMini);
        }
    }

    createLoadingScreenAfterStart() {
        var soundCountDown = game.add.audio('beep_audio');
        var countdownNumber = new Phaser.Text(game, this.positionPlayConfig.countdownNumber.x * window.GameConfig.RESIZE, (this.positionPlayConfig.countdownNumber.y + 80) * window.GameConfig.RESIZE, '3', this.positionPlayConfig.countdownNumber.configs);
        countdownNumber.anchor.set(0.5);
        this.addChild(countdownNumber);
        let firstTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
        firstTween.start();
        // window.MQ.soundCountDown.play();
        soundCountDown.play();
        firstTween.onComplete.add(() => {
            // countdownNumber.scale.set(1);
            countdownNumber.y = (this.positionPlayConfig.countdownNumber.y + 80) * window.GameConfig.RESIZE;
            countdownNumber.setText('2');
            let secondTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
            secondTween.start();
            soundCountDown.play();
            // window.MQ.soundCountDown.play();
            secondTween.onComplete.add(() => {
                countdownNumber.y = (this.positionPlayConfig.countdownNumber.y + 80) * window.GameConfig.RESIZE;
                countdownNumber.setText('1');
                let thirdTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
                thirdTween.start();
                soundCountDown.play();
                // window.MQ.soundCountDown.play();
                thirdTween.onComplete.add(() => {
                    //
                    FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_start_turnbase);
                    //
                    countdownNumber.setText(Language.instance().getData("270"));
                    countdownNumber.scale.set(0.5);
                    countdownNumber.y = (this.positionPlayConfig.countdownNumber.y + 80) * window.GameConfig.RESIZE;
                    let startTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y * window.GameConfig.RESIZE }, 1000, Phaser.Easing.Elastic.Out, false);
                    startTween.start();
                    startTween.onComplete.add(() => {
                        countdownNumber.destroy();
                        soundCountDown.destroy();
                        this.addCircleNormal();
                        this.displayAnswering();
                    })
                })
            })
        })
    }

    displayAnswering() {
        this.namePlaylist.destroy();
        this.btn_remove_answer.revive();
        // this.songChoicedPlay.play();
        // console.log('LINK PLAY' + this.questions[this.countQuiz].songEntity.fileUrl);
        ControllSound.instance().playsound(this.questions[this.countQuiz].songEntity.fileUrl);
        //
        this.timeTweenBegin = game.time.events.add(Phaser.Timer.SECOND * 0.5, () => {
            this.spriteTime = new Phaser.Sprite(game, 0, (game.height - 746) * window.GameConfig.RESIZE, 'otherSprites', 'tween-time');
            this.spriteTime.anchor.set(0, 0.5);
            this.addChild(this.spriteTime);
            this.tweenSpriteTime = game.add.tween(this.spriteTime.scale).to({ x: 70, y: 1 }, 10000, "Linear");
            this.createFourAnswer();
            this.timeTweenStart = game.time.events.add(Phaser.Timer.SECOND * 0.2, () => {
                this.tweenSpriteTime.start();
                this.timeCounter.start();
                // this.activeAnswer();
            }, this);
            this.btn_remove_answer.inputEnabled = true;
            this.btn_remove_answer.alpha = 1;
            this.tweenSpriteTime.onComplete.add(() => {

            });
        });
    }

    activeAnswer() {
        this.answerA.activeInput();
        this.answerB.activeInput();
        this.answerC.activeInput();
        this.answerD.activeInput();
    }

    addBtnRemoveAnswer() {
        this.btn_remove_answer = new Phaser.Button(game, this.positionPlayConfig.btn_remove_answer.x * window.GameConfig.RESIZE, (game.height - MainData.instance().STANDARD_HEIGHT + this.positionPlayConfig.btn_remove_answer.y) * window.GameConfig.RESIZE, this.positionPlayConfig.btn_remove_answer.nameAtlas, () => { }, this, null, this.positionPlayConfig.btn_remove_answer.nameSprite);
        this.btn_remove_answer.anchor.set(0.5);
        this.btn_remove_answer.kill();
        //
        var txt_remove_answer = new Phaser.Text(game, this.positionPlayConfig.txt_remove_answer.x * window.GameConfig.RESIZE, this.positionPlayConfig.txt_remove_answer.y * window.GameConfig.RESIZE, Language.instance().getData("271"), this.positionPlayConfig.txt_remove_answer.configs);
        txt_remove_answer.anchor.set(0.5);
        //
        var txt_dis_1 = new TextBase(this.positionPlayConfig.txt_dis_one, this.positionPlayConfig.txt_dis_one.text);
        txt_dis_1.anchor.set(0.5);
        txt_dis_1.x = txt_remove_answer.x + txt_remove_answer.width / 2 + 15;
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
        this.btn_remove_answer.inputEnabled = false;
        this.btn_remove_answer.events.onInputDown.add(this.sendRemoveAnswer, this);
        this.addChild(this.btn_remove_answer);
    }

    removeAnswer() {
        this.countMic--;
        this.numberOfSptItem.setText(this.countMic);
        // this.btn_remove_answer.kill();
        this.btn_remove_answer.inputEnabled = false;
        this.btn_remove_answer.alpha = 0.5;
        Common.getTwoOfFourAnswer(this.answerA, this.answerB, this.answerC, this.answerD, this.questions[this.countQuiz]);
        // this.sendRemoveAnswer();
    }

    sendRemoveAnswer() {
        this.btn_remove_answer.inputEnabled = false;
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.checkUseSpt == false) {
            if (SocketController.instance().dataMySeft.support_item > 0) {
                SocketController.instance().sendData(DataCommand.SUPPORT_REQUEST, null);
            } else {
                ControllScreenDialog.instance().addDialog("Bạn không đủ Míc");
            }
        }
    }


    createFourAnswer() {
        // LogConsole.log(this.questions);
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.answerA = new AnswerPlayController(game.width / 2, ((game.height - 576) + (i * 122)) * window.GameConfig.RESIZE, {
                    index: i,
                    questions: this.questions,
                    countQuiz: this.countQuiz
                });
                this.answerA.event.answer.add(this.updateOnClickAnswer, this);
                this.addChild(this.answerA);
            }
            if (i == 1) {
                this.answerB = new AnswerPlayController(game.width / 2, ((game.height - 576) + (i * 122)) * window.GameConfig.RESIZE, {
                    index: i,
                    questions: this.questions,
                    countQuiz: this.countQuiz
                });
                this.answerB.event.answer.add(this.updateOnClickAnswer, this);
                this.addChild(this.answerB);
            }
            if (i == 2) {
                this.answerC = new AnswerPlayController(game.width / 2, ((game.height - 576) + (i * 122)) * window.GameConfig.RESIZE, {
                    index: i,
                    questions: this.questions,
                    countQuiz: this.countQuiz
                });
                this.answerC.event.answer.add(this.updateOnClickAnswer, this);
                this.addChild(this.answerC);
            }
            if (i == 3) {
                this.answerD = new AnswerPlayController(game.width / 2, ((game.height - 576) + (i * 122)) * window.GameConfig.RESIZE, {
                    index: i,
                    questions: this.questions,
                    countQuiz: this.countQuiz
                });
                this.answerD.event.answer.add(this.updateOnClickAnswer, this);
                this.addChild(this.answerD);
            }
        }
    }

    updateOnClickAnswer(idxOfAnswer) {
        this.answerA.sprite.inputEnabled = false;
        this.answerB.sprite.inputEnabled = false;
        this.answerC.sprite.inputEnabled = false;
        this.answerD.sprite.inputEnabled = false;
        this.answered = idxOfAnswer;
        LogConsole.log(this.questions);
        LogConsole.log(idxOfAnswer);
        if ((idxOfAnswer + 1) == this.questions[this.countQuiz].correctAnswer) {
            this.setActionPhaseOnCorrect();
            this.setTrueAva();
            this.answeredResult = true;
            if (this.timeCounter.ms / 1000 > 10) {
                this.score += Math.floor((11 - 10) * 100 * (Math.pow(11 - 10, (this.streak - 1) / 4)));
                this.correctList.push({
                    countQuiz: this.countQuiz,
                    time: 10
                });
            } else {
                let ms = parseFloat((this.timeCounter.ms / 1000).toFixed(1));
                this.score += Math.floor((11 - ms) * 100 * (Math.pow(11 - ms, (this.streak - 1) / 4)));
                this.correctList.push({
                    countQuiz: this.countQuiz,
                    time: ms
                });
            }
            this.setScore(this.score);
            //
            SqlLiteController.instance().updateExpPlaylist(this.playlist.id);
        } else {
            this.setFalseAva();
            this.answeredResult = false;
            this.wrongList.push(this.countQuiz);
        }
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.setTrueFalseTabAnswer(this.answerA, i);
            }
            if (i == 1) {
                this.setTrueFalseTabAnswer(this.answerB, i);
            }
            if (i == 2) {
                this.setTrueFalseTabAnswer(this.answerC, i);
            }
            if (i == 3) {
                this.setTrueFalseTabAnswer(this.answerD, i);
            }
        }
        this.pushResultAnswer();
        // LogConsole.log(this.answers);
        this.addCorrectListSprites();
        this.addWrongListSprites();
        this.timeNextQuestion = game.time.events.add(Phaser.Timer.SECOND * 1, this.resetQuestion, this);
    }

    setActionPhaseOnCorrect() {
        if (this.questions[this.countQuiz].correctAnswer > 2) {
            this.actionPhase.position.y = (game.height - 636);
        } else {
            this.actionPhase.position.y = (game.height - 416);
        }
        // this.actionPhase.alpha = 1;
        this.actionPhase.setStreak(this.streak);
        this.addChild(this.actionPhase);
    }

    pushResultAnswer() {
        var trueFalse = "INCORRECT";
        if (this.answeredResult == true) {
            trueFalse = "CORRECT";
        }
        if (this.timeCounter.ms / 1000 > 10) {
            this.answers.push({
                answer_time: 10,
                result: trueFalse,
                answer: this.answered + 1,
                streak: this.streak,
                question_id: this.questions[this.countQuiz].id,
                created: Date.now(),
                index: 0
            })

        } else {
            let ms = parseFloat((this.timeCounter.ms / 1000).toFixed(1));
            this.answers.push({
                answer_time: ms,
                result: trueFalse,
                answer: this.answered + 1,
                streak: this.streak,
                question_id: this.questions[this.countQuiz].id,
                created: Date.now(),
                index: 0
            })
        }
    }

    removeTimeNextQuestion() {
        if (this.timeNextQuestion !== null) {
            game.time.events.remove(this.timeNextQuestion);
        }
    }

    resetQuestion() {
        // game.sound.stopAll();
        this.removeTimeNextQuestion();
        this.tweenSpriteTime.stop();
        this.timeCounter.stop();
        this.actionPhase.setDefault();
        // this.songChoicedPlay.stop();
        this.spriteTime.destroy();
        this.timeCounter.destroy();
        this.checkUseSpt = false;
        this.answerA.destroy();
        this.answerB.destroy();
        this.answerC.destroy();
        this.answerD.destroy();
        if (this.answeredResult == true) {
            this.streak++;
        } else {
            this.streak = 1;
        }
        if (this.countQuiz < 4) {
            this.countQuiz += 1;
            this.createGamePlayChallenged();
        } else {
            ControllSound.instance().removeSound();
            this.result = {
                answers: this.answers,
                score: this.score,
                opponent_id: this.opponent.id,
                playlist_id: this.playlist.id
            }
            this.event.resultGame.dispatch(this.result);
        }
    }
    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.SUPPORT_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.removeAnswer();
            }
        }
    }
    setTrueFalseTabAnswer(sprite, index) {
        if (index == this.answered) {
            if (index == (this.questions[this.countQuiz].correctAnswer - 1)) {
                sprite.displayScreenWhenAnswerRight();
            } else {
                sprite.displayScreenWhenAnswerWrong();
            }
        } else {
            if (index == this.questions[this.countQuiz].correctAnswer - 1) {
                sprite.displayScreenWhenAnswerRight();
            } else {
                sprite.displayScreenWhenAnswerNotChoosed();
            }
        }
    }

    setTrueAva() {
        this.trueOrFalseUser.setTrueAnswer();
    }

    setFalseAva() {
        this.trueOrFalseUser.setFailtAnswer();
    }

    setTrueAvaOpp() {
        this.trueOrFalseOpp.setTrueAnswer();
    }

    setFalseAvaOpp() {
        this.trueOrFalseOpp.setFailtAnswer();
    }

    setScore(score) {
        this.UserSpriteRight.setScore(score);
    }

    setScoreOpp(score) {
        this.UserSpriteLeft.setScore(score);
    }

    destroy() {
        this.removeEventExtension();
        game.time.events.remove(this.timeTweenBegin);
        game.time.events.remove(this.timeTweenStart);
        ControllSound.instance().event.loadComplete.remove(this.loadComplete, this);
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