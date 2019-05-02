import TextBase from "../../component/TextBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import ControllScreen from "../../ControllScreen.js";
import ConfigScreenName from "../../../config/ConfigScreenName.js";
import ControllScreenDialog from "../../ControllScreenDialog.js";
import SocketController from "../../../controller/SocketController.js";

export default class LimitTurn extends Phaser.Button {
    constructor(scope) {
        super(game, 0, 0, 'limitTurn', () => { }, scope, null, 'BG_Opacity_limit_turn');
        this.limitTurnConfig = JSON.parse(game.cache.getText('limitTurnConfig'));
        this.afterInit();
    }

    afterInit() {
        this.addBg();
        this.addText();
        this.addBtnRemove();
        this.addBtnBecomeVip();
    }

    addBg() {
        this.bg = new Phaser.Sprite(game, 0, 0, 'limitTurn', 'BG_Opacity_limit_turn');
        this.bg.width = game.width;
        this.bg.height = game.height;
        this.addChild(this.bg);
    }

    addText() {
        if (SocketController.instance().dataMySeft.vip === true) {
            this.txt = new TextBase(this.limitTurnConfig.txt_limit_vip, this.limitTurnConfig.txt_limit_vip.text);
            this.txt.position.y = -300;
            this.txt.anchor.set(0.5);
            let txtWant = new TextBase(this.limitTurnConfig.txt_want, this.limitTurnConfig.txt_want.text);
            txtWant.anchor.set(0.5);
            this.txt.addChild(txtWant);
            this.addChild(this.txt);
            //
            let tweenTxt = game.add.tween(this.txt).to({ y: this.limitTurnConfig.txt_limit.y }, 1250, Phaser.Easing.Exponential.Out, false);
            tweenTxt.start();
        } else {
            this.txt = new TextBase(this.limitTurnConfig.txt_limit, this.limitTurnConfig.txt_limit.text);
            this.txt.position.y = -300;
            this.txt.anchor.set(0.5);
            let txtWant = new TextBase(this.limitTurnConfig.txt_want, this.limitTurnConfig.txt_want.text);
            txtWant.anchor.set(0.5);
            this.txt.addChild(txtWant);
            this.addChild(this.txt);
            //
            let tweenTxt = game.add.tween(this.txt).to({ y: this.limitTurnConfig.txt_limit.y }, 1250, Phaser.Easing.Exponential.Out, false);
            tweenTxt.start();
        }
    }

    addBtnRemove() {
        if (SocketController.instance().dataMySeft.vip === true) {
            this.btnRemove = new ButtonBase(this.limitTurnConfig.btn_delete_vip, this.onClickRemove, this);
            this.btnRemove.position.y = 1500;
            this.btnRemove.anchor.set(0.5);
            let txt = new TextBase(this.limitTurnConfig.btn_delete.txt, this.limitTurnConfig.btn_delete.txt.text);
            txt.anchor.set(0.5);
            this.btnRemove.addChild(txt);
            this.addChild(this.btnRemove);
            //
            let tweenBtnRemove = game.add.tween(this.btnRemove).to({ y: this.limitTurnConfig.btn_delete_vip.y }, 1250, Phaser.Easing.Exponential.Out, false);
            tweenBtnRemove.start();
        } else {
            this.btnRemove = new ButtonBase(this.limitTurnConfig.btn_delete, this.onClickRemove, this);
            this.btnRemove.position.x = -300;
            this.btnRemove.anchor.set(0.5);
            let txt = new TextBase(this.limitTurnConfig.btn_delete.txt, this.limitTurnConfig.btn_delete.txt.text);
            txt.anchor.set(0.5);
            this.btnRemove.addChild(txt);
            this.addChild(this.btnRemove);
            //
            let tweenBtnRemove = game.add.tween(this.btnRemove).to({ x: this.limitTurnConfig.btn_delete.x }, 1250, Phaser.Easing.Exponential.Out, false);
            tweenBtnRemove.start();
        }
    }
    onClickRemove() {
        ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        this.destroy();
    }

    addBtnBecomeVip() {
        if (SocketController.instance().dataMySeft.vip !== true) {
            this.btnBecomeVip = new ButtonBase(this.limitTurnConfig.btn_vip, this.onClickBecomeVip, this);
            this.btnBecomeVip.position.x = game.width + 300;
            this.btnBecomeVip.anchor.set(0.5);
            let txt = new TextBase(this.limitTurnConfig.btn_vip.txt, this.limitTurnConfig.btn_vip.txt.text);
            txt.anchor.set(0.5);
            this.btnBecomeVip.addChild(txt);
            this.addChild(this.btnBecomeVip);
            //
            let tweenBtnBecomeVip = game.add.tween(this.btnBecomeVip).to({ x: this.limitTurnConfig.btn_vip.x }, 1250, Phaser.Easing.Exponential.Out, false);
            tweenBtnBecomeVip.start();
        }
    }
    onClickBecomeVip() {
        // ControllScreen.instance().changeScreen(ConfigScreenName.MAIN_MENU);
        ControllScreenDialog.instance().addShop(3)
        this.destroy();
    }

    destroy() {
        super.destroy();
    }
}