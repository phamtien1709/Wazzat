import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnEvent extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.inputEnabled = true;
        this.outSize = true;
        this.event = {
            gotToEvent: new Phaser.Signal()
        }
        this.isEvent = false;
        this.afterInit();
    }

    afterInit() {
        this.btn;
        this.animCircleScale;
        this.animButtonInOut;
        this.addBtn();
        this.addAnimCircleScale();
        //
        this.addAnimButtonInOut();
        // this.runAnim();
    }

    addBtn() {
        this.btn = new Phaser.Sprite(game, this.positionMenuConfig.btnEvent.x * window.GameConfig.RESIZE, this.positionMenuConfig.btnEvent.y * window.GameConfig.RESIZE, this.positionMenuConfig.btnEvent.nameAtlas, this.positionMenuConfig.btnEvent.nameSprite);
        this.btn.anchor.set(0.5);
        this.btn.inputEnabled = true;
        this.btn.events.onInputUp.add(this.onClickBtn, this);
        this.txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_event.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_event.y * window.GameConfig.RESIZE, Language.instance().getData(206), this.positionMenuConfig.txt_event.configs);
        this.txtBtn.anchor.set(0.5);
        this.btn.addChild(this.txtBtn);
        this.addChild(this.btn);
    }
    onClickBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.gotToEvent.dispatch();
    }

    addAnimCircleScale() {
        this.animCircleScale = new Phaser.Sprite(game, 0, 0, 'CircleScale');
        this.animCircleScale.anchor.set(0.5);
        this.btn.addChild(this.animCircleScale);
    }

    addAnimButtonInOut() {
        this.animButtonInOut = new Phaser.Sprite(game, 0, 0, 'ButtonEvent');
        this.animButtonInOut.anchor.set(0.5);
        this.btn.addChild(this.animButtonInOut);
    }

    runAnim() {
        this.isEvent = true;
        let runAnimBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 25, true);
        let runAnimCircle = this.animCircleScale.animations.add('run_scale_circle');
        this.animCircleScale.animations.play('run_scale_circle', 30, true);
    }

    scrollChange() {
        this.txtBtn.kill();
        // this.btn.y = 65;
        let tweenBtn = game.add.tween(this.btn).to({ y: 65 }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isEvent == true) {
            this.animCircleScale.animations.stop('run_scale_circle', true);
        }
    }

    scrollDefault() {
        this.txtBtn.revive();
        // this.btn.y = this.positionMenuConfig.btnEvent.y * window.GameConfig.RESIZE;
        let tweenBtn = game.add.tween(this.btn).to({ y: this.positionMenuConfig.btnEvent.y * window.GameConfig.RESIZE }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isEvent == true) {
            this.animCircleScale.animations.play('run_scale_circle', 30, true);
        }
    }

    addDotNoti(num) {
        // if (this.isHasQuestInit) {
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