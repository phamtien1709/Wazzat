import MailScreen from "./Mail/MailScreen.js";

export default class MailModule extends Phaser.Sprite {
    constructor(x, y, typeBefore) {
        super(game, x, y, null);
        this.type = 2;
        if (typeBefore) this.typeBefore = typeBefore;
        if (this.type > this.typeBefore) {
            this.x = game.width;
        } else {
            this.x = -game.width;
        }
        this.positionMenuConfig = JSON.parse(game.cache.getText('positionMenuConfig'));
        this.afterInit();
    }

    afterInit() {
        // this.createMail();
    }

    createMail() {
        this.mailScreen = new MailScreen();
        this.addChild(this.mailScreen);
    }

    show() {
        game.add.tween(this).to({
            x: 0
        }, 150, "Linear", true);
    }

    hide(typeOld) {
        if (this.type > typeOld) {
            let tween = game.add.tween(this).to({
                x: game.width
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        } else {
            let tween = game.add.tween(this).to({
                x: -game.width - 300
            }, 150, "Linear", true);
            tween.start();
            tween.onComplete.add(() => {
                this.destroy();
            }, this);
        }
    }
}