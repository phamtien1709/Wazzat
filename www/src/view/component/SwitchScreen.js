export default class SwitchScreen {
    static instance() {
        if (this.switch) {

        } else {
            this.switch = new SwitchScreen();
        }
        return this.switch;
    }
    constructor() {
        this.tween1 = null;
        this.tween2 = null;
        this.timeTween = 200;
        this.ktComplete = false;
        this.event = {
            tweenComplete: new Phaser.Signal()
        }
    }

    beginSwitch(screenBefor, screenAfter, leftToRight, delay = 0) {

        let xAfter = 0;
        let xBefor = 0;
        this.removeAllTween();
        this.ktComplete = false;

        if (screenAfter !== null) {
            if (leftToRight) {
                screenAfter.x = -game.width;
            } else {
                screenAfter.x = game.width
            }
            this.tween2 = game.add.tween(screenAfter).to({
                x: xAfter
            }, this.timeTween, Phaser.Easing.Power1, true, delay);
            this.tween2.onComplete.add(this.onCompleteTween, this);
        }

        if (screenBefor !== null) {
            if (leftToRight) {
                xBefor = game.width;
            } else {
                xBefor = -game.width;
            }
            screenBefor.x = 0;

            this.tween1 = game.add.tween(screenBefor).to({
                x: xBefor
            }, this.timeTween, Phaser.Easing.Power1, true, delay);
            this.tween1.onComplete.add(this.onCompleteTween, this);
        }
    }

    onCompleteTween() {
        if (this.ktComplete === false) {
            this.ktComplete = true;
            this.event.tweenComplete.dispatch();
            this.removeAllTween();
        }
    }

    removeTween1() {
        if (this.tween1 !== null) {
            this.tween1.stop();
            game.tweens.remove(this.tween1);
            this.tween1 = null;
        }
    }
    removeTween2() {
        if (this.tween2 !== null) {
            this.tween2.stop();
            game.tweens.remove(this.tween2);
            this.tween2 = null;
        }
    }

    removeAllTween() {
        this.removeTween1();
        this.removeTween2();
    }
}