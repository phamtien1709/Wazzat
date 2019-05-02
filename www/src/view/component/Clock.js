import BaseView from "../BaseView.js";

export default class Clock extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.eventCompleteTime = new Phaser.Signal();

        this.timerToCountTime = null;

        this.bg = new Phaser.Image(game, 0, 0, null);
        this.bg.x = 0;
        this.bg.y = 0;
        this.addChild(this.bg);

        this.style = {
            font: '40px Arial',
            fill: "white"
        };

        this.txtClock = new Phaser.Text(game, 0, 0, "", this.style);
        this.txtClock.x = 0;
        this.txtClock.y = 0;
        this.addChild(this.txtClock);
    }

    addEventCompleteTime(callback, scope) {
        this.eventCompleteTime.add(callback, scope);
    }
    addEventCompleteTime(callback, scope) {
        this.eventCompleteTime.remove(callback, scope);
    }
    dispatchEventCompleteTime() {
        this.eventCompleteTime.dispatch();
    }


    setTextTimer() {
        let strTime = "00";
        let time = parseInt(this.countNumber / 10);
        if (time < 10) {
            strTime = "0" + time;
        } else {
            strTime = time;
        }

        this.txtClock.text = strTime;
    }

    countTimer(timeNumber) {
        this.countNumber = timeNumber * 10;
        this.setTextTimer();
        this.stopCountTime();
        this.timerToCountTime = this.game.time.create(true);
        this.timerToCountTime.loop(100, this.onTimerToCountTime, this);
        this.timerToCountTime.start();
    }

    onTimerToCountTime() {
        this.countNumber--;
        if (this.countNumber < 0) {
            this.countNumber = 0;
        }
        if (this.countNumber === 0) {
            this.dispatchEventCompleteTime();
            this.stopCountTime()
        }
        this.setTextTimer();
    }

    getTime() {
        return this.countNumber / 10;
    }

    stopCountTime() {
        if (this.timerToCountTime !== null) {
            this.timerToCountTime.stop();
            this.timerToCountTime.destroy();
            this.timerToCountTime = null;
        }
    }

    destroy() {
        this.txtClock.destroy();
        if (this.timerToCountTime) {
            this.timerToCountTime.destroy();
        }
    }
}