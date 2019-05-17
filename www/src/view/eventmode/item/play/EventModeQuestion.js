import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";
import OnlineModeItemAnswer from "../../../onlinemode/item/OnlineModeItemAnswer.js";
import SocketController from "../../../../controller/SocketController.js";
import EventModeCommand from "../../../../model/eventmode/datafield/EventModeCommand.js";
import SendEventModeUserSelectAnswer from "../../../../model/eventmode/server/senddata/SendEventModeUserSelectAnswer.js";
import EventModeTimeQuestion from "./EventModeTimeQuestion.js";
import MainData from "../../../../model/MainData.js";
import ControllSound from "../../../../controller/ControllSound.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import Language from "../../../../model/Language.js";

export default class EventModeQuestion extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            show_loading: new Phaser.Signal(),
            hide_loading: new Phaser.Signal(),
            next_question: new Phaser.Signal(),
            fail_question: new Phaser.Signal()
        }
        this.data = null;
        this.idx = 0;
        this.idxLoad = 0;
        this.ktSend = true;
        this.ktSendNexQuestion = false;
        this.positionEventMode = MainData.instance().positionEventMode;

        this.txtNumber = new TextBase(this.positionEventMode.playroom_text_number_question, "");
        this.txtNumber.setTextBounds(0, 0, game.width, 31 * MainData.instance().scale);
        this.addChild(this.txtNumber);

        this.txtDes = new TextBase(this.positionEventMode.playroom_text_des_question, "");
        this.txtDes.setTextBounds(0, 0, game.width, 30 * MainData.instance().scale);
        this.addChild(this.txtDes);

        let beginY = 89;
        this.arrAnswer = [];

        LogConsole.log("answr----------------------------------");
        for (let i = 0; i < 4; i++) {
            let txtAnswer = new OnlineModeItemAnswer(this.chooseAnswer, this);
            txtAnswer.inputEnabled = false;
            let constX = (game.width - txtAnswer.width) / 2;
            txtAnswer.x = constX;
            txtAnswer.y = beginY;
            txtAnswer.setConstX(constX);
            txtAnswer.visible = false;
            this.arrAnswer.push(txtAnswer);
            beginY += txtAnswer.height + 15;
        }
        LogConsole.log("end----------------------------------");
        this.loadingQuestion = new EventModeTimeQuestion();
        this.loadingQuestion.event.complete.add(this.timeCompelte, this);
        this.loadingQuestion.x = 35 * MainData.instance().scale;
        this.loadingQuestion.y = 80 * MainData.instance().scale;
        this.addChild(this.loadingQuestion);
    }

    setIdxLoad(idxLoad) {
        this.idxLoad = idxLoad;
        console.log("setIdxLoad ----------- : " + this.idxLoad);
        console.log("this.ktSendNexQuestion : " + this.ktSendNexQuestion);
        if (this.ktSendNexQuestion === true) {
            this.ktSendNexQuestion = false;
            //SocketController.instance().sendData(EventModeCommand.EVENT_MODE_NEXT_QUESTION_REQUEST,
            // SendEventModeNextQuestion.begin(this.idxLoad + 1));
            this.event.next_question.dispatch();
        }
    }

    timeCompelte() {
        if (this.ktSend === false) {
            this.ktSend = true;

            for (let i = 0; i < this.arrAnswer.length; i++) {
                this.arrAnswer[i].setTextNoChoose();
            }

            let correct_answer = this.data.correct_answer;

            this.arrAnswer[(correct_answer - 1)].setTrueText();

            let is_correct_answer = false;
            let answer_time = 10;
            let is_loaded_next_question = true;

            SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_SELECTED_ANSWER_REQUEST,
                SendEventModeUserSelectAnswer.begin(0, correct_answer, (this.idx + 1), is_loaded_next_question, answer_time, is_correct_answer));

            this.event.fail_question.dispatch();

        }


    }

    showQuestion() {
        for (let i = 0; i < this.arrAnswer.length; i++) {
            this.arrAnswer[i].visible = true;
            this.arrAnswer[i].inputEnabled = true;
            this.addChild(this.arrAnswer[i]);
        }
    }

    chooseAnswer(item) {

        if (this.ktSend === false) {
            this.ktSend = true;
            let answer_time = this.loadingQuestion.getTime();
            console.log("answer_time : " + answer_time);
            let is_correct_answer = false;
            this.loadingQuestion.stopTween();
            for (let i = 0; i < this.arrAnswer.length; i++) {
                this.arrAnswer[i].setTextNoChoose();
            }

            let correct_answer = this.data.correct_answer;
            let answerSelect = item.getIdx() + 1;

            if (answerSelect == correct_answer) {
                item.setTrueText();
                is_correct_answer = true;
                ControllSoundFx.instance().playSound(ControllSoundFx.streakanswer);
            } else {
                item.setFailText();
                is_correct_answer = false;
                this.arrAnswer[(correct_answer - 1)].setTrueText();
            }

            let is_loaded_next_question = false;
            this.ktSendNexQuestion = true;
            if ((this.idx + 1) < this.idxLoad) {
                is_loaded_next_question = true;
                this.ktSendNexQuestion = false;
                //game.time.events.add(Phaser.Timer.SECOND * 5, this.setIdxLoad, this, (this.idx + 2));
            } else {
                //this.event.show_loading.dispatch()
            }

            SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_SELECTED_ANSWER_REQUEST,
                SendEventModeUserSelectAnswer.begin(answerSelect, correct_answer, (this.idx + 1), is_loaded_next_question, answer_time, is_correct_answer));

            if (is_correct_answer === true) {
                this.event.next_question.dispatch();
            } else {
                this.event.fail_question.dispatch();
            }
        } else {

        }
    }

    buildQuestionByIndex(idx, data) {

        this.ktSendNexQuestion = false;

        LogConsole.log("buildQuestionByIndex - " + idx);
        LogConsole.log(data);
        this.idx = idx;
        this.data = data;
        this.ktSend = false;

        this.loadingQuestion.addTween();

        /*
        game.sound.stopAll();
        game.sound.play(this.data.file_path);*/

        ControllSound.instance().playsound(this.data.file_path);

        this.txtNumber.text = Language.instance().getData("21") + " " + (idx + 1) //+ "-" + this.data.correct_answer;

        let strQuestion = "";
        if (data.question_type == "SONG") {
            strQuestion = Language.instance().getData("22");
        } else if (data.question_type == "SINGER") {
            strQuestion = Language.instance().getData("23");
        }
        this.txtDes.text = strQuestion;


        for (let i = 0; i < this.data.arrAnser.length; i++) {
            this.arrAnswer[i].setData(this.data.arrAnser[i], i);
        }
    }

    destroy() {
        this.loadingQuestion.event.complete.remove(this.timeCompelte, this);
        ControllSound.instance().removeSound();
        this.removeAllItem();
    }


}