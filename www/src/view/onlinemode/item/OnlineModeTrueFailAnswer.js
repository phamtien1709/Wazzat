import BaseView from "../../BaseView.js";

export default class OnlineModeTrueFailAnswer extends BaseView {
    constructor() {
        super(game, null);

        this.trueAnswer = new Phaser.Sprite(game, 0, 0, "trueanswer");
        let animTrueAnswer = this.trueAnswer.animations.add('trueanswer');
        animTrueAnswer.onComplete.add(this.animTrueAnswerComplete, this);
        this.trueAnswer.visible = false;
        this.addChild(this.trueAnswer);

        this.failAnswer = new Phaser.Sprite(game, 0, 0, "failanswer");
        let animFailAnswer = this.failAnswer.animations.add('failanswer');
        animFailAnswer.onComplete.add(this.animFailAnswerComplete, this);
        this.failAnswer.visible = false;
        this.addChild(this.failAnswer);
    }

    setSize(_width, _height) {
        this.trueAnswer.width = _width;
        this.trueAnswer.height = _height;

        this.failAnswer.width = _width;
        this.failAnswer.height = _height;
    }

    animTrueAnswerComplete() {
        this.trueAnswer.visible = false;
    }
    animFailAnswerComplete() {
        this.failAnswer.visible = false;
    }

    setTrueAnswer() {
        this.trueAnswer.visible = true;
        this.trueAnswer.animations.play('trueanswer', 20, false);
    }

    setFailtAnswer() {
        this.failAnswer.visible = true;
        this.failAnswer.animations.play('failanswer', 20, false);
    }

    destroy() {
        this.failAnswer.destroy();
        this.trueAnswer.destroy();
        super.destroy();
    }
}