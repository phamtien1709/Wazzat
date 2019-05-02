import DataCommand from "../../../common/DataCommand.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import FaceBookCheckingTools from "../../../FaceBookCheckingTools.js";
import SocketController from "../../../controller/SocketController.js";
import Language from "../../../model/Language.js";
import BaseGroup from "../../BaseGroup.js";

export default class MenuBtnFindGame extends BaseGroup {
    constructor() {
        super(game);
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.event = {
            onClickFindGame: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.btn = new Phaser.Button(game, this.positionMenuConfig.btn_findgame.x * window.GameConfig.RESIZE, this.positionMenuConfig.btn_findgame.y * window.GameConfig.RESIZE, this.positionMenuConfig.btn_findgame.nameAtlas, () => { }, this, null, this.positionMenuConfig.btn_findgame.nameSprite
        );
        this.btn.anchor.set(0.5);
        this.btn.events.onInputUp.add(() => {
            ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
            this.event.onClickFindGame.dispatch();
            //
            FaceBookCheckingTools.instance().logEvent(FaceBookCheckingTools.Find_Game_turnbase_mode_button);
        }, this);
        //txtBtn
        let txtBtn = new Phaser.Text(game, this.positionMenuConfig.txt_btn_findgame.x * window.GameConfig.RESIZE, this.positionMenuConfig.txt_btn_findgame.y * window.GameConfig.RESIZE, Language.instance().getData(211), this.positionMenuConfig.txt_btn_findgame.configs);
        txtBtn.anchor.set(0.5);
        this.btn.addChild(txtBtn);
        //anim
        let animBtn = new Phaser.Sprite(game, 0, -23 * window.GameConfig.RESIZE, 'FindGameButton');
        animBtn.anchor.set(0.5);
        this.runAnim = animBtn.animations.add('run_anim');
        this.runAnim.onLoop.add(this.onAnimLooped, this);
        this.runAnim.play(30, true);
        this.btn.addChild(animBtn);
        //
        this.addChild(this.btn);
    }

    startAnim() {
        this.runAnim.play(30, true);
    }

    onAnimLooped(sprite, animation) {
        if (animation.loopCount % 10 == 0) {
            animation.stop();
        }
    }

    setPosY(posY) {
        let tweenPos = game.add.tween(this.btn).to({ y: posY }, 150, "Linear", true);
        tweenPos.start();
    }
    setPosYDefault(posY) {
        let tweenPos = game.add.tween(this.btn).to({ y: posY }, 150, "Linear", true);
        tweenPos.start();
    }

    sendRequestFindGame() {
        SocketController.instance().sendData(DataCommand.CHALLENGE_GAME_FIND_OPPONENTS_REQUEST, null);
    }
}