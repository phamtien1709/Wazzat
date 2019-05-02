import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnPractice extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            onClickPractice: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.btn = new Phaser.Button(game, this.positionMenuConfig.btn_practice.x * window.GameConfig.RESIZE, this.positionMenuConfig.btn_practice.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_practice.nameAtlas, () => { }, this, null, this.positionMenuConfig.btn_practice.nameSprite);
        this.btn.anchor.set(0.5);
        this.btn.events.onInputUp.add(this.onClickPracticeBtn, this);
        //txtBtn
        let txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_btn_practice.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_btn_practice.y * window.GameConfig.RESIZE, Language.instance().getData(213), this.positionMenuConfig.txt_btn_practice.configs);
        txtBtn.anchor.set(0.5);
        this.btn.addChild(txtBtn);
        //anim
        let animBtn = new Phaser.Sprite(game, 0, -23 * window.GameConfig.RESIZE, 'PracticeButton');
        animBtn.anchor.set(0.5);
        this.runAnim = animBtn.animations.add('run_anim');
        this.runAnim.onLoop.add(this.onAnimLooped, this);
        this.runAnim.play(30, true);
        this.btn.addChild(animBtn);
        //
        this.addChild(this.btn);
    }

    onClickPracticeBtn() {
        //
        FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Solo_mode_button);
        //
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
        this.event.onClickPractice.dispatch();
        // this.sendSoloModePlaylistsRequest();
    }

    startAnim() {
        this.runAnim.play(30, true);
    }

    onAnimLooped(sprite, animation) {
        // LogConsole.log(animation.loopCount);
        if (animation.loopCount % 13 == 0) {
            // LogConsole.log('1');
            animation.stop();
        }
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


    sendSoloModePlaylistsRequest() {
        SocketController.instance().sendData(DataCommand.SOLO_MODE_PLAYLISTS_REQUEST, null);
    }
}

