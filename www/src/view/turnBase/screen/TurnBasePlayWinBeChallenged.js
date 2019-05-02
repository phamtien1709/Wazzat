import UserSpriteRightWin from "../../../modules/win/ResultWin/UserSpriteRightWin.js";
import UserSpriteLeftWin from "../../../modules/win/ResultWin/UserSpriteLeftWin.js";
import SpriteBase from "../../component/SpriteBase.js";
import DataCommand from "../../../common/DataCommand.js";
import FacebookAction from "../../../common/FacebookAction.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import MainData from "../../../model/MainData.js";
import ListView from "../../../../libs/listview/list_view.js";
import ButtonSongResult from "../item/button/ButtonSongResult.js";
import EventGame from "../../../controller/EventGame.js";
import ControllSound from "../../../controller/ControllSound.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import ControllLoading from "../../ControllLoading.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class TurnBasePlayWinBeChallenged extends BaseGroup {
    constructor() {
        super(game);
        this.positionWinConfig = JSON.parse(game.cache.getText('positionWinConfig'));
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.bg = new Phaser.Sprite(game, 0, 0, 'bg_create_room');
        this.addChild(this.bg);
        this.isLastWeek = false;
        this.event = {
            challengeAgain: new Phaser.Signal(),
            reHome: new Phaser.Signal()
        }
    }

    afterInit() {
        this.addEventExtension();
        this.loadDisplayBeChallenged(() => {

        });
        this.timeOutHideLoading = setTimeout(() => {
            ControllLoading.instance().hideLoading();
        }, 1000);
    }

    //LOGIC CODE
    setData(questions, opponent, user_playlist_mapping, opponent_playlist_mapping, playlist, result, opponentAnswerLogs, weeklyResult, play_log_id, request_id, dataTurnbase) {
        this.questions = questions;
        this.opponent = opponent;
        this.user_playlist_mapping = user_playlist_mapping;
        this.opponent_playlist_mapping = opponent_playlist_mapping;
        this.playlist = playlist;
        this.result = result;
        this.play_log_id = play_log_id;
        this.request_id = request_id;
        this.opponentAnswerLogs = opponentAnswerLogs;
        this.weeklyResult = weeklyResult;
        this.dataTurnbase = dataTurnbase;
        LogConsole.log(this.result);
        LogConsole.log(this.opponent);
        LogConsole.log(this.questions);
        LogConsole.log(this.playlist);
        LogConsole.log(this.opponentAnswerLogs);
        LogConsole.log(this.weeklyResult);
    }

    //DISPLAY CODE
    loadDisplayBeChallenged(callback) {
        this.UserSpriteRightWin = new UserSpriteRightWin();
        this.UserSpriteRightWin.setAva('ava_fb', SocketController.instance().dataMySeft.vip);
        this.UserSpriteRightWin.setNameAndScore('You', this.result.score);
        this.UserSpriteRightWin.setLevelPlaylist(this.user_playlist_mapping);
        this.UserSpriteRightWin.makeDefaultScreenNotTween(this.user_playlist_mapping);
        this.UserSpriteRightWin.addDotOnline();
        this.addChild(this.UserSpriteRightWin);
        //
        this.UserSpriteLeftWin = new UserSpriteLeftWin(this.opponent);
        this.UserSpriteLeftWin.setAva(this.opponent.avatar, this.opponent.vip);
        this.UserSpriteLeftWin.setNameAndScore(this.opponent.userName, this.result.scoreOpp);
        this.UserSpriteLeftWin.setLevelPlaylist(this.opponent_playlist_mapping);
        this.UserSpriteLeftWin.makeDefaultScreenNotTween();
        this.UserSpriteLeftWin.addDotOnline();
        this.addChild(this.UserSpriteLeftWin);
        //
        this.createBoxScoreFriendChallen();
        callback();
    }
    createBoxScoreFriendChallen() {
        console.log('createBoxScoreFriendChallencreateBoxScoreFriendChallen');
        console.log(this.weeklyResult);
        var txt_540_668 = new Phaser.Text(game, game.width / 2, 485 * window.GameConfig.RESIZE, Language.instance().getData("260"), {
            font: `Gilroy`,
            fill: "#9d92a6",
            fontSize: 19
        });
        txt_540_668.anchor.set(0.5);
        this.addChild(txt_540_668);
        var tabHeader = new Phaser.Sprite(game, 0, 0, 'playSprites', 'Header');
        var txt_540_290 = new Phaser.Text(game, game.width / 2, 35 * window.GameConfig.RESIZE, this.playlist.name, {
            font: `Gilroy`,
            fill: "white",
            fontSize: 23
        });
        txt_540_290.anchor.set(0.5);
        tabHeader.addChild(txt_540_290);
        this.addChild(tabHeader);
        var scrollMaskBoxResult = new Phaser.Graphics(game, 0, 551 * window.GameConfig.RESIZE);
        scrollMaskBoxResult.beginFill();
        scrollMaskBoxResult.drawRect(0, 0, game.width, (game.height - 676) * window.GameConfig.RESIZE);
        scrollMaskBoxResult.endFill();
        this.addChild(scrollMaskBoxResult);
        //
        var box_result = new Phaser.Button(game, game.width / 2, 1200 * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'Box_ketqua_old');
        box_result.anchor.set(0.5, 0);
        box_result.mask = scrollMaskBoxResult;
        var result_text = new Phaser.Text(game, game.width / 2, 520 * window.GameConfig.RESIZE, `Score`, {
            font: `GilroyBold`,
            fill: "white",
            fontSize: 30
        });
        if (this.result.score > this.result.scoreOpp) {
            ControllSoundFx.instance().playSound(ControllSoundFx.winturnbase);
            var result = new Phaser.Text(game, game.width / 2, 145 * window.GameConfig.RESIZE, Language.instance().getData("254"), {
                font: `GilroyBold`,
                fill: "white",
                fontSize: 43
            });
            result.anchor.set(0.5);
            if (this.weeklyResult == undefined) {
                result_text.setText(`0 - 0`);
            } else {
                result_text.setText(`${this.weeklyResult.opponentWon} - ${this.weeklyResult.userWon + 1}`);
            }
            var winAnim = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 140 * window.GameConfig.RESIZE, 'firework');
            winAnim.anchor.set(0.5);
            this.addChild(winAnim);
            var runSSWin = winAnim.animations.add('run_win');
            winAnim.animations.play('run_win', 30, true);
            // box_score.addChild(result);
            this.addChild(result);
            //
            this.UserSpriteRightWin.addBtnWinGemAndExp();
        } else if (this.result.score == this.result.scoreOpp) {
            ControllSoundFx.instance().playSound(ControllSoundFx.loseturnbase);
            var result = new Phaser.Text(game, game.width / 2, 145 * window.GameConfig.RESIZE, Language.instance().getData("255"), {
                font: `GilroyBold`,
                fill: "white",
                fontSize: 43
            });
            result.anchor.set(0.5);
            if (this.weeklyResult == undefined) {
                result_text.setText(`0 - 0`);
            } else {
                result_text.setText(`${this.weeklyResult.opponentWon} - ${this.weeklyResult.userWon}`);
            }
            // box_score.addChild(result);
            this.addChild(result);
            //
            this.UserSpriteRightWin.addBtnLoseGemAndExp();
        } else {
            ControllSoundFx.instance().playSound(ControllSoundFx.loseturnbase);
            var result = new Phaser.Text(game, game.width / 2, 145 * window.GameConfig.RESIZE, Language.instance().getData("256"), {
                font: `GilroyBold`,
                fill: "white",
                fontSize: 43
            });
            result.anchor.set(0.5);
            if (this.weeklyResult == undefined) {
                result_text.setText(`0 - 0`);
            } else {
                result_text.setText(`${this.weeklyResult.opponentWon + 1} - ${this.weeklyResult.userWon}`);
            }
            // box_score.addChild(result);
            this.addChild(result);
            //
            this.UserSpriteRightWin.addBtnLoseGemAndExp();
        }
        result_text.anchor.set(0.5);
        this.addChild(result_text);
        this.addChild(box_result);
        //
        var gr = new Phaser.Group(game, 0, 0);
        gr.y = 1200;
        this.addChild(gr);
        const bounds = new Phaser.Rectangle(35, 0, 615 * window.GameConfig.RESIZE, (game.height - 685) * window.GameConfig.RESIZE);
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
            let songResult = new ButtonSongResult(this.questions[i].songEntity, this.result.answers[i], this.opponentAnswerLogs[i], i);
            songResult.event.playSound.add(this.playSongResult, this);
            this.listView.add(songResult);
        }
        //shadow
        let shadow = new SpriteBase(this.positionWinConfig.shadow);
        shadow.y = game.height - MainData.instance().STANDARD_HEIGHT + this.positionWinConfig.shadow.y;
        this.addChild(shadow);
        //
        var btn_next_playlist = new Phaser.Button(game, 378 * window.GameConfig.RESIZE, (game.height - 86) * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'btn_next_game');
        btn_next_playlist.anchor.set(0.5);
        this.addChild(btn_next_playlist);
        let txt_btn = new Phaser.Text(game, 0, 0, Language.instance().getData("258"), this.positionWinConfig.txt_challenge_your_turn.configs);
        txt_btn.anchor.set(0.5);
        btn_next_playlist.addChild(txt_btn);
        btn_next_playlist.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.event.challengeAgain.dispatch();
        }, this);
        //btn share
        if (Language.instance().currentLanguage == "en") {
            var btnShare = new Phaser.Button(game, this.positionWinConfig.share_en.x * window.GameConfig.RESIZE, this.positionWinConfig.share_en.y * window.GameConfig.RESIZE, this.positionWinConfig.share_en.nameAtlas, () => { }, this, null, this.positionWinConfig.share_en.nameSprite);
            btnShare.anchor.set(0.5);
            btnShare.events.onInputUp.add(this.shareResult, this);
            this.addChild(btnShare);
        } else {
            var btnShare = new Phaser.Button(game, this.positionWinConfig.share.x * window.GameConfig.RESIZE, this.positionWinConfig.share.y * window.GameConfig.RESIZE, this.positionWinConfig.share.nameAtlas, () => { }, this, null, this.positionWinConfig.share.nameSprite);
            btnShare.anchor.set(0.5);
            btnShare.events.onInputUp.add(this.shareResult, this);
            this.addChild(btnShare);
        }
        //
        var btn_rehome = new Phaser.Button(game, 80 * window.GameConfig.RESIZE, (game.height - 86) * window.GameConfig.RESIZE, 'otherSprites', () => { }, this, null, 'Button_home');
        btn_rehome.anchor.set(0.5);
        btn_rehome.events.onInputUp.add(this.backHome, this);
        this.addChild(btn_rehome);
        //
        this.addMessageOpp();
        //
        this.addBtnLastWeekResult();
    }

    addBtnLastWeekResult() {
        this.btnLastWeekResult = new Phaser.Button(game, this.positionWinConfig.last_week.x * window.GameConfig.RESIZE, this.positionWinConfig.last_week.y * window.GameConfig.RESIZE, this.positionWinConfig.last_week.nameAtlas, () => { }, this, null, this.positionWinConfig.last_week.nameSprite);
        this.btnLastWeekResult.anchor.set(0.5);
        this.btnLastWeekResult.events.onInputUp.add(this.chooseLastWeek, this);
        let txt = new Phaser.Text(game, this.positionWinConfig.last_week.txt.x, this.positionWinConfig.last_week.txt.y, Language.instance().getData("257"), this.positionWinConfig.last_week.txt.configs);
        txt.anchor.set(0.5);
        this.btnLastWeekResult.addChild(txt);
        this.addChild(this.btnLastWeekResult);
    }

    chooseLastWeek() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.isLastWeek = true;
        ControllScreenDialog.instance().addLastWeekResultScreen(this.opponent);
    }

    addMessageOpp() {
        if (this.dataTurnbase.challenge_msg !== undefined && this.dataTurnbase.challenge_msg !== "" && this.dataTurnbase.challenge_msg !== null) {
            let triangleChat = new Phaser.Sprite(game, 75, 298, 'playSprites', 'Box_Chat_02');
            this.addChild(triangleChat);
            this.msgChallenge = new Phaser.Text(game, 25, 25, this.dataTurnbase.challenge_msg, {
                "font": "Gilroy",
                "fill": "#333333",
                "fontSize": 18,
                "wordWrap": true,
                "wordWrapWidth": 130,
                "align": "center"
            });
            //
            var configSpaceBox = 20 * window.GameConfig.RESIZE;
            var options = {
                "x": 35,
                "y": 310,
                "nameAtlas": "mailSprites",
                "nameSprite": "Box_Chat_01",
                "left": 25,
                "right": 25,
                "top": 25,
                "bot": 25,
                "width": 0,
                "height": 0,
                "name": "challengeMsg"
            };
            options.width = (this.msgChallenge.width + configSpaceBox) / window.GameConfig.RESIZE;
            options.height = (this.msgChallenge.height + configSpaceBox) / window.GameConfig.RESIZE;
            this.bg = new SpriteScale9Base(options);
            this.bg.addChild(this.msgChallenge);
            this.addChild(this.bg);
            this.msgChallenge.x = configSpaceBox / 2;
            this.msgChallenge.y = configSpaceBox / 2;
        }
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

    shareResult() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        FacebookAction.instance().share();
    }

    onShared(response) {
        if (response.hasOwnProperty("error_code")) {

        } else {
            this.sendShareResult();
        }
    }
    sendShareResult() {
        SocketController.instance().sendData(DataCommand.FB_USER_SHARED_RESULT_REQUEST, null);
    }
    onExtensionResponse(evtParams) {

    }

    addTweenBoxResult(box_result, grBox) {
        let tweenBoxResult = game.add.tween(box_result).to({ y: 551 * window.GameConfig.RESIZE }, 500, "Linear", false);
        tweenBoxResult.start();
        let tweenGrResult = game.add.tween(grBox).to({ y: 551 * window.GameConfig.RESIZE }, 500, "Linear", false);
        tweenGrResult.start();
    }

    backHome() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        if (this.isLastWeek == false) {
            this.event.reHome.dispatch();
        }
    }

    backLastWeek() {
        this.isLastWeek = false;
    }

    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.add(this.backHome, this);
        EventGame.instance().event.backLastWeek.add(this.backLastWeek, this);
        FacebookAction.instance().event.share.add(this.onShared, this);
    }

    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
        EventGame.instance().event.backButton.remove(this.backHome, this);
        EventGame.instance().event.backLastWeek.remove(this.backLastWeek, this);
        FacebookAction.instance().event.share.remove(this.onShared, this);
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