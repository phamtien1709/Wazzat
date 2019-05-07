import TurnBasePlayChallenge from "./TurnBasePlayChallenge.js";
import TurnBasePlayWin from "./TurnBasePlayWin.js";
import TurnBasePlayBeChallenge from "./TurnBasePlayBeChallenge.js";
import TurnbasePlayHistoryGame from "./TurnbasePlayHistoryGame.js";
import IllegalTurn from "../item/IllegalTurn.js";
import DataCommand from "../../../common/DataCommand.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import ControllSound from "../../../controller/ControllSound.js";
import TurnBasePlayTutorial from "./TurnBasePlayTutorial.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllLoading from "../../ControllLoading.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBasePlay extends BaseGroup {
    constructor(type = null) {
        super(game);
        this.type = type;
        this.screenChallenge = null;
        this.screenBeChallenged = null;
        this.screenTutorial = null;
        this.screenWin = null;
        this.screenHistory = null;
        this.challengeMsg = "";
        this.event = {
            historyPlayTurn: new Phaser.Signal(),
            screenRehome: new Phaser.Signal(),
            screenWinScreenBeChallengedChallengAgain: new Phaser.Signal(),
            playIllegalTurn: new Phaser.Signal(),
            illegalTurnCancle: new Phaser.Signal(),
            screenChallengeNextGame: new Phaser.Signal(),
            historyChallenge: new Phaser.Signal()
        }
        this.addEventExtension();
    }

    setData(questions, opponent, user_playlist_mapping, opponent_playlist_mapping, playlist, opponentAnswerLogs) {
        this.questions = { ...questions };
        this.opponent = { ...opponent };
        this.user_playlist_mapping = { ...user_playlist_mapping };
        this.opponent_playlist_mapping = { ...opponent_playlist_mapping };
        this.playlist = { ...playlist };
        if (this.type == "BECHALLENGED") {
            this.opponentAnswerLogs = { ...opponentAnswerLogs };
        }
        if (this.type == "TUTORIAL") {
            this.opponentAnswerLogs = { ...opponentAnswerLogs };
        }
    }

    setDataBeChallenged(play_log_id, request_id, isHasHistory, weeklyResult, historyGameLog, dataTurnbase) {
        if (this.type == "BECHALLENGED") {
            if (isHasHistory) {
                this.play_log_id = play_log_id;
                this.request_id = request_id;
                this.isHasHistory = isHasHistory;
                this.weeklyResult = weeklyResult;
                this.historyGameLog = historyGameLog;
                this.dataTurnbase = dataTurnbase;
            } else {
                this.play_log_id = play_log_id;
                this.request_id = request_id;
                this.isHasHistory = isHasHistory;
                this.weeklyResult = weeklyResult;
                this.dataTurnbase = dataTurnbase;
            }
        }
    }

    setDataChallenge(play_log_id, request_id, isHasHistory, weeklyResult, historyGameLog) {
        if (this.type == "CHALLENGE") {
            if (isHasHistory) {
                this.play_log_id = play_log_id;
                this.request_id = request_id;
                this.isHasHistory = isHasHistory;
                this.weeklyResult = weeklyResult;
                this.historyGameLog = historyGameLog;
            } else {
                this.play_log_id = play_log_id;
                this.request_id = request_id;
                this.isHasHistory = isHasHistory;
                this.weeklyResult = weeklyResult;
            }
        }
    }

    addScreenPlay() {
        this.timeCountActionPhase = game.time.create();
        if (this.type == "CHALLENGE") {
            if (this.isHasHistory) {
                this.addScreenHistory();
            } else {
                this.addScreenChallenge();
                this.timeCountActionPhase.start();
            }
        } else if (this.type == "BECHALLENGED") {
            if (this.isHasHistory) {
                this.addScreenHistory();
            } else {
                this.addScreenBeChallenged();
                this.timeCountActionPhase.start();
            }
        } else {
            this.addScreenTutorial();
            this.timeCountActionPhase.start();
        }
    }

    addScreenTutorial() {
        this.removeScreenTutorial();
        this.screenTutorial = new TurnBasePlayTutorial();
        this.screenTutorial.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.opponentAnswerLogs);
        this.screenTutorial.setDataBeChallenged(this.play_log_id, this.request_id, this.isHasHistory);
        this.screenTutorial.event.resultGame.add(this.onCompleteBeChallenged, this);
        this.screenTutorial.event.doneTutorial.add(this.doneTutorial, this);
        this.screenTutorial.afterInit();
        this.addChild(this.screenTutorial);
    }
    doneTutorial() {
        window.GameConfig.IS_TUTORIAL = false;
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    removeScreenTutorial() {
        if (this.screenTutorial !== null) {
            this.removeChild(this.screenTutorial);
            this.screenTutorial.destroy();
            this.screenTutorial = null;
        }
    }

    addScreenChallenge() {
        this.removeScreenChallenge();
        this.screenChallenge = new TurnBasePlayChallenge();
        this.screenChallenge.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist);
        this.screenChallenge.event.resultGame.add(this.onCompleteChallenge, this);
        this.screenChallenge.afterInit();
        this.addChild(this.screenChallenge);
    }
    removeScreenChallenge() {
        if (this.screenChallenge !== null) {
            this.removeChild(this.screenChallenge);
            this.screenChallenge.destroy();
            this.screenChallenge = null;
        }
    }
    onCompleteChallenge(result) {
        this.result = { ...result };
        this.handledJSONResultToSfsResultChallengeMode(result, (challengeGameResult) => {
            // LogConsole.log(challengeGameResult.getDump());
            ControllLoading.instance().showLoading();
            this.sendGameFinishRequest(DataCommand.CHALLENGE_GAME_FINISH_REQUEST, challengeGameResult);
            //
            // LogConsole.log(parseInt(this.timeCountActionPhase.ms / 1000));
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, parseInt(this.timeCountActionPhase / 1000));
            this.timeCountActionPhase.stop();
            this.timeCountActionPhase.destroy();
            //
        });
    }

    addScreenBeChallenged() {
        this.removeScreenBeChallenged();
        //
        this.screenBeChallenged = new TurnBasePlayBeChallenge();
        this.screenBeChallenged.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.opponentAnswerLogs);
        this.screenBeChallenged.setDataBeChallenged(this.play_log_id, this.request_id, this.isHasHistory);
        this.screenBeChallenged.event.resultGame.add(this.onCompleteBeChallenged, this);
        this.screenBeChallenged.afterInit();
        this.addChild(this.screenBeChallenged);
    }
    removeScreenBeChallenged() {
        if (this.screenBeChallenged !== null) {
            this.removeChild(this.screenBeChallenged);
            this.screenBeChallenged.destroy();
            this.screenBeChallenged = null;
        }
    }
    onCompleteBeChallenged(result) {
        this.result = { ...result };
        this.handledJSONResultToSfsResultBeChallengedMode(result, (beChallengeGameResult) => {
            ControllLoading.instance().showLoading();
            this.sendGameFinishRequest(DataCommand.BECHALLENGED_GAME_FINISH_REQUEST, beChallengeGameResult);
            //
            LogConsole.log(parseInt(this.timeCountActionPhase.ms / 1000));
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.play_time, parseInt(this.timeCountActionPhase / 1000));
            this.timeCountActionPhase.stop();
            this.timeCountActionPhase.destroy();
            //
        });
    }

    handledJSONResultToSfsResultChallengeMode(result, callback) {
        LogConsole.log(result);
        var challengeGameResult = new SFS2X.SFSObject();
        var answers = new SFS2X.SFSArray();
        this.putValueToAnswers(answers, result, (answers) => {
            // LogConsole.log(answers.getDump());
            challengeGameResult.putSFSArray('answers', answers);
        });
        challengeGameResult.putInt("score", result.score);
        challengeGameResult.putInt("opponent_id", result.opponent_id);
        challengeGameResult.putInt("playlist_id", result.playlist_id);
        callback(challengeGameResult);
    }

    handledJSONResultToSfsResultBeChallengedMode(result, callback) {
        // console.log('HDJKFHSDKF')
        LogConsole.log(result);
        var beChallengeGameResult = new SFS2X.SFSObject();
        var answers = new SFS2X.SFSArray();
        this.putValueToAnswers(answers, result, (answers) => {
            // LogConsole.log(answers.getDump());
            beChallengeGameResult.putSFSArray('answers', answers);
        });
        beChallengeGameResult.putInt("score", result.score);
        // beChallengeGameResult.putLong("game_log_id", result.game_log_id);
        beChallengeGameResult.putInt("playlist_id", result.playlist_id);
        beChallengeGameResult.putLong("challenge_request_id", result.challenge_request_id);
        callback(beChallengeGameResult);
    }

    putValueToAnswers(answers, result, callback) {
        for (let i = 0; i < 5; i++) {
            let answer = new SFS2X.SFSObject();
            answer.putFloat("answer_time", result.answers[i].answer_time);
            answer.putUtfString("result", result.answers[i].result);
            answer.putInt("answer", result.answers[i].answer);
            answer.putInt("streak", result.answers[i].streak);
            answer.putLong("question_id", result.answers[i].question_id);
            answer.putLong("created", result.answers[i].created);
            answers.addSFSObject(answer);
        }
        callback(answers);
    }

    sendGameFinishRequest(method, gameResult) {
        LogConsole.log(gameResult.getDump());
        SocketController.instance().sendData(method, gameResult);
    }

    switchToScreenWin(type) {
        this.addScreenWin(type);
        this.removeScreenChallenge();
        this.removeScreenBeChallenged();
    }

    addScreenHistory() {
        this.removeScreenHistory();
        this.screenHistory = new TurnbasePlayHistoryGame();
        this.screenHistory.setType(this.type);
        this.screenHistory.setData(this.historyGameLog.questions, this.opponent, this.historyGameLog.user_playlist_mapping, this.historyGameLog.opponent_playlist_mapping, this.historyGameLog.playlist, this.historyGameLog.result, this.historyGameLog.result.opponentAnswerLogs, this.weeklyResult);
        this.screenHistory.afterInit();
        this.screenHistory.event.playYourTurn.add(this.historyPlayTurn, this);
        this.screenHistory.event.reHome.add(this.screenRehome, this);
        this.screenHistory.event.challenge.add(this.historyChallenge, this);
        this.addChild(this.screenHistory);
    }
    removeScreenHistory() {
        if (this.screenHistory !== null) {
            this.removeChild(this.screenHistory);
            this.screenHistory.destroy();
            this.screenHistory = null;
        }
    }
    historyPlayTurn() {
        this.removeScreenHistory();
        this.event.historyPlayTurn.dispatch();
        // this.addScreenPlay();
    }

    historyChallenge() {
        this.removeScreenHistory();
        this.event.historyChallenge.dispatch();

    }

    addScreenWin(type) {
        this.removeScreenWin();
        this.screenWin = new TurnBasePlayWin(type);
        // LogConsole.log(this.result);
        this.screenWin.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.result, this.challengeMsg);
        if (type == "BECHALLENGED") {
            this.screenWin.setDataBeChallenged(this.play_log_id, this.request_id, this.isHasHistory, this.opponentAnswerLogs, this.weeklyResult, this.dataTurnbase);
        } else {
            this.screenWin.setDataChallenge(this.play_log_id, this.request_id);
        }
        this.screenWin.addScreen();
        this.screenWin.event.screenReHome.add(this.screenRehome, this);
        this.screenWin.event.screenBeChallengedChallengAgain.add(this.screenWinScreenBeChallengedChallengAgain, this);
        this.screenWin.event.screenChallengeNextGame.add(this.screenChallengeNextGame, this);
        this.addChild(this.screenWin);
    }
    removeScreenWin() {
        if (this.screenWin !== null) {
            this.removeChild(this.screenWin);
            this.screenWin.destroy();
            this.screenWin = null;
        }
    }
    screenRehome() {
        this.event.screenRehome.dispatch();
    }
    screenWinScreenBeChallengedChallengAgain() {
        this.event.screenWinScreenBeChallengedChallengAgain.dispatch();
    }
    screenChallengeNextGame(res) {
        this.event.screenChallengeNextGame.dispatch(res);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.CHALLENGE_GAME_FINISH_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                //
                // ControllLoading.instance().hideLoading();
                this.request_id = evtParams.params.getLong('challenge_request_id');
                this.challengeMsg = evtParams.params.getUtfString('challenge_msg');
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_turnbase);
                //
                this.switchToScreenWin("CHALLENGE");
            } else if (evtParams.params.getUtfString('status') == "WARNING") {
                // ControllLoading.instance().hideLoading();
                this.handleIllegalTurn(evtParams.params);
            }
        } else if (evtParams.cmd == DataCommand.BECHALLENGED_GAME_FINISH_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                //
                FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.pro_quiz_end_turnbase);
                // ControllLoading.instance().hideLoading();
                //
                this.switchToScreenWin("BECHALLENGED");
            }
        }
    }
    handleIllegalTurn(params) {
        // LogConsole.log(params.getDump());
        let opponent_game_log = params.getLong('opponent_game_log');
        let request_id = params.getLong('challenge_request_id');
        this.illlegalTurn = {
            request_id: request_id,
            game_log_id: opponent_game_log
        };
        this.illlegalTurnModule = new IllegalTurn();
        this.illlegalTurnModule.setData(this.opponent);
        this.illlegalTurnModule.event.playIllegalTurn.add(this.playIllegalTurn, this);
        this.illlegalTurnModule.event.illegalTurnCancle.add(this.illegalTurnCancle, this);
        this.addChild(this.illlegalTurnModule);
        ControllLoading.instance().hideLoading();
        this.illlegalTurnModule.makeNewGameBeChallenged(this.illlegalTurn, () => {
            this.illlegalTurnModule.addPopupIllegalTurn();
        });
    }
    playIllegalTurn(res) {
        this.event.playIllegalTurn.dispatch(res);
    }
    illegalTurnCancle() {
        this.event.illegalTurnCancle.dispatch();
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    destroy() {
        this.removeEventExtension();
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