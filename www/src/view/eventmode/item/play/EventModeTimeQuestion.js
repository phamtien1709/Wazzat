import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeTimeQuestion extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            complete: new Phaser.Signal()
        }
        this.tweenSpriteTime = null;
        this.positionEventMode = MainData.instance().positionEventMode;
        this.loading = new SpriteBase(this.positionEventMode.playroom_loading_time_question);
        this.loading.width = 0;
        this.addChild(this.loading);
    }

    addTween() {
        this.loading.width = 0;
        this.stopTween();
        this.tweenSpriteTime = game.add.tween(this.loading).to({
            width: 570 * MainData.instance().scale
        }, 10000, "Linear");
        this.tweenSpriteTime.onComplete.add(this.onComplete, this);
        this.tweenSpriteTime.start();
    }

    onComplete() {
        this.event.complete.dispatch();
    }

    getTime() {
        console.log("getTime----------");
        console.log(this.tweenSpriteTime);
        console.log(this.tweenSpriteTime.timeline[0].dt)
        if (this.tweenSpriteTime !== null) {
            return (this.tweenSpriteTime.timeline[0].dt / 1000);
        } else {
            return 0;
        }
    }

    stopTween() {
        if (this.tweenSpriteTime !== null) {
            this.tweenSpriteTime.stop();
            this.tweenSpriteTime.onComplete.remove(this.onComplete, this);
        }
    }
}