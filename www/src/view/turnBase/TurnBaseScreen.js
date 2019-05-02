import TurnBaseFindGame from "./screen/TurnBaseFindGame.js";
import TurnBaseChoosePlaylist from "./screen/TurnBaseChoosePlaylist.js";
import TurnBasePlay from "./screen/TurnBasePlay.js";
import ShopUserPlayListMapping from "../../model/shop/data/ShopUserPlayListMapping.js";
import ShopDataField from "../../model/shop/datafield/ShopDatafield.js";
import DataCommand from "../../common/DataCommand.js";
import SocketController from "../../controller/SocketController.js";
import ControllScreen from "../ControllScreen.js";
import ConfigScreenName from "../../config/ConfigScreenName.js";
import ControllLoading from "../ControllLoading.js";
import ControllScreenDialog from "../ControllScreenDialog.js";
import BaseScreenSprite from "../component/BaseScreenSprite.js";
import SqlLiteController from "../../SqlLiteController.js";

export default class TurnBaseScreen extends BaseScreenSprite {

    static get TYPE_BECHALLENGED() {
        return "BECHALLENGED";
    }

    static get TYPE_CHALLENGE() {
        return "CHALLENGE";
    }

    static get TUTORIAL() {
        return "TUTORIAL";
    }

    constructor(opponent = null, type = null, data = null) {
        super();
        if (opponent == null && type == null) {
            this.screenType = 1;
        } else if (type == TurnBaseScreen.TYPE_BECHALLENGED) {
            this.screenType = 3;
        } else if (type == TurnBaseScreen.TYPE_CHALLENGE) {
            this.screenType = 2;
        } else {
            this.screenType = 4;
        }
        this.opponent = opponent;
        this.type = type;
        this.dataTurnbase = data;
        this.findgame = null;
        this.choosePlaylist = null;
        this.playGame = null;
        this.event = {
            backMenu: new Phaser.Signal()
        };
        //
        this.arrResource = [
            {
                type: "text",
                link: "img/config/positionCreateRoom.json",
                key: "positionCreateRoom"
            },
            {
                type: "text",
                link: "img/config/findOpponents.json",
                key: "findOpponentConfig"
            },
            {
                type: "text",
                link: "img/config/positionWinConfig.json",
                key: "positionWinConfig"
            },
            {
                type: "text",
                link: "img/config/positionMainConfig.json",
                key: "positionMainConfig"
            },
            {
                type: "text",
                link: "img/config/limitTurn.json",
                key: "limitTurnConfig"
            },
            {
                type: "atlas",
                link: "img/atlas/playTurnBase.png",
                key: "playSprites",
                linkJson: "img/atlas/playTurnBase.json"
            },
            {
                type: "atlas",
                link: "img/atlas/findOpponent.png",
                key: "findOpponentSprites",
                linkJson: "img/atlas/findOpponent.json"
            }
        ]
        this.loadResource();
    }

    onLoadFileComplete() {
        this.afterInit();
        this.addScreen();
    }

    afterInit() {
        this.playScript = JSON.parse(game.cache.getText('playScript'));
        this.definedData();
        this.addEventExtension();
    }

    definedData() {
        this.historyGameLog = {
            questions: [],
            playlist: {

            },
            result: {
                answers: [],
                score: 0,
                scoreOpp: 0,
                opponentAnswerLogs: []
            },
            user_playlist_mapping: {

            },
            opponent_playlist_mapping: {

            }
        };
        this.playlistHisTory;
        //
        this.questions = [];
        this.playlist = {};
        this.opponentAnswerLogs = [];
        if (this.dataTurnbase) {
            this.weeklyResult = this.dataTurnbase.weeklyResult;
        }
        ControllLoading.instance().showLoading();
    }

    addScreen() {
        if (this.opponent !== null) {
            if (this.type == TurnBaseScreen.TYPE_CHALLENGE) {
                this.sendChallengeGameHistoryRequest();
                this.screenType = 2;
            } else if (this.type == TurnBaseScreen.TYPE_BECHALLENGED) {
                this.handleRequestBeChallengedGame();
                this.screenType = 3;
            } else {
                this.addPlayGame(TurnBaseScreen.TUTORIAL);
                this.screenType = 4;
            }
        } else {
            this.addFindGame();
        }
    }

