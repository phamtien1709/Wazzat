import BaseView from "../../BaseView.js";
import SocketController from "../../../controller/SocketController.js";
import DataCommand from "../../../common/DataCommand.js";
import OnlineModeCommand from "../../../model/onlineMode/dataField/OnlineModeCommand.js";
import OnlineModeCRDataCommand from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataCommand.js";
import OnlineModeDataField from "../../../model/onlineMode/dataField/OnlineModeDataField.js";
import ListView from "../../../../libs/listview/list_view.js";
import OnlineModeItemAnswer from "./OnlineModeItemAnswer.js";
import Clock from "../../component/Clock.js";
import OnlineModeButtonRemoveTwoAnswer from "./OnlineModeButtonRemoveTwoAnswer.js";
import ButtonBase from "../../component/ButtonBase.js";
import ControllSound from "../../../controller/ControllSound.js";
import SendOnlineModeUserSelectedAnswer from "../../../model/onlineMode/server/senddata/SendOnlineModeUserSelectedAnswer.js";
import OnlineModeItemQuestion from "./OnlineModeItemQuestion.js";
import MainData from "../../../model/MainData.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import OnlineModeActionPhase from "./OnlineModeActionPhase.js";
import OnlineModeCRDataField from "../../../model/onlinemodecreatroom/datafield/OnlineModeCRDataField.js";
import DataUser from "../../../model/user/DataUser.js";
import Language from "../../../model/Language.js";

const timeCount = 10.5;

export default class OnlineModeShowQuestion extends BaseView {

    constructor(arrQuestion, idx) {
        super(game, null);
        this.event = {
            close: new Phaser.Signal()
        }

        this.idxNextQuestion = null;
        this.ktSendChoose = false;
        this.eventChooseAnswer = new Phaser.Signal();
        this.eventShowQuestion = new Phaser.Signal();

        this.idx = idx;
        this.arrQuestion = arrQuestion;
        this.ktChooseHelp = false;
        this.answerSelect = -1;
        this.buildQuestionByIndex();
        this.tween = null;
        this.addEvent();
    }
    addEventChooseAnswer(callback, scope) {
        this.eventChooseAnswer.add(callback, scope);
    }
    removeEventChooseAnswer(callback, scope) {
        this.eventChooseAnswer.remove(callback, scope);
    }
    dispatchEventChooseAnswer(data) {
        this.eventChooseAnswer.dispatch(data);
    }

