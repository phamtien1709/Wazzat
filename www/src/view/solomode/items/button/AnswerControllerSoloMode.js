import BaseGroup from "../../../BaseGroup.js";

export default class AnswerControllerSoloMode extends BaseGroup {
    constructor(x, y, configs) {
        super(game);
        this.posX = x;
        this.positionPracticeScreenConfig = JSON.parse(game.cache.getText('positionPracticeScreenConfig'));
        this.sprite = new Phaser.Button(game, x + 1080 * window.GameConfig.RESIZE, y, this.positionPracticeScreenConfig.answer_tab.nameAtlas, this.onClickAnswer, this, null, this.positionPracticeScreenConfig.answer_tab.nameSprite);
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
        this.configs = configs;
        this.addChild(this.sprite);
        this.event = {
            chooseAnswer: new Phaser.Signal()
        }
        this.afterInit();
    }

    afterInit() {
        this.answerText = new Phaser.Text(game, 0, 0, `${this.configs.answer}`, {
            font: `GilroyMedium`,
            fill: "#000000",
            align: "center",
            fontSize: 28,
            boundsAlignH: "center",
            boundsAlignV: "middle",
            wordWrap: true,
            wordWrapWidth: 500
        });
        this.answerText.anchor.set(0.5);
        this.sprite.addChild(this.answerText);
        this.answer = this.configs.value;
        setTimeout(() => {
            let tween = game.add.tween(this.sprite).to({ x: this.posX }, 450, Phaser.Easing.Back.Out, false);
            tween.start();
        }, (this.configs.value - 1) * 70);
    }

    onClickAnswer() {
        this.event.chooseAnswer.dispatch(this.configs);
    }

    displayScreenWhenAnswerRight() {
        this.answerText.addColor('#01c66a', 0);
    }

    displayScreenWhenAnswerWrong() {
        this.answerText.addColor('#ff0000', 0);
    }

    displayScreenWhenAnswerNotChoosed() {
        this.sprite.alpha = 0.5;
    }
}