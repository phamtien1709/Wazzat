import AnswerPlayController from '../../controller/AnswerPlayController.js';
import IllegalTurnModule from './IllegalTurnModule.js';
import OnlineModeTrueFailAnswer from '../../view/onlinemode/item/OnlineModeTrueFailAnswer.js';
import UserSpriteLeft from './UserSpriteLeft.js';
import UserSpriteRight from './UserSpriteRight.js';
import Language from '../../model/Language.js';
import BaseGroup from '../../view/BaseGroup.js';
export default class PlayModule extends BaseGroup {
    constructor(state, positionPlayConfig, params) {
        super(game)
        this.state = state;
        this.positionPlayConfig = positionPlayConfig;
        this.stateParams = params;
        LogConsole.log(this.stateParams);
        // this.scoreOpp = params.scoreOpp;
    }
    createDefaultScreenPlayState() {
        this.inThisQuiz = true;
        this.illlegalTurn;
        this.illlegalTurnModule = new IllegalTurnModule(this.state, this.positionPlayConfig);
        this.timeCounter = game.time.create();
        this.UserSpriteLeft;
        this.UserSpriteRight;
        //
        this.addBGAndLineTop();
        this.addBtnRemoveAnswer();
        if (this.stateParams.countQuiz == 0) {
            this.addNamePlaylistAndTextLoading();
        }
        // this.addAnim();
        if (this.stateParams.isChallenged) {
            this.loadScreenPlayChallenged(`Lượt tiếp`);
        }
        else {
            this.loadScreenPlayChallenged(this.stateParams.scoreOpp);
        }
    }
    addBGAndLineTop() {
        this.bg_fake = new Phaser.Sprite(game, 0, 0, 'bg-play');
        this.addChild(this.bg_fake);
        let line_top = new Phaser.Sprite(game, this.positionPlayConfig.line_top.x, this.positionPlayConfig.line_top.y, this.positionPlayConfig.line_top.nameAtlas, this.positionPlayConfig.line_top.nameSprite);
        this.addChild(line_top);
    }

    addNamePlaylistAndTextLoading() {
        let namePlaylist = new Phaser.Text(game, this.positionPlayConfig.namePlaylist.x, this.positionPlayConfig.namePlaylist.y + 80, this.stateParams.playlistName, this.positionPlayConfig.namePlaylist.configs);
        namePlaylist.anchor.set(0.5);
        this.addChild(namePlaylist);
        let txtLoading = new Phaser.Text(game, this.positionPlayConfig.txt_ready.x, this.positionPlayConfig.txt_ready.y, this.positionPlayConfig.txt_ready.text, this.positionPlayConfig.txt_ready.configs);
        txtLoading.anchor.set(0.5);
        namePlaylist.addChild(txtLoading);
        let tweenNamePlaylist = game.add.tween(namePlaylist).to({ y: this.positionPlayConfig.namePlaylist.y }, 300, Phaser.Easing.Linear.Out, false);
        tweenNamePlaylist.start();
        setTimeout(() => {
            namePlaylist.destroy();
        }, 2800)
    }

    addCircleNormal() {
        for (let i = 0; i < 5; i++) {
            if (this.stateParams.countQuiz == 0) {
                setTimeout(() => {
                    let circleNormal = new Phaser.Sprite(game, (this.positionPlayConfig.circleNormal.x + i * 102), this.positionPlayConfig.circleNormal.y + 50, this.positionPlayConfig.circleNormal.nameAtlas, this.positionPlayConfig.circleNormal.nameSprite);
                    circleNormal.anchor.set(0.5);
                    let tweenCircle = game.add.tween(circleNormal).to({ y: this.positionPlayConfig.circleNormal.y }, 1000, Phaser.Easing.Elastic.Out, false);
                    tweenCircle.start();
                    this.addChild(circleNormal);
                }, i * 50);
            } else {
                let circleNormal = new Phaser.Sprite(game, (this.positionPlayConfig.circleNormal.x + i * 102), this.positionPlayConfig.circleNormal.y, this.positionPlayConfig.circleNormal.nameAtlas, this.positionPlayConfig.circleNormal.nameSprite);
                circleNormal.anchor.set(0.5);
                this.addChild(circleNormal);
            }
        }
    }
    /**
     * is will being done when clear code former
     */

