import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnParty extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            goToParty: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.btn = new Phaser.Button(game, this.positionMenuConfig.btn_party.x * window.GameConfig.RESIZE, this.positionMenuConfig.btn_party.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_party.nameAtlas, () => { }, this, null, this.positionMenuConfig.btn_party.nameSprite);
        this.btn.anchor.set(0.5);
        this.btn.events.onInputUp.add(this.onClickPartyBtn, this);
        //txtBtn
        let txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_btn_party.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_btn_party.y * window.GameConfig.RESIZE, Language.instance().getData(212), this.positionMenuConfig.txt_btn_party.configs);
        txtBtn.anchor.set(0.5);
        this.btn.addChild(txtBtn);
        //anim
        let animBtn = new Phaser.Sprite(game, 0, -23 * window.GameConfig.RESIZE, 'PartyButton');
        animBtn.anchor.set(0.5);
        this.runAnim = animBtn.animations.add('run_anim');
        this.runAnim.onLoop.add(this.onAnimLooped, this);
        this.runAnim.play(30, true);
        this.btn.addChild(animBtn);
        //
        this.addChild(this.btn);
    }

    onClickPartyBtn() {
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.goToParty.dispatch();
    }

    startAnim() {
        this.runAnim.play(30, true);
    }

    setPosY(posY) {
        // this.btn.y = posY + 40;
        let tweenPos = game.add.tween(this.btn).to({ y: posY }, 150, "Linear", true);
        tweenPos.start();
    }
    setPosYDefault(posY) {
        // this.btn.y = posY - 40;
        let tweenPos = game.add.tween(this.btn).to({ y: posY }, 150, "Linear", true);
        tweenPos.start();
    }

    onAnimLooped(sprite, animation) {
        // LogConsole.log(animation.loopCount);
        if (animation.loopCount % 10 == 0) {
            // LogConsole.log('1');
            animation.stop();
        }
    }
}