    addEventShowQuestion(callback, scope) {
        this.eventShowQuestion.add(callback, scope);
    }
    removeEventShowQuestion(callback, scope) {
        this.eventShowQuestion.add(callback, scope);
    }
    dispatchEventShowQuestion() {
        this.eventShowQuestion.dispatch(this.idx);
    }


    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        SocketController.instance().events.onPublicMessage.add(this.onPublicMessage, this);
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        SocketController.instance().events.onPublicMessage.remove(this.onPublicMessage, this);
    }

    onPublicMessage(event) {
        let command = event.message;
        if (command === DataCommand.CHAT_ONLINE_MODE) {
            let sender = event.sender;
            let isMe = sender.isItMe;
            if (isMe) {
                //this.btnChat.alpha = 0.4;
                this.btnChat.inputEnabled = false;

                setTimeout(() => {
                    // this.btnChat.alpha = 1;
                    if (this.btnChat.parent) {
                        this.btnChat.inputEnabled = true;
                    }
                }, 3000);
            }
        }
    }

    getData(data) {
        let correct_answer;
        switch (data.cmd) {
            case OnlineModeCommand.ONLINE_MODE_MOVE_TO_NEXT_QUESTION:
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_MOVE_TO_NEXT_QUESTION:

                if (this.ktSend === false) {
                    this.ktSend = true;
                    /*
                   for (let i = 0; i < this.arrAnswer.length; i++) {
                       this.arrAnswer[i].setTextNoChoose();
                   }
                   let correct_answer = this.arrQuestion[this.idx].correct_answer;
                   this.arrAnswer[(correct_answer - 1)].setTrueText();
                   */
                }

                for (let i = 0; i < this.arrAnswer.length; i++) {
                    this.arrAnswer[i].setTextNoChoose();
                }
                correct_answer = this.arrQuestion[this.idx].correct_answer;
                this.arrAnswer[(correct_answer - 1)].setTrueText();

                if (this.answerSelect !== -1) {
                    if (this.answerSelect !== correct_answer) {
                        this.arrAnswer[(this.answerSelect - 1)].setFailText();
                    }
                }

                this.removeNextQuestion();
                this.idxNextQuestion = game.time.events.add(Phaser.Timer.SECOND * 2, this.buildNextQuestion, this, data.params.getInt(OnlineModeDataField.question_index));
                break;
            case OnlineModeCommand.ONLINE_MODE_GAME_RESULT:
            case OnlineModeCommand.ONLINE_MODE_ROOM_GAME_RESULT:
                for (let i = 0; i < this.arrAnswer.length; i++) {
                    this.arrAnswer[i].setTextNoChoose();
                }
                correct_answer = this.arrQuestion[this.idx].correct_answer;
                this.arrAnswer[(correct_answer - 1)].setTrueText();
                if (this.answerSelect !== -1) {
                    if (this.answerSelect !== correct_answer) {
                        this.arrAnswer[(this.answerSelect - 1)].setFailText();
                    }
                }
                this.buildEndGame();
                break;
            case OnlineModeCRDataCommand.SUPPORT_RESPONSE:
                //this.buildHelpAnswer();
                break;
            case OnlineModeCommand.ONLINE_MODE_USER_SELECTED_ANSWER_RESPONSE:
            case OnlineModeCRDataCommand.ONLINE_MODE_ROOM_USER_SELECTED_ANSWER_RESPONSE:
                let is_correct_answer = data.params.getBool(OnlineModeCRDataField.is_correct_answer);
                let user_id = data.params.getInt(OnlineModeCRDataField.user_id);
                let streak = data.params.getInt(OnlineModeCRDataField.streak);
                if (is_correct_answer === true && user_id === SocketController.instance().dataMySeft.user_id && streak > 1) {
                    this.showStreakAnswer(streak, this.arrQuestion[this.idx].correct_answer)
                }
                break;
        }
    }

    buildEndGame() {
        if (this.ktSendChoose === false) {
            let objChoose = {
                idx: this.idx,
                correct_answer: false,
                time: timeCount - 0.5
            }
            this.arrQuestion[this.idx].playerChoose = objChoose;
            this.dispatchEventChooseAnswer(objChoose);
        } else {
            this.ktSendChoose = false;
        }

        ControllSound.instance().removeSound();
        //game.sound.stopAll();
    }

    removeNextQuestion() {
        if (this.idxNextQuestion !== null) {
            game.time.events.remove(this.idxNextQuestion);
        }
    }
    buildNextQuestion(question_index) {
        LogConsole.log("buildNextQuestion : " + question_index)
        this.streakAnswer.setDefault();
        if (this.idx < this.arrQuestion.length) {
            if (this.ktSendChoose === false) {
                let objChoose = {
                    idx: this.idx,
                    correct_answer: false,
                    time: timeCount - 0.5
                }

                this.arrQuestion[this.idx].playerChoose = objChoose;
                this.dispatchEventChooseAnswer(objChoose);
            } else {
                this.ktSendChoose = false;
            }
        }

        this.idx = question_index - 1;
        if (this.idx > this.arrQuestion.length - 1) {
            this.ktSend = true;
        } else {
            this.buildQuestionByIndex();
            this.dispatchEventShowQuestion();
        }
    }

    buildHelpAnswer() {
        let arrAnswerFail = [];
        let i = 0;
        for (i = 1; i < 5; i++) {
            if (i === this.arrQuestion[this.idx].correct_answer) {

            } else {
                arrAnswerFail.push(i);
            }
        }
        LogConsole.log("correct_answer " + this.arrQuestion[this.idx].correct_answer);
        LogConsole.log(arrAnswerFail);

        arrAnswerFail.splice(game.rnd.integerInRange(0, 2), 1);
        LogConsole.log(arrAnswerFail);

        for (i = 0; i < arrAnswerFail.length; i++) {
            LogConsole.log("arrAnswerFail[i] : " + arrAnswerFail[i]);
            this.arrAnswer[arrAnswerFail[i] - 1].setTextNoChoose();
            this.arrAnswer[arrAnswerFail[i] - 1].setNoChoose();
        }
    }


    afterCreate() {
        this.positionCreateRoom = JSON.parse(game.cache.getText('positionCreateRoom'));

        this.streakAnswer = null;

        this.txtQuestion = new OnlineModeItemQuestion();
        this.txtQuestion.x = 0;
        this.txtQuestion.y = 0;
        this.addChild(this.txtQuestion);


        let parentAnswer = new Phaser.Group(game, 0, 0, null);
        this.listAnswer = new ListView(game, parentAnswer, new Phaser.Rectangle(0, 0, game.width, 500 * MainData.instance().scale), {
            direction: 'y',
            padding: 15 * MainData.instance().scale,
            searchForClicks: true
        });

        parentAnswer.x = 0;
        parentAnswer.y = 75 * MainData.instance().scale;
        this.addChild(parentAnswer);

        this.arrAnswer = [];
        this.listAnswer.removeAll();
        this.listAnswer.reset();

        for (let i = 0; i < 4; i++) {
            let txtAnswer = new OnlineModeItemAnswer(this.chooseAnswer, this);
            let constX = (game.width - txtAnswer.width) / 2;
            txtAnswer.x = constX;
            txtAnswer.setConstX(constX);
            this.listAnswer.add(txtAnswer);
            this.arrAnswer.push(txtAnswer);
        }

        this.clock = new Clock();
        this.clock.addEventCompleteTime(this.timeComplete, this);
        this.clock.x = game.width - 100;
        this.clock.y = -20;
        // this.addChild(this.clock);    

        this.btnBo2DapAn = new OnlineModeButtonRemoveTwoAnswer(this.positionCreateRoom.question_button_bodapan_bg, this.chooseBo2Dapan, this);
        this.addChild(this.btnBo2DapAn);

        this.btnChat = new ButtonBase(this.positionCreateRoom.question_button_chat, this.chooseChat, this);
        this.addChild(this.btnChat);

        this.buildStreakAnswer();
    }

    chooseChat() {
        ControllScreenDialog.instance().addChatOnlineMode();
    }

    chooseBo2Dapan() {
        LogConsole.log("chooseBo2Dapan");
        if (SocketController.instance().dataMySeft.support_item > 0) {
            if (this.ktChooseHelp === false && this.ktSend === false) {
                this.ktChooseHelp = true;
                SocketController.instance().dataMySeft.support_item = SocketController.instance().dataMySeft.support_item - 1;
                if (SocketController.instance().dataMySeft.support_item < 0) {
                    SocketController.instance().dataMySeft.support_item = 0;
                }
                this.buildHelpAnswer();
                SocketController.instance().sendData(OnlineModeCRDataCommand.SUPPORT_REQUEST, null);
            } else {

            }
        } else {
            ControllScreenDialog.instance().addDialog(Language.instance().getData("53"));
        }
    }

    timeComplete() { }

    buildQuestionByIndex() {
        LogConsole.log("buildQuestionByIndex - " + this.idx);

        this.answerSelect = -1;

        this.clock.countTimer(timeCount);
        this.ktSend = false;
        this.ktChooseHelp = false;

        /*
        game.sound.stopAll();
        game.sound.play(this.arrQuestion[this.idx].file_path);*/
        ControllSound.instance().playsound(this.arrQuestion[this.idx].file_path);

        this.txtQuestion.setText(this.arrQuestion[this.idx].question_type);
        this.txtQuestion.setPlayerChoose(this.arrQuestion[this.idx].user_choose);

        for (let i = 0; i < this.arrQuestion[this.idx].arrAnser.length; i++) {
            this.arrAnswer[i].setData(this.arrQuestion[this.idx].arrAnser[i], i);
        }
    }


    hideQuestion() {
        for (let i = 0; i < this.arrQuestion[this.idx].arrAnser.length; i++) {
            this.arrAnswer[i].hideAnswer(i);
        }
        this.txtQuestion.setText("");

        this.tween = game.add.tween(this).to({
            y: this.y
        }, 500, Phaser.Easing.Power1, true);

        this.tween.onComplete.add(this.handleComplete, this);
    }

    handleComplete() {
        this.event.close.dispatch();
    }

    chooseAnswer(event) {
        LogConsole.log("chooseAnswer");
        LogConsole.log(event);
        if (this.ktSend == false) {
            if (event.noChoose) {

            } else {
                let timeLive = this.clock.getTime();
                this.ktSend = true;
                if (timeLive > 0) {

                    for (let i = 0; i < this.arrAnswer.length; i++) {
                        this.arrAnswer[i].setTextNoChoose();
                    }

                    event.setChooseAnswer();

                    let objChoose = {
                        idx: this.idx,
                        correct_answer: false,
                        time: 0
                    }
                    this.answerSelect = event.getIdx() + 1;
                    let timeUse = timeCount - timeLive - 0.5;
                    if (timeUse > 10) {
                        timeUse = 10;
                    }
                    if (timeUse < 0.1) {
                        timeUse = 0.1;
                    }
                    let correct_answer = this.arrQuestion[this.idx].correct_answer

                    LogConsole.log("this.answerSelect : " + this.answerSelect);
                    LogConsole.log("correct_answer : " + correct_answer);

                    objChoose.time = timeUse;


                    if (this.answerSelect == correct_answer) {
                        LogConsole.log("dung-----------");
                        event.setTrueText();
                        objChoose.correct_answer = true;
                        DataUser.instance().playlist.setExpPlaylistById(this.arrQuestion[this.idx].playlist_id);
                    } else {
                        LogConsole.log("sai-----------");
                        event.setFailText();
                        //this.arrAnswer[(correct_answer - 1)].setTrueText();

                    }

                    this.arrQuestion[this.idx].playerChoose = objChoose;

                    this.dispatchEventChooseAnswer(objChoose);

                    this.ktSendChoose = true;

                    let typeCommand = "";
                    if (MainData.instance().modeplay === MainData.instance().MODEPLAY.OnlineMode) {
                        typeCommand = OnlineModeCommand.ONLINE_MODE_USER_SELECTED_ANSWER_REQUEST;
                    } else {
                        typeCommand = OnlineModeCRDataCommand.ONLINE_MODE_ROOM_USER_SELECTED_ANSWER_REQUEST;
                    }

                    SocketController.instance().sendData(typeCommand,
                        SendOnlineModeUserSelectedAnswer.begin(
                            (this.idx + 1),
                            this.answerSelect,
                            correct_answer,
                            timeUse))
                } else {
                    LogConsole.log("het thoi gian tra loi cau hoi");
                }
            }
        }
    }

    buildStreakAnswer() {
        this.removeStreakAnswer();
        this.streakAnswer = new OnlineModeActionPhase();
        this.streakAnswer.x = (this.game.width - this.streakAnswer.width) / 2;
        this.addChild(this.streakAnswer);

        this.hideStreakAnswer();
    }

    hideStreakAnswer() {
        this.streakAnswer.visible = false;
    }

    showStreakAnswer(streak, idxTrue) {
        this.streakAnswer.visible = true;
        this.streakAnswer.setStreak(streak);
        console.log("showStreakAnswer : " + idxTrue);
        if (idxTrue === 2) {
            this.streakAnswer.y = 280;
        } else if (idxTrue === 3) {
            this.streakAnswer.y = 50;
        } else if (idxTrue === 1) {
            this.streakAnswer.y = 235;
        } else if (idxTrue === 4) {
            this.streakAnswer.y = 105;
        }

    }

    removeStreakAnswer() {
        console.log(this.streakAnswer);
        if (this.streakAnswer !== null) {
            this.removeChild(this.streakAnswer);
            this.streakAnswer.destroy();
            this.streakAnswer = null;
        }
    }

    getArrQuestion() {
        return this.arrQuestion;
    }
    destroy() {
        ControllSound.instance().removeAllSound();
        ControllScreenDialog.instance().removeChatOnlineMode();

        this.removeEvent();
        this.eventChooseAnswer.dispose();

        this.txtQuestion.destroy();

        this.listAnswer.removeAll();
        this.listAnswer.destroy();
        this.clock.destroy();
        if (this.tween !== null) {
            this.tween.stop();
            game.tweens.remove(this.tween);
            this.tween = null;
        }
        super.destroy();
    }
}