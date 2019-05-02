import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeClockItem extends BaseView {
    constructor() {
        super(game, null);
        this.countNumber = 0;
        this.timerToCountTime = null;

        this.event = {
            complete: new Phaser.Signal()
        }
        this.ktRed = false;
        this.ktPlayTween = false;

        this.positionEventMode = MainData.instance().positionEventMode;

        this.clock = new SpriteBase(this.positionEventMode.selectroom_icon_clock);
        this.addChild(this.clock);

        this.txtCount = new TextBase(this.positionEventMode.selectroom_text_time_clock, "");
        this.txtCount.setTextBounds(0, 0, 77 * MainData.instance().scale, 24 * MainData.instance().scale);
        this.addChild(this.txtCount);
    }

    setTimer(finish_at) {

        let currentdate = new Date();
        let timestamp = currentdate.getTime();
        let countTimeEvent = finish_at - timestamp;

        this.countNumber = parseInt(countTimeEvent / 1000);

        this.setTextTimer();

        this.stopCountTime();

        this.timerToCountTime = this.game.time.create(true);
        this.timerToCountTime.loop(1000, this.onTimerToCountTime, this);
        this.timerToCountTime.start();
    }

    setTextTimer() {
        let strTime = "";

        let strH = ""
        let strM = "";
        let strS = "";

        let timeH = parseInt(this.countNumber / 3600);
        let timeM = 0;
        let timeS = 0;

        if (timeH > 0) {
            if (timeH > 9) {
                strH = timeH + ":";
            } else {
                strH = "0" + timeH + ":";
            }
            timeM = parseInt((this.countNumber % 3600) / 60);
            timeS = this.countNumber - (timeH * 3600 + timeM * 60);
        } else {
            timeM = parseInt(this.countNumber / 60);
            timeS = this.countNumber % 60;
        }

        if (timeM > 9) {
            strM = timeM + ":";
        } else {
            strM = "0" + timeM + ":";
        }

        if (timeS > 9) {
            strS = timeS + "";
        } else {
            strS = "0" + timeS;
        }

        strTime = strH + strM + strS

        if (timeH === 0 && timeM < 5) {
            //if (timeH < 30) {
            if (this.ktPlayTween === false) {
                this.ktPlayTween = true;
            }
        } else {
            if (this.ktPlayTween === true) {
                this.ktPlayTween = false;
            }
        }

        this.txtCount.text = strTime;
    }

    onTimerToCountTime() {
        this.countNumber--;
        if (this.countNumber < 0) {
            this.countNumber = 0;
        }
        if (this.countNumber === 0) {
            this.stopCountTime();
            this.event.complete.dispatch();
        }

        LogConsole.log("this.ktPlayTween : " + this.ktPlayTween + " this.ktRed : " + this.ktRed);

        if (this.ktPlayTween === true) {
            if (this.ktRed === false) {
                this.ktRed = true;
                this.clock.tint = 0xFF0000;
            } else {
                this.ktRed = false;
                this.clock.tint = 0xffffff;
            }
        }

        this.setTextTimer();
    }

    getTime() {
        return this.countNumber;
    }

    stopCountTime() {
        if (this.timerToCountTime !== null) {
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
            this.timerToCountTime = null;
        }
    }

    destroy() {
        this.stopCountTime();
        this.removeAllItem();
        super.destroy();
    }
}