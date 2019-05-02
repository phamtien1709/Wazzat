import OnlineModeDataField from "../../../../model/onlineMode/dataField/OnlineModeDataField.js";
import GetPlayListDetail from "../../../../model/shop/server/getdata/GetPlayListDetail.js";
import SocketController from "../../../../controller/SocketController.js";
import BaseView from "../../../BaseView.js";
import EventModeCommand from "../../../../model/eventmode/datafield/EventModeCommand.js";
import Question from "../../../../model/onlineMode/data/Question.js";
import EventModeDatafield from "../../../../model/eventmode/datafield/EventModeDatafield.js";
import EventModeQuestion from "./EventModeQuestion.js";
import LoadingAnim from "../../../component/LoadingAnim.js";
import MainData from "../../../../model/MainData.js";
import ControllSound from "../../../../controller/ControllSound.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import PopupBadConnection from "../../../popup/PopupBadConnection.js";
import IronSource from "../../../../IronSource.js";
import Language from "../../../../model/Language.js";

export default class EventModeControllLoadQuestion extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            change_local_me: new Phaser.Signal(),
            fail_question: new Phaser.Signal(),
            done_game: new Phaser.Signal(),
            cancle_bad_connect: new Phaser.Signal()
        }

        this.arrQuestion = [];
        this.idxLoad = 0;
        this.ktLoad = false;
        this.ktFist = true;
        this.ktEvendEnd = false;
        this.idxNextQuestion = null;
        this.idBadConnect = null;
        this.idxQuestion = 0;
        this.loading = null;
        this.badConnect = null;
        this.remaining_question_number = 0;

        /*
        this.loader = new Phaser.Loader(game);
        this.loader.onLoadStart.add(this.loadStart, this);
        this.loader.onLoadComplete.add(this.loadComplete, this);
        this.loader.onFileComplete.add(this.onFileComplete, this);*/




        this.question = new EventModeQuestion();
        this.question.event.next_question.add(this.buildNextQuestionUser, this);
        this.question.event.fail_question.add(this.buildFailQuestionUser, this);
        this.question.event.show_loading.add(this.addLoading, this);
        this.question.event.hide_loading.add(this.removeLoading, this);

        this.question.y = game.height - 591 * MainData.instance().scale;
        this.addChild(this.question);

        ControllSound.instance().removeAllSound();

        this.addLoading();

        this.addEvent();
    }

    addLoading() {
        this.removeLoading();
        this.loading = new LoadingAnim();
        this.addChild(this.loading);
    }
    removeLoading() {
        if (this.loading !== null) {
            this.removeChild(this.loading);
            this.loading.destroy();
            this.loading = null;
        }
    }

    loadStart() {
        LogConsole.log("loadStart----------");
    }

    onFileComplete(progress, key, error, loadedFileCount, totalFileCount) {
        LogConsole.log("onFileComplete ----------");
    }

    loadComplete() {
        LogConsole.log("loadComplete---------- : " + this.idxLoad);
        this.idxLoad++;
        if (this.idxLoad < this.arrQuestion.length) {
            this.beginLoad();
            if (this.ktFist === true) {

                IronSource.instance().playEventMode();

                this.ktFist = false;
                this.removeIdBadConnect();
                // SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_READY_REQUEST, null);
                this.idxQuestion = 0;
                this.question.showQuestion();
                this.buildNextQuestion();
                this.removeLoading();
            }
        } else {

            /*
            if (this.ktFist) {
                this.ktFist = false;
                // SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_READY_REQUEST, null);
                this.idxQuestion = 0;
                this.question.showQuestion();
                this.buildNextQuestion();
                this.removeLoading();
            }*/
            this.ktLoad = false;
        }
    }

    addEvent() {
        SocketController.instance().events.onExtensionResponse.add(this.getData, this);
        ControllSound.instance().event.loadComplete.add(this.loadComplete, this);
    }
    removeEvent() {
        SocketController.instance().events.onExtensionResponse.remove(this.getData, this);
        ControllSound.instance().event.loadComplete.remove(this.loadComplete, this);

        this.question.event.next_question.remove(this.buildNextQuestionUser, this);
        this.question.event.fail_question.remove(this.buildFailQuestionUser, this);
        this.question.event.show_loading.remove(this.addLoading, this);
        this.question.event.hide_loading.remove(this.removeLoading, this);
    }

    getData(data) {
        switch (data.cmd) {
            case EventModeCommand.EVENT_MODE_QUESTION_RESPONSE:
                this.addDataQuestion(data.params);
                break;
            case EventModeCommand.EVENT_MODE_START_GAME:
                this.idxQuestion = data.params.getInt(EventModeDatafield.question_index) - 1;
                this.question.showQuestion();
                this.buildNextQuestion();
                break;
            case EventModeCommand.EVENT_MODE_MOVE_TO_NEXT_QUESTION:
                this.removeLoading();
                this.idxQuestion = data.params.getInt(EventModeDatafield.question_index) - 1;
                this.removeNextQuestion();
                this.idxNextQuestion = game.time.events.add(Phaser.Timer.SECOND * 1, this.buildNextQuestion, this);
                break
            case EventModeCommand.EVENT_MODE_EVENT_ENDED:
                this.ktEvendEnd = true;
                break;
        }
    }

    removeNextQuestion() {
        if (this.idxNextQuestion !== null) {
            game.time.events.remove(this.idxNextQuestion);
        }
    }

    buildFailQuestionUser() {
        if (this.ktEvendEnd === false) {
            this.event.fail_question.dispatch(this.idxQuestion);
        }
    }

    removeIdBadConnect() {
        if (this.idBadConnect !== null) {
            game.time.events.remove(this.idBadConnect);
        }
    }

    addShowBadConnect() {
        this.removeShowBadConnect();
        this.badConnect = new PopupBadConnection();
        this.badConnect.setTextOk("CHƠI TIẾP");
        this.badConnect.setTextCancle("QUAY LẠI");
        this.badConnect.event.OK.add(this.chooseOkBadConnect, this);
        this.badConnect.event.CANCLE.add(this.chooseCancleBadConnect, this);
        this.badConnect.setTextConfirm(Language.instance().getData("6"));
        this.addChild(this.badConnect);
    }

    chooseOkBadConnect() {
        //this.beginLoad();
        this.removeShowBadConnect();
        this.removeIdBadConnect();
        this.idBadConnect = game.time.events.add(Phaser.Timer.SECOND * 10, this.addShowBadConnect, this);
    }

    chooseCancleBadConnect() {
        SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_DONE_GAME_REQUEST, null);
        this.event.cancle_bad_connect.dispatch();
    }

    removeShowBadConnect() {
        if (this.badConnect !== null) {
            this.removeChild(this.badConnect);
            this.badConnect.destroy();
            this.badConnect = null;
        }
    }



    buildNextQuestionUser() {
        this.idxQuestion++;
        console.log("buildNextQuestionUser : " + this.idxQuestion);
        console.log("idxLoad : " + this.idxLoad);

        if (this.remaining_question_number === 0 && this.idxQuestion === this.arrQuestion.length) {
            //ControllScreenDialog.instance().addDialog("ket thuc van");
            SocketController.instance().sendData(EventModeCommand.EVENT_MODE_USER_DONE_GAME_REQUEST, null);
            this.event.done_game.dispatch();
        } else {
            if (this.idxQuestion < this.idxLoad) {
                this.removeLoading();
                this.removeIdBadConnect();
                this.removeNextQuestion();
                this.removeShowBadConnect();
                this.idxNextQuestion = game.time.events.add(Phaser.Timer.SECOND * 1, this.buildNextQuestion, this);

            } else {
                this.idxQuestion--;
                this.addLoading();
                this.removeIdBadConnect();
                this.idBadConnect = game.time.events.add(Phaser.Timer.SECOND * 10, this.addShowBadConnect, this);

            }
        }
    }

    buildNextQuestion() {
        if (this.arrQuestion[this.idxQuestion]) {

            let idxDelete = this.idxQuestion - 4;
            if (idxDelete > -1) {
                ControllSound.instance().removeSoundFromUrl(this.arrQuestion[idxDelete].file_path);
            }

            this.event.change_local_me.dispatch(this.idxQuestion + 1);
            this.question.buildQuestionByIndex(this.idxQuestion, this.arrQuestion[this.idxQuestion]);
        } else {
            ControllScreenDialog.instance().addDialog("Vượt quá câu hỏi nhận được");
        }
    }
    addDataQuestion(data) {
        let questions = data.getSFSArray(OnlineModeDataField.questions);
        this.remaining_question_number = data.getInt("remaining_question_number");
        for (let i = 0; i < questions.size(); i++) {
            let question = questions.getSFSObject(i);
            let item = new Question();
            item.file_path = question.getUtfString(OnlineModeDataField.file_path);
            item.question_type = question.getUtfString(OnlineModeDataField.question_type);
            item.correct_answer = question.getInt(OnlineModeDataField.correct_answer);
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer1));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer2));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer3));
            item.arrAnser.push(question.getUtfString(OnlineModeDataField.answer4));
            this.arrQuestion.push(item);
        }

        if (this.ktLoad === false) {
            this.beginLoad();
        }
    }

    beginLoad() {
        LogConsole.log("this.idxLoad : " + this.idxLoad);
        LogConsole.log("arrQuestion : " + this.arrQuestion.length);
        this.ktLoad = true;

        this.question.setIdxLoad(this.idxLoad);

        ControllSound.instance().loadSound(this.arrQuestion[this.idxLoad].file_path);

        if (this.ktFist === true) {
            this.removeIdBadConnect();
            this.idBadConnect = game.time.events.add(Phaser.Timer.SECOND * 10, this.addShowBadConnect, this);
        }

    }

    destroy() {
        this.removeEvent();
        this.removeAllItem();
        this.removeIdBadConnect();
        this.removeNextQuestion();
        ControllSound.instance().removeAllSound();
    }

}