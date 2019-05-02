import BaseView from "../BaseView.js";
import TextBase from "./TextBase.js";
import MainData from "../../model/MainData.js";

export default class TextScroller extends BaseView {
    constructor(_content) {
        super(game, null);

        this.event = {
            complete: new Phaser.Signal()
        }
        this.timerToCountTime = null;
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000, 0.8);
        this.graphics.drawRect(0, 0, game.width, 60 * MainData.instance().scale);
        this.graphics.endFill();
        this.addChild(this.graphics);


        this.txtContent = new TextBase({
            x: 0,
            y: 0,
            style: {
                fontSize: 26 * MainData.instance().scale
            }
        }, _content);

        this.addChild(this.txtContent);
        this.txtContent.x = game.width;
        this.txtContent.y = 15;

        this.timerToCountTime = this.game.time.create(true);
        this.timerToCountTime.loop(20, this.onTimerToCountTime, this);
        this.timerToCountTime.start();
    }

    onTimerToCountTime() {
        this.txtContent.x -= 3;

        if (this.txtContent.x < -this.txtContent.width) {
            this.timerToCountTime.stop();
            this.event.complete.dispatch();
        }
    }

    destroyTime() {
        if (this.timerToCountTime !== null) {
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
        }
    }

    destroy() {
        this.graphics.clear();
        this.destroyTime();
        this.removeAllItem();
    }

}