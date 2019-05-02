import ControllSoundFx from "../../controller/ControllSoundFx.js";
import BaseGroup from "../BaseGroup.js";

export default class SoloModeDiamondRewardMoveToTop extends BaseGroup {
    constructor(reward) {
        super(game);
        this.event = {
            tweenGemPls: new Phaser.Signal()
        };
        this.reward = reward;
        this.definedPosition();
        this.afterInit();
    }

    definedPosition() {
        this.pointsArrayGem1 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 361 * window.GameConfig.RESIZE
        }, {
            x: 379 * window.GameConfig.RESIZE,
            y: 240 * window.GameConfig.RESIZE
        }, {
            x: 619 * window.GameConfig.RESIZE,
            y: 192 * window.GameConfig.RESIZE
        }, {
            x: 443 * window.GameConfig.RESIZE,
            y: 101 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem2 = [{
            x: 520 * window.GameConfig.RESIZE,
            y: 361 * window.GameConfig.RESIZE
        }, {
            x: 480 * window.GameConfig.RESIZE,
            y: 432 * window.GameConfig.RESIZE
        }, {
            x: 321 * window.GameConfig.RESIZE,
            y: 352 * window.GameConfig.RESIZE
        }, {
            x: 443 * window.GameConfig.RESIZE,
            y: 101 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem3 = [{
            x: 560 * window.GameConfig.RESIZE,
            y: 361 * window.GameConfig.RESIZE
        }, {
            x: 818 * window.GameConfig.RESIZE,
            y: 343 * window.GameConfig.RESIZE
        }, {
            x: 321 * window.GameConfig.RESIZE,
            y: 352 * window.GameConfig.RESIZE
        }, {
            x: 443 * window.GameConfig.RESIZE,
            y: 101 * window.GameConfig.RESIZE
        }];
        this.pointsArrayGem4 = [{
            x: 320 * window.GameConfig.RESIZE,
            y: 361 * window.GameConfig.RESIZE
        }, {
            x: 377 * window.GameConfig.RESIZE,
            y: 558 * window.GameConfig.RESIZE
        }, {
            x: 83 * window.GameConfig.RESIZE,
            y: 395 * window.GameConfig.RESIZE
        }, {
            x: 443 * window.GameConfig.RESIZE,
            y: 101 * window.GameConfig.RESIZE
        }];
        this.arrParentGems = [this.pointsArrayGem1, this.pointsArrayGem2, this.pointsArrayGem3, this.pointsArrayGem4];
    }

    afterInit() {
        if (this.reward !== 0) {
            this.addIconGem();
        }
    }

    addIconGem() {
        ControllSoundFx.instance().playSound(ControllSoundFx.takereward);
        this.gem_big = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 375 * window.GameConfig.RESIZE, 'otherSprites', 'Gem_Big');
        this.gem_big.anchor.set(0.5);
        this.gem_big.scale.set(0.3);
        this.txtReward = new Phaser.Text(game, 320 * window.GameConfig.RESIZE, 210 * window.GameConfig.RESIZE, `+${this.reward}`, {
            "font": "GilroyBold",
            "fill": "#ffffff",
            "align": "center",
            "fontSize": 30
        });
        this.txtReward.anchor.set(0.5);
        this.addChild(this.txtReward);
        let scaleTween = game.add.tween(this.gem_big.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.In, false);
        scaleTween.start();
        let tweenParent = game.add.tween(this.gem_big).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.In, false);
        tweenParent.start();
        let rotate = 0.1;
        tweenParent.onUpdateCallback(() => {
            this.gem_big.rotation += rotate;
            if (this.gem_big.rotation > 0.2) {
                rotate = -0.07;
            } else if (this.gem_big.rotation < -0.2) {
                rotate = 0.07;
            }
        }, this);
        tweenParent.onComplete.add(() => {
            this.gem_big.rotation = 0;
            let scaleGemBigAgain = game.add.tween(this.gem_big.scale).to({ x: 0.5, y: 0.5 }, 300, Phaser.Easing.Linear.In, false);
            scaleGemBigAgain.start();
            scaleGemBigAgain.onComplete.add(() => {
                this.gem_big.destroy();
            }, this);
            let objDiamond = {
                diamond: parseInt(this.txtReward.text)
            }
            let tweenText = game.add.tween(objDiamond).to({ diamond: 0 }, 600, "Linear", false);
            tweenText.start();
            tweenText.onUpdateCallback(() => {
                this.txtReward.text = "+" + parseInt(objDiamond.diamond);
            }, this)
            tweenText.onComplete.add(() => {
                this.event.tweenGemPls.dispatch();
                this.txtReward.destroy();
            }, this);
            this.addGemMoveCurve();
        }, this);
        this.addStarNim();
        this.addChild(this.gem_big);
    }
    addStarNim() {
        let starNim = new Phaser.Sprite(game, 0, 0, 'SoloModeStar');
        starNim.anchor.set(0.5);
        starNim.scale.set(1.5);
        var runStarNim = starNim.animations.add('run_star');
        starNim.animations.play('run_star', 30, true);
        this.gem_big.addChild(starNim);
    }
    addGemMoveCurve() {
        for (let i = 0; i < this.arrParentGems.length; i++) {
            let movingSprite = new Phaser.Sprite(game, 320 * window.GameConfig.RESIZE, 361 * window.GameConfig.RESIZE, "practicePopupSprites", "GEM");
            movingSprite.scale.set(2);
            movingSprite.anchor.set(0.5);
            this.addChild(movingSprite);
            setTimeout(() => {
                let tweenScale = game.add.tween(movingSprite.scale).to({ x: 1, y: 1 }, 800, Phaser.Easing.Linear.In, false);
                tweenScale.start();
                let tween = game.add.tween(movingSprite).to({
                    x: [320 * window.GameConfig.RESIZE, this.arrParentGems[i][1].x, this.arrParentGems[i][2].x, 235 * window.GameConfig.RESIZE],
                    y: [361 * window.GameConfig.RESIZE, this.arrParentGems[i][1].y, this.arrParentGems[i][2].y, 65 * window.GameConfig.RESIZE],
                }, 800, Phaser.Easing.Linear.In, false, 0, 0).interpolation(function (v, k) {
                    return Phaser.Math.bezierInterpolation(v, k);
                });
                tween.start();
                tween.onComplete.add(() => {
                    movingSprite.destroy();
                });
            }, i * 100);
        }
    }
}