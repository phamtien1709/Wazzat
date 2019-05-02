import ControllSoundFx from "../../../../controller/ControllSoundFx.js";
import EventGame from "../../../../controller/EventGame.js";
import BaseGroup from "../../../../view/BaseGroup.js";

export default class AnimClaimReward extends BaseGroup {
    constructor(type, reward, finishPoint = null) {
        super(game)
        this.event = {
            tweenIconPls: new Phaser.Signal(),
            tweenDoneAll: new Phaser.Signal()
        };
        this.reward = reward;
        this.type = type;
        this.finishPoint = finishPoint;
        this.definedPosition();
        this.afterInit();
    }

    definedPosition() {
        this.pointsArrayGem1 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 145 * window.GameConfig.RESIZE,
            y: 255 * window.GameConfig.RESIZE
        }, {
            x: 459 * window.GameConfig.RESIZE,
            y: 118 * window.GameConfig.RESIZE
        }, {
            x: 380 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem2 = [{
            x: 520 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 520 * window.GameConfig.RESIZE,
            y: 290 * window.GameConfig.RESIZE
        }, {
            x: 459 * window.GameConfig.RESIZE,
            y: 118 * window.GameConfig.RESIZE
        }, {
            x: 380 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem3 = [{
            x: 560 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 181 * window.GameConfig.RESIZE,
            y: 538 * window.GameConfig.RESIZE
        }, {
            x: 384 * window.GameConfig.RESIZE,
            y: 208 * window.GameConfig.RESIZE
        }, {
            x: 380 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem4 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 805 * window.GameConfig.RESIZE,
            y: 471 * window.GameConfig.RESIZE
        }, {
            x: 339 * window.GameConfig.RESIZE,
            y: 302 * window.GameConfig.RESIZE
        }, {
            x: 380 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.arrParentGems = [this.pointsArrayGem1, this.pointsArrayGem2, this.pointsArrayGem3, this.pointsArrayGem4];
        //
        this.pointsArrayMic1 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 396 * window.GameConfig.RESIZE,
            y: 313 * window.GameConfig.RESIZE
        }, {
            x: 492 * window.GameConfig.RESIZE,
            y: 198 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayMic2 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 307 * window.GameConfig.RESIZE,
            y: 349 * window.GameConfig.RESIZE
        }, {
            x: 258 * window.GameConfig.RESIZE,
            y: 243 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayMic3 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 307 * window.GameConfig.RESIZE,
            y: 349 * window.GameConfig.RESIZE
        }, {
            x: 288 * window.GameConfig.RESIZE,
            y: 156 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayMic4 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 136 * window.GameConfig.RESIZE,
            y: 417 * window.GameConfig.RESIZE
        }, {
            x: 246 * window.GameConfig.RESIZE,
            y: 243 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.arrParentMics = [this.pointsArrayMic1, this.pointsArrayMic2, this.pointsArrayMic3, this.pointsArrayMic4];
        //
        this.pointsArrayTicket1 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 433 * window.GameConfig.RESIZE,
            y: 274 * window.GameConfig.RESIZE
        }, {
            x: 287 * window.GameConfig.RESIZE,
            y: 123 * window.GameConfig.RESIZE
        }, {
            x: 556 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayTicket2 = [{
            x: 315 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 580 * window.GameConfig.RESIZE,
            y: 324 * window.GameConfig.RESIZE
        }, {
            x: 548 * window.GameConfig.RESIZE,
            y: 210 * window.GameConfig.RESIZE
        }, {
            x: 556 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayTicket3 = [{
            x: 325 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 441 * window.GameConfig.RESIZE,
            y: 197 * window.GameConfig.RESIZE
        }, {
            x: 548 * window.GameConfig.RESIZE,
            y: 209 * window.GameConfig.RESIZE
        }, {
            x: 556 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayTicket4 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 223 * window.GameConfig.RESIZE,
            y: 331 * window.GameConfig.RESIZE
        }, {
            x: 491 * window.GameConfig.RESIZE,
            y: 234 * window.GameConfig.RESIZE
        }, {
            x: 556 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.arrParentTickets = [this.pointsArrayTicket1, this.pointsArrayTicket2, this.pointsArrayTicket3, this.pointsArrayTicket4];
        //
        this.pointsArrayHeart1 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 396 * window.GameConfig.RESIZE,
            y: 313 * window.GameConfig.RESIZE
        }, {
            x: 492 * window.GameConfig.RESIZE,
            y: 198 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayHeart2 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 307 * window.GameConfig.RESIZE,
            y: 349 * window.GameConfig.RESIZE
        }, {
            x: 258 * window.GameConfig.RESIZE,
            y: 243 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayHeart3 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 307 * window.GameConfig.RESIZE,
            y: 349 * window.GameConfig.RESIZE
        }, {
            x: 288 * window.GameConfig.RESIZE,
            y: 156 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.pointsArrayHeart4 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 474 * window.GameConfig.RESIZE
        }, {
            x: 136 * window.GameConfig.RESIZE,
            y: 417 * window.GameConfig.RESIZE
        }, {
            x: 246 * window.GameConfig.RESIZE,
            y: 243 * window.GameConfig.RESIZE
        }, {
            x: 194 * window.GameConfig.RESIZE,
            y: 55 * window.GameConfig.RESIZE
        }];
        this.arrParentHearts = [this.pointsArrayHeart1, this.pointsArrayHeart2, this.pointsArrayHeart3, this.pointsArrayHeart4];
        //
        if (this.finishPoint !== null) {
            if (this.type == "DIAMOND") {
                this.pointsArrayGem1[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayGem2[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayGem3[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayGem4[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
            } else if (this.type == "TICKET") {
                this.pointsArrayTicket1[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayTicket2[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayTicket3[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayTicket4[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
            } else if (this.type == "SUPPORT_ITEM") {
                this.pointsArrayMic1[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayMic2[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayMic3[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayMic4[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
            } else if (this.type == "HEART") {
                this.pointsArrayHeart1[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayHeart2[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayHeart3[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };
                this.pointsArrayHeart4[3] = {
                    x: this.finishPoint.x * window.GameConfig.RESIZE,
                    y: this.finishPoint.y * window.GameConfig.RESIZE
                };

            }
        }
    }

    afterInit() {
        if (this.reward !== 0) {
            this.addIcon();
        }
    }

    addIcon() {
        ControllSoundFx.instance().playSound(ControllSoundFx.takereward);
        var nameAtlasSpriteBig = "otherSprites";
        var nameSpriteBig = "";
        if (this.type == "DIAMOND") {
            nameSpriteBig = "Gem_Big";
        } else if (this.type == "TICKET") {
            nameSpriteBig = "Ticket_Big";
        } else if (this.type == "SUPPORT_ITEM") {
            nameSpriteBig = "Mic_Big";
        } else if (this.type == "HEART") {
            nameSpriteBig = "Heart_Big";
        }
        //
        this.icon_big = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 474 * window.GameConfig.RESIZE, nameAtlasSpriteBig, nameSpriteBig);
        this.icon_big.anchor.set(0.5);
        this.icon_big.scale.set(0.3);
        this.txtReward = new Phaser.Text(game, 320 * window.GameConfig.RESIZE, 600 * window.GameConfig.RESIZE, `+${this.reward}`, {
            "font": "GilroyBold",
            "fill": "#3aff78",
            "align": "center",
            "fontSize": 40
        });
        this.txtReward.anchor.set(0.5);
        this.txtReward.alpha = 0.5;
        this.txtReward.scale.set(0.5);
        let tweenTxtReward = game.add.tween(this.txtReward.scale).to({ x: 1, y: 1 }, 700, Phaser.Easing.Linear.In, false);
        tweenTxtReward.start();
        tweenTxtReward.onUpdateCallback(() => {
            this.txtReward.alpha += 0.05;
        }, this);
        tweenTxtReward.onComplete.add(() => {
            this.txtReward.destroy();
        }, this);
        let scaleTween = game.add.tween(this.icon_big.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.In, false);
        scaleTween.start();
        let tweenParent = game.add.tween(this.icon_big).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.In, false);
        tweenParent.start();
        let rotate = 0.1;
        tweenParent.onUpdateCallback(() => {
            this.icon_big.rotation += rotate;
            if (this.icon_big.rotation > 0.2) {
                rotate = -0.07;
            } else if (this.icon_big.rotation < -0.2) {
                rotate = 0.07;
            }
        }, this);
        tweenParent.onComplete.add(() => {
            this.icon_big.rotation = 0;
            let scaleGemBigAgain = game.add.tween(this.icon_big.scale).to({ x: 0.5, y: 0.5 }, 300, Phaser.Easing.Linear.In, false);
            scaleGemBigAgain.start();
            scaleGemBigAgain.onComplete.add(() => {
                this.icon_big.destroy();
            }, this);
            let objResource = {
                resoure: parseInt(this.txtReward.text)
            }
            let tweenText = game.add.tween(objResource).to({ resoure: 0 }, 500, "Linear", false);
            tweenText.start();
            this.txtReward.destroy();
            tweenText.onUpdateCallback(() => {

            }, this)
            tweenText.onComplete.add(() => {
                this.event.tweenIconPls.dispatch();
            }, this);
            this.addIconMoveCurve();
        }, this);
        this.addStarNim();
        this.addChild(this.icon_big);
        this.addChild(this.txtReward);
    }
    addStarNim() {
        let starNim = new Phaser.Sprite(game, 0, 0, 'SoloModeStar');
        starNim.anchor.set(0.5);
        starNim.scale.set(1.5);
        var runStarNim = starNim.animations.add('run_star');
        starNim.animations.play('run_star', 30, true);
        this.icon_big.addChild(starNim);
    }
    addIconMoveCurve() {
        var nameAtlasMovingSprite = "defaultSource";
        var nameAtlasSpriteBig = "otherSprites";
        var nameMovingSprite = "";
        var arrMovingSprite = [];
        if (this.type == "DIAMOND") {
            nameMovingSprite = "Gem_Big";
            arrMovingSprite = this.arrParentGems;
        } else if (this.type == "TICKET") {
            nameMovingSprite = "Ticket_Big";
            arrMovingSprite = this.arrParentTickets;
        } else if (this.type == "SUPPORT_ITEM") {
            nameMovingSprite = "Mic_Big";
            arrMovingSprite = this.arrParentMics;
        } else if (this.type == "HEART") {
            nameMovingSprite = "Heart_Big";
            arrMovingSprite = this.arrParentHearts;
        }
        //
        for (let i = 0; i < this.arrParentGems.length; i++) {
            let movingSprite = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 474 * window.GameConfig.RESIZE, nameAtlasSpriteBig, nameMovingSprite);
            movingSprite.scale.set(1);
            movingSprite.anchor.set(0.5);
            this.addChild(movingSprite);
            setTimeout(() => {
                let tweenScale = game.add.tween(movingSprite.scale).to({ x: 0.2, y: 0.2 }, 150, Phaser.Easing.Linear.In, false);
                tweenScale.start();
                let tween = game.add.tween(movingSprite).to({
                    x: [arrMovingSprite[i][0].x, arrMovingSprite[i][1].x, arrMovingSprite[i][2].x, arrMovingSprite[i][3].x],
                    y: [arrMovingSprite[i][0].y, arrMovingSprite[i][1].y, arrMovingSprite[i][2].y, arrMovingSprite[i][3].y],
                }, 750, Phaser.Easing.Linear.In, false, 0, 0).interpolation(function (v, k) {
                    return Phaser.Math.bezierInterpolation(v, k);
                });
                tween.start();
                tween.onComplete.add(() => {
                    movingSprite.destroy();
                });
            }, i * 100);
            setTimeout(() => {
                this.event.tweenDoneAll.dispatch();
                EventGame.instance().event.tweenAllClaimDailyQuestDone.dispatch();
            }, this.arrParentGems.length * 300);
        }
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