    addBtnRemoveAnswer() {
        this.btn_remove_answer = game.add.button(this.positionPlayConfig.btn_remove_answer.x, this.positionPlayConfig.btn_remove_answer.y, this.positionPlayConfig.btn_remove_answer.nameAtlas, () => { }, this, null, this.positionPlayConfig.btn_remove_answer.nameSprite);
        this.btn_remove_answer.anchor.set(0.5);
        this.btn_remove_answer.kill();
        var txt_remove_answer = new Phaser.Text(game, this.positionPlayConfig.txt_remove_answer.x, this.positionPlayConfig.txt_remove_answer.y, Language.instance().getData("271"), this.positionPlayConfig.txt_remove_answer.configs);
        txt_remove_answer.anchor.set(0.5);
        var diamond_remove_answer = new Phaser.Sprite(game, this.positionPlayConfig.diamond_remove_answer.x, this.positionPlayConfig.diamond_remove_answer.y, this.positionPlayConfig.diamond_remove_answer.nameAtlas, this.positionPlayConfig.diamond_remove_answer.nameSprite);
        diamond_remove_answer.anchor.set(1, 0.5);
        var lock_answer = new Phaser.Sprite(game, this.positionPlayConfig.lock_answer.x, this.positionPlayConfig.lock_answer.y, this.positionPlayConfig.lock_answer.nameAtlas, this.positionPlayConfig.lock_answer.nameSprite);
        lock_answer.anchor.set(1, 0.5);
        this.btn_remove_answer.addChild(diamond_remove_answer);
        this.btn_remove_answer.addChild(txt_remove_answer);
        this.btn_remove_answer.addChild(lock_answer);
        this.btn_remove_answer.events.onInputDown.add(() => {

        });
    }

