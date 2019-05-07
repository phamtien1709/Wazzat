import Common from "../../../common/Common.js";
import DataCommand from "../../../common/DataCommand.js";
import SpriteBase from "../../component/SpriteBase.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import PlayScriptScreen from "../../playscript/playScriptScreen.js";
import TabPlayTurnBase from "./childs/TabPlayTurnBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuScrollList extends BaseGroup {
    constructor() {
        super(game)
        this._height = 0;
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.configHeightOfRowTab = 106 * window.GameConfig.RESIZE;
        this.countHandleGetMainMenuResponse = 0;
        this.countAppear = 0;
        this.event = {
            playGame: new Phaser.Signal(),
            nudgeFriend: new Phaser.Signal(),
            deleteChallenge: new Phaser.Signal()
        };
    }

    sendRequestMenuChallenges() {
        SocketController.instance().sendData(DataCommand.MAIN_MENU_LOAD_REQUEST, null);
    }

    sendBeChallengedGameLogRequest(gameLogId, requestId) {
        var params = new SFS2X.SFSObject();
        params.putLong("play_log_id", gameLogId);
        params.putLong("challenge_request_id", requestId);
        SocketController.instance().sendData(DataCommand.BECHALLENGED_GAME_OPPONENT_GAME_LOG_REQUEST, params);
    }

    //LOGIC CODE
    handleMainMenuLoadResponse(params, count, callback) {
        MainData.instance().menuLoadResponses = {
            waitingGames: [],
            doneGames: [],
            challengeGames: []
        };
        this.menuResponseGames = [];
        if (count == 1) {
            if (params.getUtfString('status') == 'OK') {
                // LogConsole.log(params.getDump());
                let opponents = params.getSFSArray('opponents');
                Common.handleArrMainMenuLoad(opponents, this.menuResponseGames, () => {
                    let menuResponses = { ...this.menuResponseGames };
                    let arrMenuResponses = [];
                    for (let res in menuResponses) {
                        arrMenuResponses.push(menuResponses[res]);
                    }
                    MainData.instance().menuOpponentsResponse = arrMenuResponses;
                    this.filterResponseGames();
                });
                this.init_quests_count = params.getInt('init_quests_count');
                this.new_friend_request_count = params.getLong('new_friend_request_count');
                this.started_event_count = params.getLong('started_event_count');
                this.handlePlayScript(params);
                this.handleHoursReward(params);
            } else {
                console.error(`MAIN_MENU_LOAD_RESPONSE not response: ${params.errorMessage}`);
            }
            callback(MainData.instance().menuLoadResponses, this.init_quests_count, this.new_friend_request_count, this.started_event_count, this.hoursReward, this.play_script);
        }
    }

    handlePlayScript(params) {
        this.play_script = {
            playing_guide: "",
            play_script_questions: []
        }
        if (params.containsKey('play_script')) {
            var play_script = params.getSFSObject('play_script');
            if (play_script.containsKey('playing_guide')) {
                this.play_script.playing_guide = play_script.getUtfString('playing_guide');
                //
            }
            if (play_script.containsKey('play_script_questions')) {
                var play_script_questions = play_script.getSFSArray('play_script_questions');
                for (let i = 0; i < play_script_questions.size(); i++) {
                    let question = play_script_questions.getSFSObject(i);
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
                    this.play_script.play_script_questions.push({
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
                            author: author,
                            singer: singer,
                            listenLink: listenLink,
                            id: idSong,
                            fileUrl: fileUrl
                        },
                        id: id
                    });
                }
            }
        }
        if (this.play_script.playing_guide == PlayScriptScreen.DONE_GET_QUEST) {
            MainData.instance().botChallenge = {
                "value": 0,
                "gameLogId": MainData.instance().menuLoadResponses.challengeGames[0].userGameLog,
                "requestId": MainData.instance().menuLoadResponses.challengeGames[0].id,
                "opponentEntity": MainData.instance().menuLoadResponses.challengeGames[0].opponentEntity,
                "mode": 'isChallengeGame',
                "can_be_poked": MainData.instance().menuLoadResponses.challengeGames[0].can_be_poked,
                "weeklyResult": {
                    userWon: 0,
                    opponentWon: 0
                }
            }
        }
        //
    }

    handleHoursReward(params) {
        if (params.containsKey('hours_reward')) {
            var hoursReward = params.getSFSObject('hours_reward');
            this.hoursReward = {
                hours_reward_id: hoursReward.getInt('hours_reward_id'),
                user_id: hoursReward.getInt('user_id'),
                created: hoursReward.getLong('created'),
                state: hoursReward.getUtfString('state'),
                updated: hoursReward.getLong('updated')
            }
        }
    }

    filterResponseGames() {
        MainData.instance().menuLoadResponses.waitingGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "THEIR_TURN");
        MainData.instance().menuLoadResponses.doneGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "NO_GAME");
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuOpponentsResponse.filter(ele => ele.status == "YOUR_TURN");

        MainData.instance().menuLoadResponses.waitingGames = MainData.instance().menuLoadResponses.waitingGames.sort((a2, a1) => a1.base_updated - a2.base_updated)
        MainData.instance().menuLoadResponses.waitingGames = MainData.instance().menuLoadResponses.waitingGames.sort((a, b) => b.can_be_poked - a.can_be_poked);

        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuLoadResponses.challengeGames.sort((a2, a1) => a1.base_updated - a2.base_updated);
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuLoadResponses.challengeGames.sort((a, b) => b.poked - a.poked);
        MainData.instance().menuLoadResponses.challengeGames = MainData.instance().menuLoadResponses.challengeGames.sort((a, b) => b.poked_at - a.poked_at);

        MainData.instance().menuLoadResponses.doneGames = MainData.instance().menuLoadResponses.doneGames.sort((a2, a1) => a1.base_updated - a2.base_updated);
    }

    //DISPLAY CODE
    /*
    * display list friend who challen user and accept it to play
    */
    displayListChallenge() {
        this.removeAllChild();
        this.configHeightOfRowTab = 106 * window.GameConfig.RESIZE;
        this.countHandleGetMainMenuResponse = 0;
        this.grapChallenge = new Phaser.Group(game);
        this.grapChallenge.y = 106 * window.GameConfig.RESIZE;
        this.createGrapScrollMenu();
        this.addTittleYourTurn();
        this.createTabYourTurn();
        this.addTittleTheirTurn();
        this.createTabTheirTurn();
        this.addChild(this.grapMenu);
        for (let i = 0; i < this.grapChallenge.children.length; i++) {
            if (i < 4) {
                let tweenTabPlay = game.add.tween(this.grapChallenge.children[i]).to({
                    x: 0
                }, 500, Phaser.Easing.Back.Out, false);
                this.timeout = setTimeout(() => {
                    tweenTabPlay.start();
                }, i * 100);
            } else {
                this.grapChallenge.children[i].x = 0;
            }
        }
    }

    createTabYourTurn() {
        if (MainData.instance().menuLoadResponses.challengeGames !== undefined) {
            if (MainData.instance().menuLoadResponses.challengeGames.length > 0) {
                for (let i = 0; i < MainData.instance().menuLoadResponses.challengeGames.length; i++) {
                    if (MainData.instance().menuLoadResponses.doneGames.length == 0) {
                        if (MainData.instance().menuLoadResponses.challengeGames.length == i + 1) {
                            //
                            this.createTabPlayInScrollMenu(i,
                                0,
                                MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity.avatar,
                                'afterSet',
                                MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.userWon,
                                MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.opponentWon,
                                MainData.instance().menuLoadResponses.challengeGames[i].userGameLog,
                                MainData.instance().menuLoadResponses.challengeGames[i].challenge_request_id,
                                MainData.instance().menuLoadResponses.challengeGames[i].turnCount,
                                MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity,
                                'isChallengeGame',
                                true,
                                MainData.instance().menuLoadResponses.challengeGames[i].can_be_poked,
                                MainData.instance().menuLoadResponses.challengeGames[i].poked,
                                MainData.instance().menuLoadResponses.challengeGames[i].base_updated,
                                MainData.instance().menuLoadResponses.challengeGames[i].challenge_msg
                            );
                        } else {
                            this.createTabPlayInScrollMenu(i,
                                0,
                                MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity.avatar,
                                'afterSet',
                                MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.userWon,
                                MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.opponentWon,
                                MainData.instance().menuLoadResponses.challengeGames[i].userGameLog,
                                MainData.instance().menuLoadResponses.challengeGames[i].challenge_request_id,
                                MainData.instance().menuLoadResponses.challengeGames[i].turnCount,
                                MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity,
                                'isChallengeGame',
                                false,
                                MainData.instance().menuLoadResponses.challengeGames[i].can_be_poked,
                                MainData.instance().menuLoadResponses.challengeGames[i].poked,
                                MainData.instance().menuLoadResponses.challengeGames[i].base_updated,
                                MainData.instance().menuLoadResponses.challengeGames[i].challenge_msg
                            );
                        }
                    } else {
                        this.createTabPlayInScrollMenu(i,
                            0,
                            MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity.avatar,
                            'afterSet',
                            MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.userWon,
                            MainData.instance().menuLoadResponses.challengeGames[i].weeklyResult.opponentWon,
                            MainData.instance().menuLoadResponses.challengeGames[i].userGameLog,
                            MainData.instance().menuLoadResponses.challengeGames[i].challenge_request_id,
                            MainData.instance().menuLoadResponses.challengeGames[i].turnCount,
                            MainData.instance().menuLoadResponses.challengeGames[i].opponentEntity,
                            'isChallengeGame',
                            false,
                            MainData.instance().menuLoadResponses.challengeGames[i].can_be_poked,
                            MainData.instance().menuLoadResponses.challengeGames[i].poked,
                            MainData.instance().menuLoadResponses.challengeGames[i].base_updated,
                            MainData.instance().menuLoadResponses.challengeGames[i].challenge_msg
                        );
                    }
                }
            }
        }
        if (MainData.instance().menuLoadResponses.doneGames !== undefined) {
            // LogConsole.log(MainData.instance().menuLoadResponses);
            if (MainData.instance().menuLoadResponses.doneGames.length > 0) {
                for (let i = 0; i < MainData.instance().menuLoadResponses.doneGames.length; i++) {
                    if (MainData.instance().menuLoadResponses.doneGames.length == i + 1) {
                        this.createTabPlayInScrollMenu(i,
                            MainData.instance().menuLoadResponses.challengeGames.length,
                            MainData.instance().menuLoadResponses.doneGames[i].opponentEntity.avatar,
                            'afterSet',
                            MainData.instance().menuLoadResponses.doneGames[i].weeklyResult.userWon,
                            MainData.instance().menuLoadResponses.doneGames[i].weeklyResult.opponentWon,
                            MainData.instance().menuLoadResponses.doneGames[i].userGameLog,
                            MainData.instance().menuLoadResponses.doneGames[i].challenge_request_id,
                            MainData.instance().menuLoadResponses.doneGames[i].turnCount,
                            MainData.instance().menuLoadResponses.doneGames[i].opponentEntity,
                            'isDoneGame',
                            true,
                            MainData.instance().menuLoadResponses.doneGames[i].can_be_poked,
                            MainData.instance().menuLoadResponses.doneGames[i].poked,
                            MainData.instance().menuLoadResponses.doneGames[i].base_updated,
                            MainData.instance().menuLoadResponses.doneGames[i].challenge_msg
                        );
                    } else {
                        this.createTabPlayInScrollMenu(i,
                            MainData.instance().menuLoadResponses.challengeGames.length,
                            MainData.instance().menuLoadResponses.doneGames[i].opponentEntity.avatar,
                            'afterSet',
                            MainData.instance().menuLoadResponses.doneGames[i].weeklyResult.userWon,
                            MainData.instance().menuLoadResponses.doneGames[i].weeklyResult.opponentWon,
                            MainData.instance().menuLoadResponses.doneGames[i].userGameLog,
                            MainData.instance().menuLoadResponses.doneGames[i].challenge_request_id,
                            MainData.instance().menuLoadResponses.doneGames[i].turnCount,
                            MainData.instance().menuLoadResponses.doneGames[i].opponentEntity,
                            'isDoneGame',
                            false,
                            MainData.instance().menuLoadResponses.doneGames[i].can_be_poked,
                            MainData.instance().menuLoadResponses.doneGames[i].poked,
                            MainData.instance().menuLoadResponses.doneGames[i].base_updated,
                            MainData.instance().menuLoadResponses.doneGames[i].challenge_msg
                        );
                    }
                }
            }
        }
    }

    createTabTheirTurn() {
        // LogConsole.log('createTabTheirTurn');
        if (MainData.instance().menuLoadResponses.waitingGames !== undefined) {
            if (MainData.instance().menuLoadResponses.waitingGames.length > 0) {
                for (let i = 0; i < MainData.instance().menuLoadResponses.waitingGames.length; i++) {
                    if (MainData.instance().menuLoadResponses.waitingGames.length == i + 1) {
                        this.createTabPlayInScrollMenu(i,
                            MainData.instance().menuLoadResponses.doneGames.length + MainData.instance().menuLoadResponses.challengeGames.length + 1,
                            MainData.instance().menuLoadResponses.waitingGames[i].opponentEntity.avatar,
                            'btnWaitingGame',
                            MainData.instance().menuLoadResponses.waitingGames[i].weeklyResult.userWon,
                            MainData.instance().menuLoadResponses.waitingGames[i].weeklyResult.opponentWon,
                            MainData.instance().menuLoadResponses.waitingGames[i].userGameLog,
                            MainData.instance().menuLoadResponses.waitingGames[i].challenge_request_id,
                            -1,
                            MainData.instance().menuLoadResponses.waitingGames[i].opponentEntity,
                            'isWaitingGame',
                            true,
                            MainData.instance().menuLoadResponses.waitingGames[i].can_be_poked,
                            MainData.instance().menuLoadResponses.waitingGames[i].poked,
                            MainData.instance().menuLoadResponses.waitingGames[i].base_updated,
                            MainData.instance().menuLoadResponses.waitingGames[i].challenge_msg
                        );
                    } else {
                        this.createTabPlayInScrollMenu(i,
                            MainData.instance().menuLoadResponses.doneGames.length + MainData.instance().menuLoadResponses.challengeGames.length + 1,
                            MainData.instance().menuLoadResponses.waitingGames[i].opponentEntity.avatar,
                            'btnWaitingGame',
                            MainData.instance().menuLoadResponses.waitingGames[i].weeklyResult.userWon,
                            MainData.instance().menuLoadResponses.waitingGames[i].weeklyResult.opponentWon,
                            MainData.instance().menuLoadResponses.waitingGames[i].userGameLog,
                            MainData.instance().menuLoadResponses.waitingGames[i].challenge_request_id,
                            -1,
                            MainData.instance().menuLoadResponses.waitingGames[i].opponentEntity,
                            'isWaitingGame',
                            false,
                            MainData.instance().menuLoadResponses.waitingGames[i].can_be_poked,
                            MainData.instance().menuLoadResponses.waitingGames[i].poked,
                            MainData.instance().menuLoadResponses.waitingGames[i].base_updated,
                            MainData.instance().menuLoadResponses.waitingGames[i].challenge_msg
                        );
                    }
                }
            }
        }
    }
    createGrapScrollMenu() {
        this.grapMenu = new Phaser.Group(game);
        this.grapMenu.y = 545 * window.GameConfig.RESIZE;
        this.addChild(this.grapMenu);
        this.grapMenu.addChild(this.grapChallenge);
    }

    addTittleYourTurn() {
        //text turn
        let tabPlay_yourTurn = new Phaser.Sprite(game, this.positionMenuConfig.tab_yourTurn.x * window.GameConfig.RESIZE, this.positionMenuConfig.tab_yourTurn.y * window.GameConfig.RESIZE, 'otherSprites', 'tab-friend');
        let txt_yourTurn = new Phaser.Text(game,
            this.positionMenuConfig.txt_yourTurn.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.txt_yourTurn.y * window.GameConfig.RESIZE,
            Language.instance().getData("208"),
            this.positionMenuConfig.txt_yourTurn.configs
        );
        txt_yourTurn.anchor.set(0, 0.5);
        let txt_count_yourTurn = new Phaser.Text(game, txt_yourTurn.x + txt_yourTurn.width + 10, this.positionMenuConfig.txt_count_yourTurn.y * window.GameConfig.RESIZE, `(${MainData.instance().menuLoadResponses.doneGames.length + MainData.instance().menuLoadResponses.challengeGames.length} ${Language.instance().getData("210")})`, this.positionMenuConfig.txt_count_yourTurn.configs);
        txt_count_yourTurn.anchor.set(0, 0.5);
        tabPlay_yourTurn.addChild(txt_count_yourTurn);
        tabPlay_yourTurn.addChild(txt_yourTurn);
        this.addLineUnder(tabPlay_yourTurn);
        this.grapMenu.addChild(tabPlay_yourTurn);
        // btn call method delete
        this.btnMethodDelete1 = new Phaser.Button(game, this.positionMenuConfig.delete_game.btn_bin_blue.x, this.positionMenuConfig.delete_game.btn_bin_blue.y, this.positionMenuConfig.delete_game.btn_bin_blue.nameAtlas, this.onClickMethodDeleteYourTurn, this, null, this.positionMenuConfig.delete_game.btn_bin_blue.nameSprite);
        this.btnMethodDelete1.anchor.set(0.5);
        this.btnMethodDelete1.scale.set(0);
        tabPlay_yourTurn.addChild(this.btnMethodDelete1);
        //
        this.btnBin1 = new Phaser.Button(game, this.positionMenuConfig.delete_game.bin.x, this.positionMenuConfig.delete_game.bin.y, this.positionMenuConfig.delete_game.bin.nameAtlas, this.onClickBinYourTurn, this, null, this.positionMenuConfig.delete_game.bin.nameSprite);
        this.btnBin1.anchor.set(0.5);
        tabPlay_yourTurn.addChild(this.btnBin1);
        //
        this.btnCancleDelelte1 = new Phaser.Button(game, this.positionMenuConfig.delete_game.btn_x.x, this.positionMenuConfig.delete_game.btn_x.y, this.positionMenuConfig.delete_game.btn_x.nameAtlas, this.onClickCancleDelete, this, null, this.positionMenuConfig.delete_game.btn_x.nameSprite);
        this.btnCancleDelelte1.anchor.set(0.5);
        this.btnCancleDelelte1.kill();
        tabPlay_yourTurn.addChild(this.btnCancleDelelte1);
        //
        this._height += tabPlay_yourTurn.height;
    }

    addTittleTheirTurn() {
        //
        let tabPlay_theirTurn = new Phaser.Sprite(game, this.positionMenuConfig.tab_yourTurn.x * window.GameConfig.RESIZE, this.positionMenuConfig.tab_theirTurn.y * window.GameConfig.RESIZE + this.grapChallenge.y + (MainData.instance().menuLoadResponses.challengeGames.length + MainData.instance().menuLoadResponses.doneGames.length) * this.configHeightOfRowTab, 'otherSprites', 'tab-friend');
        let txt_theirTurn = new Phaser.Text(game,
            this.positionMenuConfig.txt_theirTurn.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.txt_theirTurn.y * window.GameConfig.RESIZE,
            Language.instance().getData("209"),
            this.positionMenuConfig.txt_theirTurn.configs
        );
        txt_theirTurn.anchor.set(0, 0.5);
        let txt_count_theirTurn = new Phaser.Text(game, txt_theirTurn.x + txt_theirTurn.width + 10, this.positionMenuConfig.txt_count_theirTurn.y * window.GameConfig.RESIZE, `(${MainData.instance().menuLoadResponses.waitingGames.length} ${Language.instance().getData("210")})`, this.positionMenuConfig.txt_count_theirTurn.configs);
        txt_count_theirTurn.anchor.set(0, 0.5);
        tabPlay_theirTurn.addChild(txt_count_theirTurn);
        tabPlay_theirTurn.addChild(txt_theirTurn);
        //
        this.btnMethodDelete2 = new Phaser.Button(game, this.positionMenuConfig.delete_game.btn_bin_blue.x, this.positionMenuConfig.delete_game.btn_bin_blue.y, this.positionMenuConfig.delete_game.btn_bin_blue.nameAtlas, this.onClickMethodDeleteTheirTurn, this, null, this.positionMenuConfig.delete_game.btn_bin_blue.nameSprite);
        this.btnMethodDelete2.anchor.set(0.5);
        this.btnMethodDelete2.scale.set(0);
        tabPlay_theirTurn.addChild(this.btnMethodDelete2);
        //
        this.btnBin2 = new Phaser.Button(game, this.positionMenuConfig.delete_game.bin.x, this.positionMenuConfig.delete_game.bin.y, this.positionMenuConfig.delete_game.bin.nameAtlas, this.onClickBinTheirTurn, this, null, this.positionMenuConfig.delete_game.bin.nameSprite);
        this.btnBin2.anchor.set(0.5);
        tabPlay_theirTurn.addChild(this.btnBin2);
        //
        this.btnCancleDelelte2 = new Phaser.Button(game, this.positionMenuConfig.delete_game.btn_x.x, this.positionMenuConfig.delete_game.btn_x.y, this.positionMenuConfig.delete_game.btn_x.nameAtlas, this.onClickCancleDelete, this, null, this.positionMenuConfig.delete_game.btn_x.nameSprite);
        this.btnCancleDelelte2.anchor.set(0.5);
        this.btnCancleDelelte2.kill();
        tabPlay_theirTurn.addChild(this.btnCancleDelelte2);
        //
        this.addLineUnder(tabPlay_theirTurn);
        this.grapMenu.addChild(tabPlay_theirTurn);
        //
        this._height += tabPlay_theirTurn.height;
    }

    onClickMethodDeleteYourTurn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        this.event.deleteChallenge.dispatch(this.listYourTurnDeletes);
    }

    onClickMethodDeleteTheirTurn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        this.event.deleteChallenge.dispatch(this.listTheirTurnDeletes);
    }

    onClickBinTheirTurn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        this.listTheirTurnDeletes = [];
        //525
        this.btnBin2.kill();
        this.btnCancleDelelte2.revive();
        for (let i = 0; i < this.grapChallenge.children.length; i++) {
            let child = this.grapChallenge.children[i];
            if (child.mode == 'isWaitingGame') {
                child.showBtnDelete();
            }
        }
    }

    onClickBinYourTurn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        this.listYourTurnDeletes = [];
        this.btnBin1.kill();
        this.btnCancleDelelte1.revive();
        //
        for (let i = 0; i < this.grapChallenge.children.length; i++) {
            let child = this.grapChallenge.children[i];
            if (child.mode !== 'isWaitingGame') {
                child.showBtnDelete();
            }
        }
    }

    onClickCancleDelete() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        //
        this.btnBin1.revive();
        this.btnBin2.revive();
        this.btnCancleDelelte1.kill();
        this.btnCancleDelelte2.kill();
        //
        let tweenBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1).to({ x: 580 }, 50, Phaser.Easing.Linear.In, true);
        tweenBtnMethodDelete1.start();
        let tweenBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2).to({ x: 580 }, 50, Phaser.Easing.Linear.In, true);
        tweenBtnMethodDelete2.start();
        let tweenScaleBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1.scale).to({ x: 0, y: 0 }, 50, "Linear", true);
        tweenScaleBtnMethodDelete1.start();
        let tweenScaleBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2.scale).to({ x: 0, y: 0 }, 50, "Linear", true);
        tweenScaleBtnMethodDelete2.start();
        //
        for (let i = 0; i < this.grapChallenge.children.length; i++) {
            let child = this.grapChallenge.children[i];
            child.hideDelete();
        }
    }

    addLineUnder(sprite) {
        let line = new SpriteBase(this.positionMenuConfig.line_under);
        sprite.addChild(line);
    }

    createTabPlayInScrollMenu(i, configRow, avaKey, btnTexture, userWon, opponentWon, gameLogId, requestId, turnCount, opponentEntity, mode, isFinish, can_be_poked, poked, updated, message) {
        // LogConsole.log(i);
        let tabPlay = new TabPlayTurnBase(640 * window.GameConfig.RESIZE, (i + configRow) * this.configHeightOfRowTab + this.positionMenuConfig.tab_theirTurn.y * window.GameConfig.RESIZE, 'otherSprites', 'tab-friend');
        tabPlay.setData(avaKey, btnTexture, userWon, opponentWon, gameLogId, requestId, turnCount, opponentEntity, mode, isFinish, can_be_poked, poked, updated, message);
        tabPlay.event.playGame.add((data) => {
            this.event.playGame.dispatch(data);
        }, this);
        tabPlay.event.nudgeFriend.add((data) => {
            this.event.nudgeFriend.dispatch(data);
        }, this);
        tabPlay.event.deleteChallenge.add((opponent_id, mode) => {
            if (mode == "isWaitingGame") {
                if (this.listTheirTurnDeletes.includes(opponent_id)) {
                    this.listTheirTurnDeletes = this.removeFromListDeletes(this.listTheirTurnDeletes, opponent_id);
                } else {
                    this.listTheirTurnDeletes.push(opponent_id);
                }
                if (this.listTheirTurnDeletes.length > 0) {
                    if (this.btnMethodDelete2.x !== 525) {
                        //
                        let tweenBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2).to({ x: 525 }, 400, Phaser.Easing.Elastic.Out, true);
                        tweenBtnMethodDelete2.start();
                        let tweenScaleBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2.scale).to({ x: 1, y: 1 }, 50, "Linear", true);
                        tweenScaleBtnMethodDelete2.start();
                    }
                } else {
                    //
                    let tweenBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2).to({ x: 580 }, 50, Phaser.Easing.Linear.In, true);
                    tweenBtnMethodDelete2.start();
                    let tweenScaleBtnMethodDelete2 = game.add.tween(this.btnMethodDelete2.scale).to({ x: 0, y: 0 }, 50, "Linear", true);
                    tweenScaleBtnMethodDelete2.start();
                    //
                }
            } else {
                if (this.listYourTurnDeletes.includes(opponent_id)) {
                    this.listYourTurnDeletes = this.removeFromListDeletes(this.listYourTurnDeletes, opponent_id);
                } else {
                    this.listYourTurnDeletes.push(opponent_id);
                }
                if (this.listYourTurnDeletes.length > 0) {
                    if (this.btnMethodDelete1.x !== 525) {
                        //
                        let tweenBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1).to({ x: 525 }, 400, Phaser.Easing.Elastic.Out, true);
                        tweenBtnMethodDelete1.start();
                        let tweenScaleBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1.scale).to({ x: 1, y: 1 }, 50, "Linear", true);
                        tweenScaleBtnMethodDelete1.start();
                    }
                } else {
                    //
                    let tweenBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1).to({ x: 580 }, 50, Phaser.Easing.Linear.In, true);
                    tweenBtnMethodDelete1.start();
                    let tweenScaleBtnMethodDelete1 = game.add.tween(this.btnMethodDelete1.scale).to({ x: 0, y: 0 }, 50, "Linear", true);
                    tweenScaleBtnMethodDelete1.start();
                }
            }
        }, this);
        //
        if (isFinish == false) {
            this.addLineUnder(tabPlay);
        }
        this._height += tabPlay.height;
        //
        tabPlay.addItems();
        this.grapChallenge.addChild(tabPlay);
    }

    removeFromListDeletes(array, element) {
        return array.filter(el => el !== element);
    }

    scrollEventResponse(index) {
        if (index > this.countAppear) {
            this.countAppear = index;
            for (let i = (this.countAppear - 1); i < (this.countAppear + 3); i++) {
                if (i >= this.grapChallenge.children.length) {
                    break;
                }
                if (this.grapChallenge.children[i].isHide == true) {
                    this.grapChallenge.children[i].setAppear();
                }
            }
        }
    }

    removeAllChild() {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
        }
        this.configHeightOfRowTab = 106 * window.GameConfig.RESIZE;
        this.countHandleGetMainMenuResponse = 0;
        if (this.children !== null) {
            while (this.children.length > 0) {
                let item = this.children[0];
                this.removeChild(item);
                item.destroy();
                item = null;
            }
        }
    }

    get height() {
        return this._height;
    }

    set height(_height) {
        this._height = _height;
    }
}