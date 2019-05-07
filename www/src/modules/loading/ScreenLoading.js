import Girl from "./items/Girl.js";
import Star from "./items/Star.js";
import Bubble from "./items/Bubble.js";
import Arm from "./items/Arm.js";
import Head from "./items/Head.js";
import BaseGroup from "../../view/BaseGroup.js";

export default class ScreenLoading extends BaseGroup {
    constructor(yep = false) {
        super(game)
        this.positionBootConfig = JSON.parse(game.cache.getText('positionBootConfig'));
        this.STANDARD_HEIGHT = 1136;
        this.yep = yep;
        this.afterInit();
    }

    afterInit() {
        this.addStage();
        this.addRedGirl();
        this.addBlackGirl();
        this.addWhiteGirl();
        this.addStar();
        this.addBezierBubble();
        this.addBg();
        this.addHead();
        this.addArm();
    }

    addStage() {
        this.stage = new Phaser.Sprite(game, this.positionBootConfig.loadingScreen.stage.x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.stage.y), this.positionBootConfig.loadingScreen.stage.nameAtlas, this.positionBootConfig.loadingScreen.stage.nameSprite);
        this.stage.anchor.set(0.5, 1);
        this.addChild(this.stage);
    }

    addBg() {
        this.bg = new Phaser.Sprite(game, this.positionBootConfig.loadingScreen.bg.x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.bg.y), this.positionBootConfig.loadingScreen.bg.nameAtlas, this.positionBootConfig.loadingScreen.bg.nameSprite);
        this.bg.anchor.set(0.5, 1);
        this.addChild(this.bg);
    }

    addWhiteGirl() {
        this.whiteGirl = new Girl(this.positionBootConfig.loadingScreen.whiteGirl.x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.whiteGirl.y), this.positionBootConfig.loadingScreen.whiteGirl.nameSprite);
        this.addChild(this.whiteGirl);
    }

    addRedGirl() {
        if (this.yep == false) {
            this.redGirl = new Girl(game.width + 300, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.redGirl.y), this.positionBootConfig.loadingScreen.redGirl.nameSprite);
            this.redGirl.tweenPosX(this.positionBootConfig.loadingScreen.redGirl.x, 800);
            this.addChild(this.redGirl);
        } else {
            this.redGirl = new Girl(this.positionBootConfig.loadingScreen.redGirl.x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.redGirl.y), this.positionBootConfig.loadingScreen.redGirl.nameSprite);
            this.redGirl.tweenPosX(this.positionBootConfig.loadingScreen.redGirl.x, 800);
            this.addChild(this.redGirl);
        }
    }

    addBlackGirl() {
        if (this.yep == false) {
            this.blackGirl = new Girl(-300, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.blackGirl.y), this.positionBootConfig.loadingScreen.blackGirl.nameSprite);
            this.blackGirl.tweenPosX(this.positionBootConfig.loadingScreen.blackGirl.x, 700)
            this.addChild(this.blackGirl);
        } else {
            this.blackGirl = new Girl(this.positionBootConfig.loadingScreen.blackGirl.x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.blackGirl.y), this.positionBootConfig.loadingScreen.blackGirl.nameSprite);
            this.blackGirl.tweenPosX(this.positionBootConfig.loadingScreen.blackGirl.x, 700)
            this.addChild(this.blackGirl);
        }
    }

    addStar() {
        for (i = 0; i < this.positionBootConfig.loadingScreen.stars.length; i++) {
            let star = new Star(this.positionBootConfig.loadingScreen.stars[i].x, (game.height - this.STANDARD_HEIGHT + this.positionBootConfig.loadingScreen.stars[i].y));
            this.addChild(star);
        }
    }

    addBezierBubble() {
        var arrBubble = ['Circle', 'Circle_White'];
        for (let i = 0; i < 4; i++) {
            let sprite = arrBubble[Math.floor(Math.random() * arrBubble.length)];
            let bubble = new Bubble(sprite, i);
            this.addChild(bubble);
        }
    }

    addArm() {
        this.arm1 = new Arm(0, game.height - 1136 + 850, 'Arm_01', -10);
        this.addChild(this.arm1);
        this.arm2 = new Arm(80, game.height - 1136 + 940, 'Arm_02', 10);
        this.addChild(this.arm2);
        this.arm3 = new Arm(220, game.height - 1136 + 1000, 'Arm_03', -10);
        this.addChild(this.arm3);
        this.arm4 = new Arm(280, game.height - 1136 + 1035, 'Arm_04', 10);
        this.addChild(this.arm4);
        this.arm5 = new Arm(445, game.height - 1136 + 975, 'Arm_05', -10);
        this.addChild(this.arm5);
        this.arm6 = new Arm(475, game.height - 1136 + 880, 'Arm_06', 10);
        this.addChild(this.arm6);
        this.arm7 = new Arm(540, game.height - 1136 + 900, 'Arm_07', -10);
        this.addChild(this.arm7);
    }

    addHead() {
        this.head1 = new Head(-20, game.height - 1136 + 1080, 'Head_01', 0);
        this.addChild(this.head1);
        this.head2 = new Head(170, game.height - 1136 + 1150, 'Head_02', 5);
        this.addChild(this.head2);
        this.head3 = new Head(380, game.height - 1136 + 1135, 'Head_03', -5);
        this.addChild(this.head3);
        this.head4 = new Head(580, game.height - 1136 + 1120, 'Head_04', 3);
        this.addChild(this.head4);
        this.head5 = new Head(660, game.height - 1136 + 1080, 'Head_05', 6);
        this.addChild(this.head5);
    }

    destroy() {
        // game.time.removeAll();
        if (this.children !== null) {
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
        super.destroy();
    }
}