    createLoadingScreenAfterStart() {
        var soundCountDown = game.add.audio('beep_audio');
        var countdownNumber = new Phaser.Text(game, this.positionPlayConfig.countdownNumber.x, this.positionPlayConfig.countdownNumber.y + 80, '3', this.positionPlayConfig.countdownNumber.configs);
        countdownNumber.anchor.set(0.5);
        this.addChild(countdownNumber);
        let firstTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y }, 1000, Phaser.Easing.Elastic.Out, false);
        firstTween.start();
        // window.MQ.soundCountDown.play();
        soundCountDown.play();
        firstTween.onComplete.add(() => {
            // countdownNumber.scale.set(1);
            countdownNumber.y = this.positionPlayConfig.countdownNumber.y + 80;
            countdownNumber.setText('2');
            let secondTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y }, 1000, Phaser.Easing.Elastic.Out, false);
            secondTween.start();
            soundCountDown.play();
            // window.MQ.soundCountDown.play();
            secondTween.onComplete.add(() => {
                countdownNumber.y = this.positionPlayConfig.countdownNumber.y + 80;
                countdownNumber.setText('1');
                let thirdTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y }, 1000, Phaser.Easing.Elastic.Out, false);
                thirdTween.start();
                soundCountDown.play();
                // window.MQ.soundCountDown.play();
                thirdTween.onComplete.add(() => {
                    countdownNumber.setText(Language.instance().getData("270"));
                    countdownNumber.scale.set(0.5);
                    countdownNumber.y = this.positionPlayConfig.countdownNumber.y + 80;
                    let startTween = game.add.tween(countdownNumber).to({ y: this.positionPlayConfig.countdownNumber.y }, 1000, Phaser.Easing.Elastic.Out, false);
                    startTween.start();
                    startTween.onComplete.add(() => {
                        this.addCircleNormal();
                        countdownNumber.destroy();
                        // txt_ready.destroy();
                        soundCountDown.destroy();
                        this.btn_remove_answer.revive();
                        this.bg_fake.destroy();
                        this.songChoicedPlay.play();
                        var spriteTime = new Phaser.Sprite(game, 0, 785, 'otherSprites', 'tween-time');
                        spriteTime.anchor.set(0, 0.5);
                        this.addChild(spriteTime);
                        var tweenSpriteTime = game.add.tween(spriteTime.scale).to({ x: 60, y: 1 }, 10000, "Linear");
                        tweenSpriteTime.start();
                        this.timeCounter.start();
                        this.createFourAnswer();
                        tweenSpriteTime.onComplete.add(() => {

                        });
                    })
                })
            })
        })
    }

    loadScreenPlayChallenged(scoreOpp) {
        this.choosed = false;
        // opp(defined like player)
        //
        let versus = new Phaser.Sprite(game, this.positionPlayConfig.versus.x, this.positionPlayConfig.versus.y, this.positionPlayConfig.versus.nameAtlas, this.positionPlayConfig.versus.nameSprite);
        versus.anchor.set(0.5);
        let txt_versus = new Phaser.Text(game, this.positionPlayConfig.txt_versus.x, this.positionPlayConfig.txt_versus.y, this.positionPlayConfig.txt_versus.text, this.positionPlayConfig.txt_versus.configs);
        txt_versus.anchor.set(0.5);
        versus.addChild(txt_versus);
        //
        this.UserSpriteRight = new UserSpriteRight();
        this.UserSpriteRight.setAva('ava_fb');
        this.UserSpriteRight.setNameAndScore('You', this.stateParams.score);
        this.UserSpriteRight.setLevelPlaylist(this.stateParams.user_playlist_mapping);
        this.addChild(this.UserSpriteRight);
        //        
        this.trueOrFalseUser = new OnlineModeTrueFailAnswer();
        this.trueOrFalseUser.setSize(480, 480);
        this.trueOrFalseUser.x = -240 + 5 + 820;
        this.trueOrFalseUser.y = -240 + 20 + 235;
        this.addChild(this.trueOrFalseUser);
        //
        this.UserSpriteLeft = new UserSpriteLeft();
        this.UserSpriteLeft.setAva('ava_fb_friend');
        this.UserSpriteLeft.setNameAndScore(this.stateParams.opponent.name, scoreOpp);
        this.UserSpriteLeft.setLevelPlaylist(this.stateParams.opponent.mapping);
        this.addChild(this.UserSpriteLeft);
        //
        if (this.stateParams.countQuiz == 0) {
            versus.scale.set(0.1);
            this.addChild(versus);
            let tweenVs = game.add.tween(versus.scale).to({ x: 1, y: 1 }, 400, "Linear");
            tweenVs.start();
            this.UserSpriteLeft.makeTweenAva();
            this.UserSpriteRight.makeTweenAva();
        } else {
            this.addChild(versus);
            this.UserSpriteLeft.makeDefaultScreenNotTween();
            this.UserSpriteRight.makeDefaultScreenNotTween();
        }
        //
        this.trueOrFalseOpp = new OnlineModeTrueFailAnswer();
        this.trueOrFalseOpp.setSize(480, 480);
        this.trueOrFalseOpp.x = -240 + 5 + 262;
        this.trueOrFalseOpp.y = -240 + 20 + 235;
        this.addChild(this.trueOrFalseOpp);
        //create GamePlay Under name, ava and score
        this.createGamePlayChallenged();
    }

    setScore(score) {
        this.UserSpriteRight.setScore(score);
    }

    setScoreOpp(score) {
        this.UserSpriteLeft.setScore(score);
    }

    createGamePlayChallenged() {
        //this is play song
        this.songChoicedPlay = game.add.audio(`songChoiced${this.stateParams.countQuiz}`);
        if (this.stateParams.countQuiz == 0) {
            this.createLoadingScreenAfterStart();
        } else {
            // create answer
            this.bg_fake.destroy();
            this.btn_remove_answer.revive();
            this.addCircleNormal();
            this.addCorrectListSprites();
            this.addWrongListSprites();
            this.songChoicedPlay.play();
            var spriteTime = new Phaser.Sprite(game, 0, 785, 'otherSprites', 'tween-time');
            spriteTime.anchor.set(0, 0.5);
            var tweenSpriteTime = game.add.tween(spriteTime.scale).to({ x: 60, y: 1 }, 10000, "Linear");
            tweenSpriteTime.start();
            //create timer
            this.timeCounter.start();
            this.createFourAnswer();
        }
    }

    addCorrectListSprites() {
        for (let i = 0; i < this.stateParams.correctList.length; i++) {
            var circleWhite = new Phaser.Sprite(game, (this.positionPlayConfig.circleWhite.x + this.stateParams.correctList[i].countQuiz * 102), this.positionPlayConfig.circleWhite.y, this.positionPlayConfig.circleWhite.nameAtlas, this.positionPlayConfig.circleWhite.nameSprite);
            circleWhite.anchor.set(0.5);
            this.addChild(circleWhite);
            var correctMini = new Phaser.Text(game, 0, 0,
                this.stateParams.correctList[i].time);
            correctMini.anchor.set(0.5);
            circleWhite.addChild(correctMini);
        }
    }

    addWrongListSprites() {
        for (let i = 0; i < this.stateParams.wrongList.length; i++) {
            var circleWhite = new Phaser.Sprite(game, (this.positionPlayConfig.circleWhite.x + this.stateParams.wrongList[i] * 102), this.positionPlayConfig.circleWhite.y, this.positionPlayConfig.circleWhite.nameAtlas, this.positionPlayConfig.circleWhite.nameSprite);
            circleWhite.anchor.set(0.5);
            this.addChild(circleWhite);
            var wrongMini = new Phaser.Sprite(game,
                0, 0, this.positionPlayConfig.wrongMini.nameAtlas, this.positionPlayConfig.wrongMini.nameSprite);
            wrongMini.anchor.set(0.5);
            circleWhite.addChild(wrongMini);
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

    createFourAnswer() {
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                this.answerA = new AnswerPlayController(game.width / 2, 898 + (i * 220), {
                    "index": i,
                    "stateParams": this.stateParams
                }, this.state, this);
                this.addChild(this.answerA);
            }
            if (i == 1) {
                this.answerB = new AnswerPlayController(game.width / 2, 898 + (i * 220), {
                    "index": i,
                    "stateParams": this.stateParams
                }, this.state, this);
                this.addChild(this.answerB);
            }
            if (i == 2) {
                this.answerC = new AnswerPlayController(game.width / 2, 898 + (i * 220), {
                    "index": i,
                    "stateParams": this.stateParams
                }, this.state, this);
                this.addChild(this.answerC);
            }
            if (i == 3) {
                this.answerD = new AnswerPlayController(game.width / 2, 898 + (i * 220), {
                    "index": i,
                    "stateParams": this.stateParams
                }, this.state, this);
                this.addChild(this.answerD);
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
        this.illlegalTurnModule.makeNewGameBeChallenged(this.illlegalTurn, () => {
            this.illlegalTurnModule.addPopupIllegalTurn();
        });
    }

    destroy() {
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