import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnQuest extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        // this.inputEnabled = true;
        this.outSize = true;
        this.afterInit();
    }

    afterInit() {
        this.btn;
        this.animCircleScale;
        this.animButtonInOut;
        this.addBtn();
        this.addAnimButtonInOut();
        // this.addAnimCircleScale();
        // this.runAnim();
        //
    }

    addBtn() {
        this.btn = new Phaser.Sprite(game, this.positionMenuConfig.btnQAndA.x * window.GameConfig.RESIZE, this.positionMenuConfig.btnQAndA.y * window.GameConfig.RESIZE, this.positionMenuConfig.btnQAndA.nameAtlas, this.positionMenuConfig.btnQAndA.nameSprite);
        this.btn.inputEnabled = true;
        this.btn.anchor.set(0.5);
        this.txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_QAndA.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_QAndA.y * window.GameConfig.RESIZE, Language.instance().getData(205), this.positionMenuConfig.txt_QAndA.configs);
        this.txtBtn.anchor.set(0.5);
        this.btn.addChild(this.txtBtn);
        this.addChild(this.btn);
    }

    addAnimCircleScale() {
        this.animCircleScale = new Phaser.Sprite(game, 0, 0, 'CircleScale');
        this.animCircleScale.anchor.set(0.5);
        this.btn.addChild(this.animCircleScale);
    }

    addAnimButtonInOut() {
        this.animButtonInOut = new Phaser.Sprite(game, 0, 0, 'ButtonQuest');
        this.animButtonInOut.anchor.set(0.5);
        this.btn.addChild(this.animButtonInOut);
    }

    addAnim() {
        let runAnimCircle = this.animCircleScale.animations.add('run_scale_circle');
        this.animCircleScale.animations.play('run_scale_circle', 30, true);
        let runAnimQuestBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 15, true);
    }

    runAnim() {
        let runAnimBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 25, true);
    }

    scrollChange() {
        this.txtBtn.kill();
        let tweenBtnX = game.add.tween(this.btn).to({ x: this.positionMenuConfig.btnQAndA.x * window.GameConfig.RESIZE + 115 }, 70, "Linear", true);
        let tweenBtnY = game.add.tween(this.btn).to({ y: 65 }, 150, "Linear", true);
        tweenBtnY.start();
        tweenBtnX.start();
    }

    scrollDefault() {
        this.txtBtn.revive();
        let tweenBtnX = game.add.tween(this.btn).to({ x: this.positionMenuConfig.btnQAndA.x * window.GameConfig.RESIZE }, 150, "Linear", true);
        let tweenBtnY = game.add.tween(this.btn).to({ y: this.positionMenuConfig.btnQAndA.y * window.GameConfig.RESIZE }, 70, "Linear", true);
        tweenBtnY.start();
        tweenBtnX.start();
    }

    addDotNoti(num) {
        if (num > 0) {
            this.runAnim();
            let noti = new Phaser.Sprite(game, this.positionMenuConfig.notiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.y * window.GameConfig.RESIZE, this.positionMenuConfig.notiDot.nameAtlas, this.positionMenuConfig.notiDot.nameSprite);
            let number = new Phaser.Text(game, this.positionMenuConfig.txtNotiDot.x * window.GameConfig.RESIZE, this.positionMenuConfig.txtNotiDot.y * window.GameConfig.RESIZE, num, this.positionMenuConfig.txtNotiDot.configs);
            number.anchor.set(0.5);
            noti.addChild(number);
            this.btn.addChild(noti);
        }
    }
}