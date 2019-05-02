import TurnBasePlayWinChallenge from "./TurnBasePlayWinChallenge.js";
import TurnBasePlayWinBeChallenged from "./TurnBasePlayWinBeChallenged.js";
import IronSource from "../../../IronSource.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBasePlayWin extends BaseGroup {
    constructor(type) {
        super(game);
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.type = type;
        this.screenChallenge = null;
        this.screenBeChallenged = null;
        this.challenge_msg = '';
        this.event = {
            screenReHome: new Phaser.Signal(),
            screenBeChallengedChallengAgain: new Phaser.Signal(),
            screenChallengeNextGame: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {

    }

    addScreen() {
        if (this.type == "CHALLENGE") {
            this.addScreenChallenge();
        } else {
            this.addScreenBeChallenged();
        }
        IronSource.instance().playTurnBase();
        IronSource.instance().showInterstitialTurnBase();
    }

    addScreenChallenge() {
        this.removeScreenChallenge();
        this.screenChallenge = new TurnBasePlayWinChallenge();
        this.screenChallenge.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.result, this.challenge_msg, this.play_log_id, this.request_id);
        this.screenChallenge.afterInit();
        this.screenChallenge.event.reHome.add(this.screenReHome, this);
        this.screenChallenge.event.nextGame.add(this.screenChallengeNextGame, this);
        this.addChild(this.screenChallenge);
    }
    removeScreenChallenge() {
        if (this.screenChallenge !== null) {
            this.removeChild(this.screenChallenge);
            this.screenChallenge.destroy();
            this.screenChallenge = null;
        }
    }
    screenReHome() {
        this.event.screenReHome.dispatch();
    }
    screenChallengeNextGame(res) {
        this.event.screenChallengeNextGame.dispatch(res);
    }

    addScreenBeChallenged() {
        this.removeScreenBeChallenged();
        this.screenBeChallenged = new TurnBasePlayWinBeChallenged();
        this.screenBeChallenged.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.result, this.opponentAnswerLogs, this.weeklyResult, this.play_log_id, this.request_id, this.dataTurnbase);
        this.screenBeChallenged.afterInit();
        this.screenBeChallenged.event.challengeAgain.add(this.challengeAgain, this);
        this.screenBeChallenged.event.reHome.add(this.screenReHome, this);
        this.addChild(this.screenBeChallenged);
    }
    removeScreenBeChallenged() {
        if (this.screenBeChallenged !== null) {
            this.removeChild(this.screenBeChallenged);
            this.screenBeChallenged.destroy();
            this.screenBeChallenged = null;
        }
    }
    challengeAgain() {
        this.event.screenBeChallengedChallengAgain.dispatch();
    }

    setData(questions, opponent, user_playlist_mapping, opponent_playlist_mapping, playlist, result, challenge_msg) {
        this.questions = questions;
        this.opponent = opponent;
        this.user_playlist_mapping = user_playlist_mapping;
        this.opponent_playlist_mapping = opponent_playlist_mapping;
        this.playlist = playlist;
        this.result = result;
        this.challenge_msg = challenge_msg
    }

    setDataBeChallenged(play_log_id, request_id, isHasHistory, opponentAnswerLogs, weeklyResult, dataTurnbase) {
        if (this.type == "BECHALLENGED") {
            this.play_log_id = play_log_id;
            this.request_id = request_id;
            this.isHasHistory = isHasHistory;
            this.opponentAnswerLogs = opponentAnswerLogs;
            this.weeklyResult = weeklyResult;
            this.dataTurnbase = dataTurnbase;
        }
    }

    setDataChallenge(play_log_id, request_id) {
        if (this.type == "CHALLENGE") {
            this.play_log_id = play_log_id;
            this.request_id = request_id;
        }
    }
}