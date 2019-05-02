import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnShop extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            goToShop: new Phaser.Signal(),
            refreshMenu: new Phaser.Signal()
        }
        this.inputEnabled = true;
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
        this.btn = new Phaser.Sprite(game, this.positionMenuConfig.btnShop.x * window.GameConfig.RESIZE, this.positionMenuConfig.btnShop.y * window.GameConfig.RESIZE, this.positionMenuConfig.btnShop.nameAtlas, this.positionMenuConfig.btnShop.nameSprite);
        this.btn.anchor.set(0.5);
        this.btn.inputEnabled = true;
        this.btn.events.onInputUp.add(this.onClickBtn, this);
        //
        this.txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_shop.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_shop.y * window.GameConfig.RESIZE, Language.instance().getData(204), this.positionMenuConfig.txt_shop.configs);
        this.txtBtn.anchor.set(0.5);
        this.btn.addChild(this.txtBtn);
        this.addChild(this.btn);
    }

    onClickBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        // this.btn.inputEnabled = false;
        this.event.goToShop.dispatch();
    }

    addAnimCircleScale() {
        this.animCircleScale = new Phaser.Sprite(game, 0, 0, 'CircleScale');
        this.animCircleScale.anchor.set(0.5);
        this.btn.addChild(this.animCircleScale);
    }

    addAnimButtonInOut() {
        this.animButtonInOut = new Phaser.Sprite(game, 0, 0, 'ButtonShop');
        this.animButtonInOut.anchor.set(0.5);
        this.btn.addChild(this.animButtonInOut);
    }

    runAnim() {
        let runAnimBtn = this.animButtonInOut.animations.add('run_anim_button');
        this.animButtonInOut.animations.play('run_anim_button', 25, true);
        // let runAnimCircle = this.animCircleScale.animations.add('run_scale_circle');
        // this.animCircleScale.animations.play('run_scale_circle', 30, true);
    }
    //
    addEventExtension() {
        SocketController.instance().addEventExtension(this.onExtensionResponse, this);
    }
    removeEventExtension() {
        SocketController.instance().removeEventExtension(this.onExtensionResponse, this);
    }

    onExtensionResponse(evtParams) {

    }

    scrollChange() {
        this.txtBtn.kill();
        let tweenBtn = game.add.tween(this.btn).to({ y: 65 }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isGift == true) {
            this.animCircleScale.animations.stop('run_scale_circle', true);
        }
    }

    scrollDefault() {
        this.txtBtn.revive();
        let tweenBtn = game.add.tween(this.btn).to({ y: this.positionMenuConfig.btnGift.y * window.GameConfig.RESIZE }, 150, "Linear", true);
        tweenBtn.start();
        if (this.isGift == true) {
            this.animCircleScale.animations.play('run_scale_circle', 30, true);
        }
    }

    destroy() {
        this.removeEventExtension();
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