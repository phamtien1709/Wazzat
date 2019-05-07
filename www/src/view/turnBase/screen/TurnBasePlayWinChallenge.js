import UserSpriteRightChallen from "../../../modules/win/ResultWin/UserSpriteRightChallen.js";
import UserSpriteLeftChallen from "../../../modules/win/ResultWin/UserSpriteLeftChallen.js";
import Common from "../../../common/Common.js";
import DataCommand from "../../../common/DataCommand.js";
import SpriteBase from "../../component/SpriteBase.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import ListView from "../../../../libs/listview/list_view.js";
import ButtonSongResult from "../item/button/ButtonSongResult.js";
import EventGame from "../../../controller/EventGame.js";
import ControllSound from "../../../controller/ControllSound.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import KeyBoard from "../../component/KeyBoard.js";
import ControllDialog from "../../ControllDialog.js";
import ControllLoading from "../../ControllLoading.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBasePlayWinChallenge extends BaseGroup {
    constructor() {
        super(game)
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.bg = new Phaser.Sprite(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
        this.event = {
            reHome: new Phaser.Signal(),
            nextGame: new Phaser.Signal()
        }
        this.challenge_msg_updated = 0;
    }

    afterInit() {
        this.addEventExtension();
        // this.sendRequestMainMenuLoad();
        this.loadDisplayChallenge(() => {
            this.handleBtnNext();
        });
        this.timeOutHideLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
    }

    handleBtnNext() {
        this.listGame = [];
        this.gamesList = [];
        this.challengeGames = [];
        this.doneGames = [];
        this.waitingGames = [];
        let gameLists = []
        let menuOpponentsResponse = { ...MainData.instance().menuOpponentsResponse }
        for (let res in menuOpponentsResponse) {
            gameLists.push(menuOpponentsResponse[res])
        }
        this.gamesList = gameLists;
        this.filterResponseGames();
        //
        this.listGame = this.checkHasGames();
        this.listGame = this.listGame.sort((a, b) => a.base_updated - b.base_updated);
        //
        if (this.listGame.length > 0 && this.listGame !== undefined) {
            var btn_next_playlist = new Phaser.Button(game, 374 * window.GameConfig.RESIZE, (game.height - 81) * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'btn_next_game');
            btn_next_playlist.anchor.set(0.5);
            let txt_btn = new Phaser.Text(game, 0, 0, `${Language.instance().getData("318")} ( ${this.listGame.length} )`, this.positionWinConfig.txt_btn_next_game.configs);
            txt_btn.anchor.set(0.5);
            btn_next_playlist.addChild(txt_btn);
            btn_next_playlist.events.onInputUp.add(() => {
                ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
                if (this.listGame[0].status == "YOUR_TURN") {
                    if (this.listGame[0].turnCount > 0) {
                        this.event.nextGame.dispatch({
                            opponent: this.listGame[0].opponentEntity,
                            type: "BECHALLENGED",
                            weeklyResult: {
                                userWon: this.listGame[0].weeklyResult.userWon,
                                opponentWon: this.listGame[0].weeklyResult.opponentWon
                            },
                            isHasHistory: true,
                            gameLogId: this.listGame[0].userGameLog,
                            requestId: this.listGame[0].id,
                            challenge_msg: this.listGame[0].challenge_msg
                        });
                    } else {
                        this.event.nextGame.dispatch({
                            opponent: this.listGame[0].opponentEntity,
                            type: "BECHALLENGED",
                            weeklyResult: {
                                userWon: this.listGame[0].weeklyResult.userWon,
                                opponentWon: this.listGame[0].weeklyResult.opponentWon
                            },
                            isHasHistory: false,
                            gameLogId: this.listGame[0].userGameLog,
                            requestId: this.listGame[0].id,
                            challenge_msg: this.listGame[0].challenge_msg
                        });
                    }
                } else if (this.listGame[0].status == "NO_GAME") {
                    this.event.nextGame.dispatch({
                        opponent: this.listGame[0].opponentEntity,
                        type: "CHALLENGE",
                        weeklyResult: {
                            userWon: this.listGame[0].weeklyResult.userWon,
                            opponentWon: this.listGame[0].weeklyResult.opponentWon,
                            challenge_msg: this.listGame[0].challenge_msg
                        }
                    });
                }
            });
            this.addChild(btn_next_playlist);
        } else {
            var btn_next_playlist = new Phaser.Button(game, 374 * window.GameConfig.RESIZE, (game.height - 81) * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'btn_next_game');
            btn_next_playlist.anchor.set(0.5);
            let txt_btn = new Phaser.Text(game, 0, 0, `${this.positionWinConfig.txt_btn_find_game.text}`, this.positionWinConfig.txt_btn_next_game.configs);
            txt_btn.anchor.set(0.5);
            btn_next_playlist.addChild(txt_btn);
            btn_next_playlist.events.onInputUp.add(() => {
                ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
                ControllScreen.instance().changeScreen(ConfigScreenName.TURN_BASE);
            }, this);
            this.addChild(btn_next_playlist);
        }
    }

    sendRequestMainMenuLoad() {
        SocketController.instance().sendData(DataCommand.MAIN_MENU_LOAD_REQUEST, null);
    }
    //LOGIC CODE
    setData(questions, opponent, user_playlist_mapping, opponent_playlist_mapping, playlist, result, challenge_msg, play_log_id, request_id) {
        this.questions = questions;
        this.opponent = opponent;
        this.user_playlist_mapping = user_playlist_mapping;
        this.opponent_playlist_mapping = opponent_playlist_mapping;
        this.playlist = playlist;
        this.result = result;
        this.play_log_id = play_log_id;
        this.request_id = request_id;
        this.challenge_msg = challenge_msg;
        this.challenge_msg = Common.formatName(this.challenge_msg, 25);
        // this.challenge_msg_updated = new Date().getTime();
        LogConsole.log(this.result);
        LogConsole.log(this.opponent);
        LogConsole.log(this.questions);
        LogConsole.log(this.playlist);
    }

    //DISPLAY CODE
    loadDisplayChallenge(callback) {
        this.UserSpriteRightWin = new UserSpriteRightChallen();
        this.UserSpriteRightWin.setAva('ava_fb', SocketController.instance().dataMySeft.vip);
        this.UserSpriteRightWin.setNameAndScore('You', this.result.score);
        this.UserSpriteRightWin.setLevelPlaylist(this.user_playlist_mapping);
        this.UserSpriteRightWin.makeDefaultScreenNotTween();
        this.UserSpriteRightWin.addDotOnline();
        this.addChild(this.UserSpriteRightWin);
        //
        this.UserSpriteLeftWin = new UserSpriteLeftChallen(this.opponent);
        this.UserSpriteLeftWin.setAva(this.opponent.avatar, this.opponent.vip);
        this.UserSpriteLeftWin.setNameAndScore(this.opponent.userName, `Lượt tiếp`);
        this.UserSpriteLeftWin.setLevelPlaylist(this.opponent_playlist_mapping);
        this.UserSpriteLeftWin.makeDefaultScreenNotTween();
        this.UserSpriteLeftWin.addDotOnline();
        this.addChild(this.UserSpriteLeftWin);
        this.createBoxScoreYourChallen();
        this.addEditMessage();
        callback();
    }

    createBoxScoreYourChallen() {
        var tabHeader = new Phaser.Sprite(game, 0, 0, 'playSprites', 'Header');
        var txt_540_290 = new Phaser.Text(game, game.width / 2, 38 * window.GameConfig.RESIZE, this.playlist.name, {
            font: `Gilroy`,
            fill: "white",
            fontSize: 23
        });
        txt_540_290.anchor.set(0.5);
        tabHeader.addChild(txt_540_290);
        this.addChild(tabHeader);
        var scrollMaskBoxResult = new Phaser.Graphics(game, 0, (game.height - 785) * window.GameConfig.RESIZE);
        scrollMaskBoxResult.beginFill();
        scrollMaskBoxResult.drawRect(0, 0, game.width, (game.height - 491) * window.GameConfig.RESIZE);
        scrollMaskBoxResult.endFill();
        this.addChild(scrollMaskBoxResult);
        //
        var box_result = new Phaser.Button(game, game.width / 2, 1200 * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'Box_ketqua_old');
        box_result.anchor.set(0.5, 0);
        box_result.mask = scrollMaskBoxResult;
        this.UserSpriteRightWin.addBtnChallenGemAndExp();
        //
        //
        this.addChild(box_result);
        //
        var gr = new Phaser.Group(game, 0, 0);
        gr.y = 1200;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35, 0, 615 * window.GameConfig.RESIZE, (game.height - 510) * window.GameConfig.RESIZE);
        const options = {
            direction: 'y',
            overflow: 100,
            padding: 0,
            searchForClicks: true
        };
        this.listView = new ListView(game, gr, bounds, options);
        //
        this.addTweenBoxResult(box_result, gr);
        for (let i = 0; i < 5; i++) {
            let songResult = new ButtonSongResult(this.questions[i].songEntity, this.result.answers[i], null, i);
            songResult.event.playSound.add(this.playSongResult, this);
            this.listView.add(songResult);
        }
        //shadow
        let shadow = new SpriteBase(this.positionWinConfig.shadow);
        shadow.y = game.height - MainData.instance().STANDARD_HEIGHT + this.positionWinConfig.shadow.y;
        this.addChild(shadow);
        //
        var btn_rehome = new Phaser.Button(game, 80 * window.GameConfig.RESIZE, (game.height - 81) * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'Button_home');
        btn_rehome.anchor.set(0.5);
        btn_rehome.events.onInputUp.add(this.backHome, this);
        this.addChild(btn_rehome);
    }

    addEditMessage() {
        this.txtEdit = new Phaser.Text(game, this.positionWinConfig.edit_message.txt.x, this.positionWinConfig.edit_message.txt.y, this.challenge_msg, this.positionWinConfig.edit_message.txt.configs);
        this.txtEdit.anchor.set(0.5);
        this.addChild(this.txtEdit);
        //
        this.btnEdit = new Phaser.Button(game, 480, 329, this.positionWinConfig.edit_message.btn.nameAtlas, this.onClickEditMessage, this, null, this.positionWinConfig.edit_message.btn.nameSprite);
        this.btnEdit.anchor.set(0.5);
        this.addChild(this.btnEdit);
    }

    onClickEditMessage() {
        let options = {
            maxLength: '',
            showTransparent: true,
            placeholder: "Nhắn tin",
            isSearch: false,
            typeInputText: "search", // chat, search, input
            configText: {
                width: 250,
                height: 40,
                x: 180,
                y: 300
            }
        };
        KeyBoard.instance().show(options);
        KeyBoard.instance().setValue(this.txtEdit.text);
    }

    backHome() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.reHome.dispatch();
    }

    playSongResult(id) {
        ControllSound.instance().pauseSound();
        for (let i = 0; i < this.listView.grp.children.length; i++) {
            let itemCheck = this.listView.grp.children[i];
            if (itemCheck.index !== id) {
                itemCheck.stopSound();
            } else {
                itemCheck.playSound();
            }
        }
    }

    addTweenBoxResult(box_result, grBox) {
        let tweenBoxResult = game.add.tween(box_result).to({ y: (game.height - 765) * window.GameConfig.RESIZE }, 500, "Linear", false);
        tweenBoxResult.start();
        let tweenGrResult = game.add.tween(grBox).to({ y: (game.height - 765) * window.GameConfig.RESIZE }, 500, "Linear", false);
        tweenGrResult.start();
    }

    onExtensionResponse(evtParams) {
        if (evtParams.cmd == DataCommand.MAIN_MENU_LOAD_RESPONSE) {
            if (evtParams.params.getUtfString('status') == 'OK') {
                // });
            } else {
                console.error(`MAIN_MENU_LOAD_RESPONSE not response: ${evtParams.params.errorMessage}`);
            }
        }
    }

    //LOGIC CODE

    filterResponseGames() {
        this.waitingGames = this.gamesList.filter(ele => ele.status == "THEIR_TURN");
        this.doneGames = this.gamesList.filter(ele => ele.status == "NO_GAME");
        this.challengeGames = this.gamesList.filter(ele => ele.status == "YOUR_TURN");
    }

    checkHasGames() {
        if (this.challengeGames !== undefined) {
            return this.challengeGames.concat(this.doneGames);
        } else {
            return [];
        }
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.backHome, this);
        KeyBoard.instance().event.enter.add(this.doneKeyboard, this);
        KeyBoard.instance().event.submit.add(this.doneKeyboard, this);
    }

    doneKeyboard() {
        let now = new Date().getTime();
        if (now - this.challenge_msg_updated > 6000) {
            this.challenge_msg = KeyBoard.instance().getValue();
            this.challenge_msg = Common.formatName(this.challenge_msg, 25);
            this.txtEdit.setText(this.challenge_msg);
            this.challenge_msg_updated = now;
            this.updateChallengeMsg();
            KeyBoard.instance().hide();
        } else {
            ControllDialog.instance().addDialog('Bạn thay đổi quá nhanh, vui lòng thử lại');
            KeyBoard.instance().hide();
        }
    }

    updateChallengeMsg() {
        let params = new SFS2X.SFSObject();
        params.putUtfString('challenge_msg', this.challenge_msg);
        params.putLong('challenge_request_id', this.request_id);
        SocketController.instance().sendData(DataCommand.CHALLENGE_GAME_UPDATE_MESSAGE_REQUEST, params);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.remove(this.backHome, this);
        KeyBoard.instance().event.enter.remove(this.doneKeyboard, this);
        KeyBoard.instance().event.submit.remove(this.doneKeyboard, this);
    }

    destroy() {
        clearTimeout(this.timeOutHideLoading);
        this.removeEventExtension();
        this.listView.removeAll();
        this.listView.destroy();
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