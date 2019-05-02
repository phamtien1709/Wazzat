import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnRanking extends BaseGroup {
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
        // this.addAnimCircleScale();
        //
        this.addAnimButtonInOut();
        this.runAnim();
    }

    addBtn() {
        this.btn = new Phaser.Sprite(game, this.positionMenuConfig.btnRanking.x * window.GameConfig.RESIZE, this.positionMenuConfig.btnRanking.y * window.GameConfig.RESIZE, this.positionMenuConfig.btnRanking.nameAtlas, this.positionMenuConfig.btnRanking.nameSprite);
        this.btn.inputEnabled = true;
        this.btn.anchor.set(0.5);
        this.txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_rank.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_rank.y * window.GameConfig.RESIZE, Language.instance().getData(207), this.positionMenuConfig.txt_rank.configs);
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
        this.animButtonInOut = new Phaser.Sprite(game, 0, 0, 'ButtonRank');
        this.animButtonInOut.anchor.set(0.5);
        this.btn.addChild(this.animButtonInOut);
    }

    scrollChange() {
        this.txtBtn.kill();
        // this.x = this.positionMenuConfig.btnRanking.x * window.GameConfig.RESIZE - 115;
        // this.btn.y = 65;
        let tweenBtnX = game.add.tween(this.btn).to({ x: this.positionMenuConfig.btnRanking.x * window.GameConfig.RESIZE - 115 }, 70, "Linear", true);
        let tweenBtnY = game.add.tween(this.btn).to({ y: 65 }, 150, "Linear", true);
        tweenBtnY.start();
        tweenBtnX.start();
    }

    scrollDefault() {
        this.txtBtn.revive();
        // this.x = this.positionMenuConfig.btnRanking.x;
        // this.btn.y = this.positionMenuConfig.btnRanking.y * window.GameConfig.RESIZE;
        let tweenBtnX = game.add.tween(this.btn).to({ x: this.positionMenuConfig.btnRanking.x * window.GameConfig.RESIZE }, 150, "Linear", true);
        let tweenBtnY = game.add.tween(this.btn).to({ y: this.positionMenuConfig.btnRanking.y * window.GameConfig.RESIZE }, 70, "Linear", true);
        tweenBtnY.start();
        tweenBtnX.start();
    }

    runAnim() {
        let runAnimBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 25, true);
        // let runAnimCircle = this.animCircleScale.animations.add('run_scale_circle');
        // this.animCircleScale.animations.play('run_scale_circle', 30, true);
    }
}