    sendChallengeGameHistoryRequest() {
        var params = new SFS2X.SFSObject();
        params.putInt("opponent_id", this.opponent.id);
        SocketController.instance().sendData(DataCommand.CHALLENGE_GAME_HISTORY_REQUEST, params);
        //
        ControllLoading.instance().showLoading();
    }

    handleRequestBeChallengedGame() {
        this.sendBeChallengedGameLogRequest(SocketController.instance().dataMySeft.user_id, this.opponent.id);
    }

    sendBeChallengedGameLogRequest(userId, opponentId) {
        var params = new SFS2X.SFSObject();
        params.putInt("opponent_id", opponentId);
        SocketController.instance().sendData(DataCommand.BECHALLENGED_GAME_OPPONENT_GAME_LOG_REQUEST, params);
        //
        ControllLoading.instance().showLoading();
    }

    setDataBeChallenged(play_log_id, request_id, isHasHistory, weeklyResult, dataTurnbase) {
        if (this.type == TurnBaseScreen.TYPE_BECHALLENGED) {
            this.play_log_id = play_log_id;
            this.request_id = request_id;
            this.isHasHistory = isHasHistory;
        }
        this.weeklyResult = this.weeklyResult;
        this.dataTurnbase = dataTurnbase;
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.CHALLENGE_GAME_QUESTIONS_RESPONSE) {
            if (evtParams.params.getUtfString("status") === "WARNING") {
                ControllScreenDialog.instance().addLimitTurn();
                this.addFindGame();
                ControllLoading.instance().hideLoading();
            } else {
                this.handleQuestionResponse(evtParams.params);
            }
        }
        if (evtParams.cmd == DataCommand.BECHALLENGED_GAME_OPPONENT_GAME_LOG_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.opponentAnswerLogs = [];
                this.beChallengedParamsSimple = evtParams.params;
                this.handleResponseBeChallengedGame(this.beChallengedParamsSimple);
            } else {
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            }
        }
        if (evtParams.cmd == DataCommand.CHALLENGE_GAME_HISTORY_RESPONSE) {
            if (evtParams.params.getUtfString('status') == "OK") {
                this.handleHistory(evtParams.params);
            } else {
                ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
            }
        }
    }

    doneHandleHistoryChallenge() {
        //
        if (this.isHasHistory == true) {
            this.addPlayGame(TurnBaseScreen.TYPE_CHALLENGE);
        } else {
            this.addChoosePlaylist(this.opponent);
        }
    }

    sortQuestions(questions) {
        questions = questions.sort((a, b) => a.questionId - b.questionId);
    }

    addFindGame() {
        this.removeFindGame();
        this.findgame = new TurnBaseFindGame();
        this.findgame.event.choose_playlist.add(this.addChoosePlaylist, this);
        this.findgame.event.onBack.add(this.onBackFindGame, this);
        this.findgame.event.challengeGame.add(this.challengeGame, this);
        this.addChild(this.findgame);
    }
    removeFindGame() {
        if (this.findgame !== null) {
            this.removeChild(this.findgame);
            this.findgame.destroy();
            this.findgame = null;
        }
    }

    addChoosePlaylist(friend) {
        ControllLoading.instance().showLoading();
        this.opponent = friend;
        /* 
            friend = {
                avatar: string,
                id: int, 
                userName: string
        */
        this.removeChoosePlaylist();
        this.choosePlaylist = new TurnBaseChoosePlaylist(friend);
        this.choosePlaylist.event.choosePlaylist.add(this.onChoosedPlaylist, this);
        this.choosePlaylist.event.backScreen.add(this.onBackChoosePlaylist, this);
        this.addChild(this.choosePlaylist);
    }
    removeChoosePlaylist() {
        if (this.choosePlaylist !== null) {
            this.removeChild(this.choosePlaylist);
            this.choosePlaylist.destroy();
            this.choosePlaylist = null;
        }
    }
    onBackChoosePlaylist() {
        if (this.screenType !== 1) {
            this.removeChoosePlaylist();
            ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE);
        } else {
            this.removeChoosePlaylist();
        }
    }
    onChoosedPlaylist(playlist) {
        this.playlist = playlist;
        this.removeChoosePlaylist();
        this.removeFindGame();
        this.sendRequestChoosePlaylist(playlist.id);
    }

    sendRequestChoosePlaylist(id) {
        var params = new SFS2X.SFSObject();
        params.putInt("playlist_id", id);
        params.putInt("opponent_id", this.opponent.id);
        SocketController.instance().sendData(DataCommand.CHALLENGE_GAME_QUESTIONS_REQUEST, params);
        //
        ControllLoading.instance().showLoading();
    }

    onBackFindGame() {
        this.removeFindGame();
    }
    challengeGame(friend) {
        this.type = TurnBaseScreen.TYPE_CHALLENGE;
        this.opponent = friend;
        this.sendChallengeGameHistoryRequest();
        this.screenType = 2;
    }

    addPlayGame(type) {
        this.removePlayGame();
        this.playGame = new TurnBasePlay(type);
        this.playGame.setData(this.questions, this.opponent, this.user_playlist_mapping, this.opponent_playlist_mapping, this.playlist, this.opponentAnswerLogs);
        if (this.type == TurnBaseScreen.TYPE_BECHALLENGED) {
            if (this.isHasHistory) {
                this.playGame.setDataBeChallenged(this.play_log_id, this.request_id, this.isHasHistory, this.weeklyResult, this.historyGameLog, this.dataTurnbase);
                this.playGame.event.historyPlayTurn.add(this.historyPlayTurn, this);
            } else {
                this.playGame.setDataBeChallenged(this.play_log_id, this.request_id, this.isHasHistory, this.weeklyResult, this.historyGameLog, this.dataTurnbase);
            }
        }
        if (type == TurnBaseScreen.TYPE_CHALLENGE) {
            if (this.isHasHistory) {
                this.playGame.setDataChallenge(this.play_log_id, this.request_id, this.isHasHistory, this.weeklyResult, this.historyGameLog)
            } else {
                this.playGame.setDataChallenge(this.play_log_id, this.request_id, this.isHasHistory, this.weeklyResult)
            }
        }
        if (this.type == TurnBaseScreen.TUTORIAL) {
            //
            this.playGame.setData(this.playScript.demoData.questions, this.playScript.demoData.opponent, this.playScript.demoData.user_playlist_mapping, this.playScript.demoData.opponent_playlist_mapping, this.playScript.demoData.playlist, this.playScript.demoData.opponentAnswerLogs);
            this.playGame.setDataBeChallenged(this.playScript.demoData.play_log_id, this.playScript.demoData.request_id, this.playScript.demoData.isHasHistory, this.playScript.demoData.weeklyResult);
            //
            ControllLoading.instance().hideLoading();
        }
        this.playGame.addScreenPlay();
        this.playGame.event.screenRehome.add(this.playGameScreenWinScreenChallengeReHome, this);
        this.playGame.event.screenWinScreenBeChallengedChallengAgain.add(this.screenWinScreenBeChallengedChallengAgain, this);
        this.playGame.event.illegalTurnCancle.add(this.illegalTurnCancle, this);
        this.playGame.event.playIllegalTurn.add(this.playIllegalTurn, this);
        this.playGame.event.screenChallengeNextGame.add(this.screenChallengeNextGame, this);
        this.playGame.event.historyChallenge.add(this.historyChallenge, this);
        this.addChild(this.playGame);
    }
    removePlayGame() {
        if (this.playGame !== null) {
            this.removeChild(this.playGame);
            this.playGame.destroy();
            this.playGame = null;
        }
    }
    historyPlayTurn() {
        this.removePlayGame();
        this.isHasHistory = false;
        this.addPlayGame(TurnBaseScreen.TYPE_BECHALLENGED);
    }
    historyChallenge() {
        this.removePlayGame();
        this.isHasHistory = false;
        this.addChoosePlaylist(this.opponent);
    }
    playGameScreenWinScreenChallengeReHome() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    screenWinScreenBeChallengedChallengAgain() {
        this.removePlayGame();
        this.type = TurnBaseScreen.TYPE_CHALLENGE;
        this.definedData();
        this.addChoosePlaylist(this.opponent);
    }
    illegalTurnCancle() {
        this.removePlayGame();
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
    }
    playIllegalTurn(res) {
        this.removePlayGame();
        this.type = TurnBaseScreen.TYPE_BECHALLENGED;
        this.definedData();
        this.addScreen();
    }
    screenChallengeNextGame(res) {
        this.removePlayGame();
        this.type = res.type;
        this.opponent = res.opponent;
        this.definedData();
        this.setDataBeChallenged(res.gameLogId, res.requestId, res.isHasHistory, res.weeklyResult, res);
        this.addScreen();
    }

    destroy() {
        this.removeEventExtension();
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

    handleQuestionResponse(params) {
        if (params.getUtfString('status') == 'OK') {
            this.responseQuestions = params;
            //
            this.getDataPlaylistHandleQuestionResponse(this.playlist);
        } else {
            ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        }
    }

    getDataPlaylistHandleQuestionResponse(playlist) {
        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDataPlaylistHandleQuestionResponseComplete, this);
        SqlLiteController.instance().getPlaylistById([playlist.id], null, SocketController.instance().dataMySeft.user_id);
    }

    getDataPlaylistHandleQuestionResponseComplete(playlist) {
        this.playlist = playlist;
        //
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDataPlaylistHandleQuestionResponseComplete, this);
        let questions = this.responseQuestions.getSFSArray('response');
        for (let i = 0; i < questions.size(); i++) {
            let question = questions.getSFSObject(i);
            let questionType = question.getUtfString('question_type');
            let answer1 = question.getUtfString('answer1');
            let answer2 = question.getUtfString('answer2');
            let answer3 = question.getUtfString('answer3');
            let answer4 = question.getUtfString('answer4');
            let id = question.getLong('id');
            let correctAnswer = question.getInt('correct_answer');
            let fileUrl = question.getUtfString('file_path');
            let listenLink = question.getUtfString('file_path');
            let songEntity = question.getSFSObject('song');
            let song = songEntity.getUtfString('title');
            let idSong = songEntity.getLong('id');
            let fileName = songEntity.getUtfString('title');
            let author = songEntity.getUtfString('author');
            let singerEntity = songEntity.getSFSObject('singer');
            let singer = singerEntity.getUtfString('name');
            let avaSinger = singerEntity.getUtfString('avatar');
            //
            let songLinks = [];
            if (songEntity.containsKey('song_links')) {
                let song_links = songEntity.getSFSArray('song_links');
                for (let j = 0; j < song_links.size(); j++) {
                    let obj = song_links.getSFSObject(j);
                    let link_type = obj.getUtfString('link_type');
                    let song_id = obj.getLong('song_id');
                    let is_movie = obj.getInt('is_movie');
                    let link = obj.getUtfString('link');
                    let id = obj.getLong('id');
                    songLinks.push({
                        link_type: link_type,
                        song_id: song_id,
                        is_movie: is_movie,
                        link: link,
                        id: id
                    });
                }
            }
            this.questions.push({
                questionType: questionType,
                answers: [
                    answer1,
                    answer2,
                    answer3,
                    answer4
                ],
                correctAnswer: correctAnswer,
                songEntity: {
                    thumb: avaSinger,
                    song: song,
                    song_links: songLinks,
                    fileName: fileName,
                    author: author,
                    singer: singer,
                    listenLink: listenLink,
                    id: idSong,
                    fileUrl: fileUrl
                },
                id: id
            });
        }
        //
        if (this.responseQuestions.containsKey('opponent_playlist_mapping')) {
            var opponent_playlist_mapping = this.responseQuestions.getSFSObject('opponent_playlist_mapping');
        }
        this.user_playlist_mapping = this.handleUserPlaylistMapping(playlist);
        this.opponent_playlist_mapping = this.handlePlaylistMapping(opponent_playlist_mapping);
        //
        this.isHandleQuestionResponse = true;
        this.addPlayGame(TurnBaseScreen.TYPE_CHALLENGE);
        ControllLoading.instance().hideLoading();
    }

    handleResponseBeChallengedGame(params) {
        let playlist_id = params.getInt('playlist_id');
        let playlist_name = "";
        //
        this.playlist = {
            id: playlist_id,
            name: playlist_name
        }
        this.responseBeChallengedGame = params;
        this.getDataPlaylistHandleResponseBeChallengedGame(this.playlist);
    }

    getDataPlaylistHandleResponseBeChallengedGame(playlist) {
        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDataPlaylistHandleResponseBeChallengedGameComplete, this);
        SqlLiteController.instance().getPlaylistById([playlist.id], null, SocketController.instance().dataMySeft.user_id);
    }

    getDataPlaylistHandleResponseBeChallengedGameComplete(playlist) {
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDataPlaylistHandleResponseBeChallengedGameComplete, this);
        this.playlist = playlist;
        var opponentAnswerLogs = this.responseBeChallengedGame.getSFSArray('opponent_answer_logs');
        for (let i = 0; i < opponentAnswerLogs.size(); i++) {
            let opponentAnswerLog = opponentAnswerLogs.getSFSObject(i);
            //question
            let question = opponentAnswerLog.getSFSObject('question_entity');
            let questionType = question.getUtfString('question_type');
            let answer1 = question.getUtfString('answer1');
            let answer2 = question.getUtfString('answer2');
            let answer3 = question.getUtfString('answer3');
            let answer4 = question.getUtfString('answer4');
            let id = question.getLong('id');
            let correctAnswer = question.getInt('correct_answer');
            let fileUrl = question.getUtfString('file_path');
            let listenLink = question.getUtfString('file_path');
            let songEntity = question.getSFSObject('song');
            let song = songEntity.getUtfString('title');
            let idSong = songEntity.getLong('id');
            let fileName = songEntity.getUtfString('title');
            let author = songEntity.getUtfString('author');
            let singerEntity = songEntity.getSFSObject('singer');
            let singer = singerEntity.getUtfString('name');
            let avaSinger = singerEntity.getUtfString('avatar');
            //
            let songLinks = [];
            if (songEntity.containsKey('song_links')) {
                let song_links = songEntity.getSFSArray('song_links');
                for (let j = 0; j < song_links.size(); j++) {
                    let obj = song_links.getSFSObject(j);
                    let link_type = obj.getUtfString('link_type');
                    let song_id = obj.getLong('song_id');
                    let is_movie = obj.getInt('is_movie');
                    let link = obj.getUtfString('link');
                    let id = obj.getLong('id');
                    songLinks.push({
                        link_type: link_type,
                        song_id: song_id,
                        is_movie: is_movie,
                        link: link,
                        id: id
                    });
                }
            }
            //opponent
            let idQuestion = question.getLong('id');
            let timeAnswer = opponentAnswerLog.getDouble('answer_time');
            let answer = opponentAnswerLog.getInt('answer');
            let streak = opponentAnswerLog.getInt('streak');
            let trueOrFalse = opponentAnswerLog.getUtfString('result');
            this.opponentAnswerLogs.push({
                questionId: idQuestion,
                answer_time: timeAnswer,
                answer: answer,
                streak: streak,
                result: trueOrFalse
            });
            //
            this.questions.push({
                questionId: idQuestion,
                questionType: questionType,
                answers: [
                    answer1,
                    answer2,
                    answer3,
                    answer4
                ],
                correctAnswer: correctAnswer,
                songEntity: {
                    thumb: avaSinger,
                    song: song,
                    fileName: fileName,
                    song_links: songLinks,
                    author: author,
                    singer: singer,
                    listenLink: listenLink,
                    id: idSong,
                    fileUrl: fileUrl
                },
                id: id
            });
        }
        //
        if (this.responseBeChallengedGame.containsKey('opponent_playlist_mapping')) {
            var opponent_playlist_mapping = this.responseBeChallengedGame.getSFSObject('opponent_playlist_mapping');
        };
        this.user_playlist_mapping = this.handleUserPlaylistMapping(playlist);
        this.opponent_playlist_mapping = this.handlePlaylistMapping(opponent_playlist_mapping);
        let challenge_request_id = this.responseBeChallengedGame.getLong('challenge_request_id');
        this.request_id = challenge_request_id;
        this.handleHistoryBeChallenged(this.responseBeChallengedGame);
        //challenge_request_id
        //
        // this.doneHandleHistoryBeChallenged();
    }

    handleHistoryBeChallenged(params) {
        if (params.containsKey('history')) {
            this.isHasHistory = true;
            var history = params.getSFSObject('history');
            if (history.containsKey('user_id')) {
                this.handleResponseBechallengedGameHistoryBeChallenged(history);
            } else {
                this.isHasHistory = false;
                this.doneHandleHistoryBeChallenged();
            }
        } else {
            this.isHasHistory = false;
            this.doneHandleHistoryBeChallenged();
        }
    }

    doneHandleHistoryBeChallenged() {
        this.sortQuestions(this.questions);
        this.sortQuestions(this.opponentAnswerLogs);
        this.addPlayGame(TurnBaseScreen.TYPE_BECHALLENGED);
        ControllLoading.instance().hideLoading();
    }

    handleHistory(params) {
        //history
        if (params.containsKey('history')) {
            this.isHasHistory = true;
            var history = params.getSFSObject('history');
            if (history.containsKey('user_id')) {
                this.handleResponseBechallengedGameHistory(history);
            } else {
                this.isHasHistory = false;
                this.doneHandleHistoryChallenge();
            }
        } else {
            this.isHasHistory = false;
            this.doneHandleHistoryChallenge();
        }
    }

    handleUserPlaylistMapping(playlist) {
        let user_playlist_mapping = playlist.user
        return user_playlist_mapping;
    }

    handlePlaylistMapping(playlist_mapping) {
        var user_playlist_mapping = new ShopUserPlayListMapping();
        if (playlist_mapping) {
            user_playlist_mapping.user_id = playlist_mapping.getInt(ShopDataField.user_id);
            user_playlist_mapping.level = playlist_mapping.getInt(ShopDataField.level);
            user_playlist_mapping.playlist_id = playlist_mapping.getInt(ShopDataField.playlist_id);
            user_playlist_mapping.exp_score = playlist_mapping.getInt(ShopDataField.exp_score);
            user_playlist_mapping.created = playlist_mapping.getLong(ShopDataField.created);
            user_playlist_mapping.active = playlist_mapping.getInt(ShopDataField.active);
            user_playlist_mapping.id = playlist_mapping.getLong(ShopDataField.id);
            user_playlist_mapping.current_level_score = playlist_mapping.getInt(ShopDataField.current_level_score);
            user_playlist_mapping.next_level_score = playlist_mapping.getInt(ShopDataField.next_level_score);
            user_playlist_mapping.updated = playlist_mapping.getLong(ShopDataField.updated);
            return user_playlist_mapping;
        } else {
            return user_playlist_mapping;
        }
    }

    getDatPlaylistBechallengedGameHistoryComplete(response) {
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDatPlaylistBechallengedGameHistoryComplete, this);
        //
        let playlist_id = this.responseBeChallengedGameHistory.getInt('playlist_id');
        let user_id = this.responseBeChallengedGameHistory.getInt('user_id');
        let playlist = response;
        let playlist_name = playlist.name;
        var user_game_log_entity = this.responseBeChallengedGameHistory.getSFSObject('user_play_log_entity');
        var opponent_game_log_entity = this.responseBeChallengedGameHistory.getSFSObject('opponent_play_log_entity');
        let score = user_game_log_entity.getInt('score');
        let scoreOpp = opponent_game_log_entity.getInt('score');
        if (this.responseBeChallengedGameHistory.containsKey('opponent_playlist_mapping')) {
            var opponent_playlist_mapping = this.responseBeChallengedGameHistory.getSFSObject('opponent_playlist_mapping');
        }
        if (this.responseBeChallengedGameHistory.containsKey('user_playlist_mapping')) {
            var user_playlist_mapping = this.responseBeChallengedGameHistory.getSFSObject('user_playlist_mapping');
        }
        //
        if (user_id == SocketController.instance().dataMySeft.user_id) {
            this.historyGameLog.user_playlist_mapping = response.user;
            this.historyGameLog.opponent_playlist_mapping = this.handlePlaylistMapping(opponent_playlist_mapping);
            //
            this.handleGameLogEntity(user_game_log_entity, this.historyGameLog.result.answers);
            this.handleGameLogEntity(opponent_game_log_entity, this.historyGameLog.result.opponentAnswerLogs);
            //score
            this.historyGameLog.result.score = score;
            this.historyGameLog.result.scoreOpp = scoreOpp;
        } else {
            this.historyGameLog.user_playlist_mapping = response.user;
            this.historyGameLog.opponent_playlist_mapping = this.handlePlaylistMapping(user_playlist_mapping);
            //
            this.handleGameLogEntity(user_game_log_entity, this.historyGameLog.result.opponentAnswerLogs);
            this.handleGameLogEntity(opponent_game_log_entity, this.historyGameLog.result.answers);
            //score
            this.historyGameLog.result.score = scoreOpp;
            this.historyGameLog.result.scoreOpp = score;
        }
        //
        this.handleQuestionLogEntity(user_game_log_entity, this.historyGameLog.questions);
        this.historyGameLog.playlist = {
            id: playlist_id,
            name: playlist_name
        }
        //
        this.sortQuestions(this.historyGameLog.questions);
        this.sortQuestions(this.historyGameLog.result.answers);
        this.sortQuestions(this.historyGameLog.result.opponentAnswerLogs);
        //
        this.doneHandleHistoryChallenge();
    }

    handleResponseBechallengedGameHistory(response) {
        this.responseBeChallengedGameHistory = response;
        let playlist_id = response.getInt('playlist_id');
        //
        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDatPlaylistBechallengedGameHistoryComplete, this);
        SqlLiteController.instance().getPlaylistById([playlist_id], null, SocketController.instance().dataMySeft.user_id);
    }

    handleResponseBechallengedGameHistoryBeChallenged(response) {
        this.responseBeChallengedGameHistory = response;
        let playlist_id = response.getInt('playlist_id');
        //
        SqlLiteController.instance().event.get_data_playlist_complete.add(this.getDatPlaylistBechallengedGameHistoryCompleteBeChallenged, this);
        SqlLiteController.instance().getPlaylistById([playlist_id], null, SocketController.instance().dataMySeft.user_id);
    }

    getDatPlaylistBechallengedGameHistoryCompleteBeChallenged(response) {
        SqlLiteController.instance().event.get_data_playlist_complete.remove(this.getDatPlaylistBechallengedGameHistoryCompleteBeChallenged, this);
        //
        let playlist_id = this.responseBeChallengedGameHistory.getInt('playlist_id');
        let user_id = this.responseBeChallengedGameHistory.getInt('user_id');
        let playlist = response;
        let playlist_name = playlist.name;
        var user_game_log_entity = this.responseBeChallengedGameHistory.getSFSObject('user_play_log_entity');
        var opponent_game_log_entity = this.responseBeChallengedGameHistory.getSFSObject('opponent_play_log_entity');
        let score = user_game_log_entity.getInt('score');
        let scoreOpp = opponent_game_log_entity.getInt('score');
        if (this.responseBeChallengedGameHistory.containsKey('opponent_playlist_mapping')) {
            var opponent_playlist_mapping = this.responseBeChallengedGameHistory.getSFSObject('opponent_playlist_mapping');
        }
        if (this.responseBeChallengedGameHistory.containsKey('user_playlist_mapping')) {
            var user_playlist_mapping = this.responseBeChallengedGameHistory.getSFSObject('user_playlist_mapping');
        }
        //
        if (user_id == SocketController.instance().dataMySeft.user_id) {
            this.historyGameLog.user_playlist_mapping = response.user;
            this.historyGameLog.opponent_playlist_mapping = this.handlePlaylistMapping(opponent_playlist_mapping);
            //
            this.handleGameLogEntity(user_game_log_entity, this.historyGameLog.result.answers);
            this.handleGameLogEntity(opponent_game_log_entity, this.historyGameLog.result.opponentAnswerLogs);
            //score
            this.historyGameLog.result.score = score;
            this.historyGameLog.result.scoreOpp = scoreOpp;
        } else {
            this.historyGameLog.user_playlist_mapping = response.user;
            this.historyGameLog.opponent_playlist_mapping = this.handlePlaylistMapping(user_playlist_mapping);
            //
            this.handleGameLogEntity(user_game_log_entity, this.historyGameLog.result.opponentAnswerLogs);
            this.handleGameLogEntity(opponent_game_log_entity, this.historyGameLog.result.answers);
            //score
            this.historyGameLog.result.score = scoreOpp;
            this.historyGameLog.result.scoreOpp = score;
        }
        //
        this.handleQuestionLogEntity(user_game_log_entity, this.historyGameLog.questions);
        this.historyGameLog.playlist = {
            id: playlist_id,
            name: playlist_name
        }
        //
        this.sortQuestions(this.historyGameLog.questions);
        this.sortQuestions(this.historyGameLog.result.answers);
        this.sortQuestions(this.historyGameLog.result.opponentAnswerLogs);
        //
        this.doneHandleHistoryBeChallenged();
    }

    handleQuestionLogEntity(entities, arrs) {
        var answer_entities = entities.getSFSArray('answer_entities');
        for (let i = 0; i < answer_entities.size(); i++) {
            let answer_entity = answer_entities.getSFSObject(i);
            let question = answer_entity.getSFSObject('question_entity');
            let questionType = question.getUtfString('question_type');
            let fileUrl = question.getUtfString('file_path');
            let listenLink = question.getUtfString('file_path');
            // LogConsole.log(songEntity.getDump());
            let songEntity = question.getSFSObject('song');
            let song = songEntity.getUtfString('title');
            let id = songEntity.getLong('id');
            let fileName = songEntity.getUtfString('title');
            let author = songEntity.getUtfString('author');
            let singerEntity = songEntity.getSFSObject('singer');
            let singer = singerEntity.getUtfString('name');
            let avaSinger = singerEntity.getUtfString('avatar');
            let idQuestion = answer_entity.getLong('id');
            //
            let songLinks = [];
            if (songEntity.containsKey('song_links')) {
                let song_links = songEntity.getSFSArray('song_links');
                for (let j = 0; j < song_links.size(); j++) {
                    let obj = song_links.getSFSObject(j);
                    let link_type = obj.getUtfString('link_type');
                    let song_id = obj.getLong('song_id');
                    let is_movie = obj.getInt('is_movie');
                    let link = obj.getUtfString('link');
                    let id = obj.getLong('id');
                    songLinks.push({
                        link_type: link_type,
                        song_id: song_id,
                        is_movie: is_movie,
                        link: link,
                        id: id
                    });
                }
            }
            arrs.push({
                questionId: idQuestion,
                questionType: questionType,
                songEntity: {
                    thumb: avaSinger,
                    song: song,
                    fileName: fileName,
                    song_links: songLinks,
                    author: author,
                    singer: singer,
                    listenLink: listenLink,
                    id: id,
                    fileUrl: fileUrl
                }
            });
        }
    }

    handleGameLogEntity(entities, arrs) {
        var answer_entities = entities.getSFSArray('answer_entities');
        for (let i = 0; i < answer_entities.size(); i++) {
            let answer_entity = answer_entities.getSFSObject(i);
            let answer_time = answer_entity.getDouble('answer_time');
            let result = answer_entity.getUtfString('result');
            let question_id = answer_entity.getLong('question_id');
            arrs.push({
                answer_time: answer_time,
                result: result,
                questionId: question_id
            });
        }
    }

}