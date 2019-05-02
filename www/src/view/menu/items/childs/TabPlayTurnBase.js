import ImageLoader from "../../../../Component/ImageLoader.js";
import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import ControllScreenDialog from "../../../ControllScreenDialog.js";
import SpriteBase from "../../../component/SpriteBase.js";
import Common from "../../../../common/Common.js";
import ButtonTickDelete from "./ButtonTickDelete.js";
import MainData from "../../../../model/MainData.js";
import Language from "../../../../model/Language.js";

export default class TabPlayTurnBase extends Phaser.Sprite {
    constructor(x, y, nameAtlas, nameSprite) {
        super(game, x, y, nameAtlas, nameSprite);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            playGame: new Phaser.Signal(),
            nudgeFriend: new Phaser.Signal(),
            deleteChallenge: new Phaser.Signal()
        }
        this.isHide = false;
        this.timeoutInput = null;
    }

    setData(avaKey, btnTexture, userWon, opponentWon, gameLogId, requestId, turnCount, opponentEntity, mode, isFinish, can_be_poked, poked, updated, message) {
        this.avaKey = avaKey;
        this.btnTexture = btnTexture;
        this.txtButton = "";
        this.configTxtButton = null
        this.userWon = userWon;
        this.opponentWon = opponentWon;
        this.gameLogId = gameLogId;
        this.requestId = requestId;
        this.turnCount = turnCount;
        this.opponentEntity = opponentEntity;
        this.mode = mode;
        this.isFinish = isFinish;
        this.can_be_poked = can_be_poked;
        this.poked = poked;
        this.baseUpdated = updated;
        this.updated = this.controllUpdated(this.baseUpdated);
        this.message = message;
        if (turnCount !== -1) {
            if (turnCount > 0) {
                this.btnTexture = 'btnNotFirstGame';
                if (Language.instance().currentLanguage == "en") {
                    this.txtButton = "PLAY";
                    this.configTxtButton = {
                        "font": "23px GilroyMedium",
                        "fill": "#00eef1",
                        "boundsAlignH": "center",
                        "boundsAlignV": "middle"
                    }
                } else {
                    this.txtButton = "CHƠI";
                    this.configTxtButton = {
                        "font": "23px GilroyMedium",
                        "fill": "#00eef1",
                        "boundsAlignH": "center",
                        "boundsAlignV": "middle"
                    }
                }
            } else {
                this.btnTexture = 'btnFirstGame';
                if (Language.instance().currentLanguage == "en") {
                    this.txtButton = "ACCEPT";
                    this.configTxtButton = {
                        "font": "23px GilroyMedium",
                        "fill": "#ffa901",
                        "boundsAlignH": "center",
                        "boundsAlignV": "middle"
                    }
                } else {
                    this.txtButton = "ĐỒNG Ý";
                    this.configTxtButton = {
                        "font": "23px GilroyMedium",
                        "fill": "#ffa901",
                        "boundsAlignH": "center",
                        "boundsAlignV": "middle"
                    }
                }
            }
        } else {
            if (Language.instance().currentLanguage == "en") {
                this.txtButton = "POKE";
                this.configTxtButton = {
                    "font": "23px GilroyMedium",
                    "fill": "#8e8a84",
                    "boundsAlignH": "center",
                    "boundsAlignV": "middle"
                }
            } else {
                this.txtButton = "CHỌC";
                this.configTxtButton = {
                    "font": "23px GilroyMedium",
                    "fill": "#8e8a84",
                    "boundsAlignH": "center",
                    "boundsAlignV": "middle"
                }
            }
        }
    }

    setHide() {
        // this.kill();
        this.isHide = true;
        this.x = 0;
        this.visible = false;
    }

    setAppear() {
        // this.kill();
        this.isHide = false;
        this.x = 0;
        this.visible = true;
    }

    controllUpdated(updated) {
        return this.formatChallengeGameUpdated(updated);
    }

    formatChallengeGameUpdated(time) {
        let txtTime = "";
        let now = Date.now();
        let timeRemain = now - time;
        timeRemain = parseInt(timeRemain / 1000);
        let timeMonth = 2592000;
        let timeWeek = 604800;
        let timeDay = 86400;
        let timeHour = 3600;
        let timeMin = 60;
        let calcMonth = parseInt((timeRemain / timeMonth).toFixed(0));
        //
        if (calcMonth > 0) {
            txtTime = `${calcMonth} ${Language.instance().getData("214")}`;
        } else {
            let calWeek = parseInt(timeRemain / timeWeek);
            if (calWeek > 0) {
                txtTime = `${calWeek} ${Language.instance().getData("215")}`;
            } else {
                let calDate = parseInt(timeRemain / timeDay);
                if (calDate > 0) {
                    txtTime = `${calDate} ${Language.instance().getData("216")}`;
                } else {
                    let calHour = parseInt(timeRemain / timeHour);
                    if (calHour > 0) {
                        txtTime = `${calHour} ${Language.instance().getData("217")}`;
                    } else {
                        let calMin = parseInt(timeRemain / timeMin);
                        if (calMin > 0) {
                            txtTime = `${calMin} ${Language.instance().getData("218")}`;
                        } else {
                            txtTime = `${Language.instance().getData("219")}`;
                        }
                    }
                }
            }
        }
        return txtTime;
    }

    addItems() {
        this.isHide = false;
        let maskAva = new Phaser.Graphics(game, 0, 0);
        maskAva.beginFill(0xffffff);
        maskAva.drawCircle(71 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, 68 * window.GameConfig.RESIZE);
        maskAva.anchor.set(0.5);
        this.addChild(maskAva);
        //
        let friend_avaChallenge = new ImageLoader(71 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, 'ava-default', this.avaKey, i);
        friend_avaChallenge.sprite.anchor.set(0.5);
        friend_avaChallenge.sprite.width = 68;
        friend_avaChallenge.sprite.height = 68;
        friend_avaChallenge.sprite.mask = maskAva;
        friend_avaChallenge.sprite.inputEnabled = true;
        friend_avaChallenge.event.loadAvaDone.add(() => {
            friend_avaChallenge.sprite.width = 68;
            friend_avaChallenge.sprite.height = 68;
        }, this);
        friend_avaChallenge.sprite.events.onInputUp.add(() => {
            if (MainData.instance().menuDragging == false) {
                friend_avaChallenge.sprite.inputEnabled = false;
                ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
                ControllScreenDialog.instance().addUserProfile(this.opponentEntity.id);
                this.timeoutInput = setTimeout(() => {
                    friend_avaChallenge.sprite.inputEnabled = true;
                }, 2000);
            }
        }, this);
        this.addChild(friend_avaChallenge.sprite);
        this.nameFriendChallenge = new Phaser.Text(game, 123 * window.GameConfig.RESIZE, 50 * window.GameConfig.RESIZE, Common.formatName(this.opponentEntity.userName, 20), {
            font: `Gilroy`,
            fill: "white",
            fontSize: 24 * window.GameConfig.RESIZE
        });
        this.nameFriendChallenge.anchor.set(0, 0.5);
        this.addChild(this.nameFriendChallenge);
        // this.btn_accept = new Phaser.Button(game,
        //     this.positionMenuConfig.btn_accept.x * window.GameConfig.RESIZE,
        //     this.positionMenuConfig.btn_accept.y * window.GameConfig.RESIZE,
        //     'otherSprites',
        //     () => { },
        //     this, null, this.btnTexture
        // );
        this.btn_accept = new Phaser.Text(game,
            this.positionMenuConfig.btn_accept.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.btn_accept.y * window.GameConfig.RESIZE,
            this.txtButton,
            this.configTxtButton
        )
        this.btn_accept.inputEnabled = true;
        this.btn_accept.anchor.set(0.5);
        this.addChild(this.btn_accept);
        let textScore = new Phaser.Text(game, 430 * window.GameConfig.RESIZE, 55 * window.GameConfig.RESIZE, `${this.opponentWon} : ${this.userWon}`, {
            font: `Gilroy`,
            fill: "white",
            fontSize: 24 * window.GameConfig.RESIZE
        });
        //
        textScore.anchor.set(0.5);
        this.addChild(textScore);
        this.btn_accept.value = {
            "gameLogId": this.gameLogId,
            "requestId": this.requestId,
            "opponentEntity": this.opponentEntity,
            "mode": this.mode,
            "can_be_poked": this.can_be_poked,
            "challenge_msg": this.message
        };
        //
        if (this.mode == "isWaitingGame") {
            if (this.can_be_poked == 0) {
                this.btn_accept.kill();
            }
        }
        //
        if (this.poked == 1) {
            this.btn_accept.y = 35
            this.txtPoked = new Phaser.Text(game, 505 * window.GameConfig.RESIZE, 70 * window.GameConfig.RESIZE, Language.instance().getData("253"), {
                font: `Gilroy`,
                fill: "#8a8a8a",
                fontSize: 16 * window.GameConfig.RESIZE
            });
            this.txtPoked.anchor.set(0, 0.5);
            this.addChild(this.txtPoked);
        }
        //
        let txtTime = new Phaser.Text(game, 125 * window.GameConfig.RESIZE, 80 * window.GameConfig.RESIZE, this.updated, {
            font: `Gilroy`,
            fill: "#8a8a8a",
            fontSize: 16 * window.GameConfig.RESIZE
        });
        txtTime.anchor.set(0, 0.5);
        this.addChild(txtTime);
        // var indexOfData = i;
        this.btn_accept.events.onInputUp.addOnce(() => {
            //
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            //
            this.btn_accept.input.enabled = false;
            this.gameLogId = this.gameLogId;
            if (this.btnTexture == 'btnFirstGame') {
                this.event.playGame.dispatch({
                    type: "BECHALLENGED",
                    isHasHistory: false,
                    opponent: this.btn_accept.value.opponentEntity,
                    gameLogId: this.btn_accept.value.gameLogId,
                    requestId: this.btn_accept.value.requestId,
                    weeklyResult: {
                        userWon: this.userWon,
                        opponentWon: this.opponentWon
                    },
                    challenge_msg: this.btn_accept.value.challenge_msg
                });
            } else if (this.btnTexture == 'btnNotFirstGame') {
                //isDoneGame
                if (this.mode == "isDoneGame") {
                    this.event.playGame.dispatch({
                        type: "CHALLENGE",
                        opponent: this.btn_accept.value.opponentEntity,
                        weeklyResult: {
                            userWon: this.userWon,
                            opponentWon: this.opponentWon
                        },
                        challenge_msg: this.btn_accept.value.challenge_msg
                    });
                }
                //isChallengeGame
                if (this.mode == "isChallengeGame") {
                    this.event.playGame.dispatch({
                        type: "BECHALLENGED",
                        isHasHistory: true,
                        opponent: this.btn_accept.value.opponentEntity,
                        gameLogId: this.btn_accept.value.gameLogId,
                        requestId: this.btn_accept.value.requestId,
                        weeklyResult: {
                            userWon: this.userWon,
                            opponentWon: this.opponentWon
                        },
                        challenge_msg: this.btn_accept.value.challenge_msg
                    });
                }
            } else {
                // console.log(this.btn_accept.value);
                this.event.nudgeFriend.dispatch(this.btn_accept.value);
            }
            setTimeout(() => {
                this.btn_accept.input.enabled = true;
            }, 5000);
        });
        //
        if (this.opponentEntity.vip === true) {
            let frameVip = new Phaser.Sprite(game, this.positionMenuConfig.frame_ava_small.x, this.positionMenuConfig.frame_ava_small.y, this.positionMenuConfig.frame_ava_small.nameAtlas, this.positionMenuConfig.frame_ava_small.nameSprite);
            this.addChild(frameVip);
        }
        //
        if (this.opponentEntity.is_online == true) {
            let dotOnline = new SpriteBase({
                x: 95,
                y: 43,
                nameAtlas: "defaultSource",
                nameSprite: "Online"
            });
            this.addChild(dotOnline);
        } else {
            let dotOnline = new SpriteBase({
                x: 95,
                y: 43,
                nameAtlas: "defaultSource",
                nameSprite: "Offline"
            });
            this.addChild(dotOnline);
        }
        this.addBtnDelete();
        this.addMessage();
    }

    addMessage() {
        if (this.message !== null && this.message !== '') {
            this.nameFriendChallenge.y = 30;
            this.message = Common.formatName(this.message.toString(), 28);
            this.txtMessage = new Phaser.Text(game, 125, 57, this.message, {
                "font": "Gilroy",
                "fill": "#ffa33a",
                "fontSize": 21
            });
            this.txtMessage.anchor.set(0, 0.5);
            this.addChild(this.txtMessage);
        }
    }

    addBtnDelete() {
        this.btnDelete = new ButtonTickDelete(
            this.positionMenuConfig.delete_game.btn_delete.x * window.GameConfig.RESIZE,
            this.positionMenuConfig.delete_game.btn_delete.y * window.GameConfig.RESIZE,
            this.positionMenuConfig.delete_game.btn_delete.nameAtlas, this.positionMenuConfig.delete_game.btn_delete.nameSprite
        );
        this.btnDelete.event.tick.add(this.deleteChallenge, this);
        this.btnDelete.kill();
        this.addChild(this.btnDelete);
    }

    deleteChallenge() {
        // console.log(this.opponentEntity);
        if (this.isClickDelete == true) {
            this.isClickDelete = false;
            this.btnDelete.hideTick();
            if (this.opponentEntity !== null) {
                this.event.deleteChallenge.dispatch(this.opponentEntity.id, this.mode);
            }
        } else {
            this.isClickDelete = true;
            this.btnDelete.showTick();
            if (this.opponentEntity !== null) {
                this.event.deleteChallenge.dispatch(this.opponentEntity.id, this.mode);
            }
        }
    }

    showBtnDelete() {
        this.isClickDelete = false;
        if (this.btnDelete !== undefined) {
            this.btnDelete.hideTick();
            this.btnDelete.revive();
        }
        if (this.txtPoked) {
            this.txtPoked.kill();
        }
        if (this.can_be_poked !== 0) {
            this.btn_accept.kill();
        }
    }

    hideDelete() {
        if (this.can_be_poked !== 0) {
            this.btn_accept.revive();
        }
        if (this.txtPoked) {
            this.txtPoked.revive();
        }
        if (this.btnDelete !== undefined) {
            this.btnDelete.kill();
        }
    }

    destroy() {
        if (this.timeoutInput !== null) {
            clearTimeout(this.timeoutInput)
        }
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}