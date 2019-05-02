import BaseGroup from "../../../BaseGroup.js";

export default class AnswerPlayController extends BaseGroup {
    constructor(x, y, configs) {
        super(game);
        this.posX = x;
        this.positionPlayConfig = JSON.parse(game.cache.getText('positionPlayConfig'));
        this.sprite = new Phaser.Button(game, (x + 640), y, this.positionPlayConfig.answer_tab.nameAtlas, () => { }, this, null, this.positionPlayConfig.answer_tab.nameSprite);
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
        this.sprite.update = this.update.bind(this);
        this.sprite.inputEnabled = true;
        this.configs = configs;
        this.choosed = false;
        this.addChild(this.sprite);
        this.event = {
            answer: new Phaser.Signal()
        }
        this.addTextToTabAnswer();
        this.sprite.events.onInputDown.add(() => {
            this.choosed = true;
            this.event.answer.dispatch(this.configs.index);
        }
        );
        this.addTweenSprite();
    }

    addTweenSprite() {
        setTimeout(() => {
            let tweenBox = game.add.tween(this.sprite).to({ x: this.posX }, 300, Phaser.Easing.Power1, false);
            tweenBox.start();
        }, (this.configs.index + 1) * 200);
    }

    update() {
        // LogConsole.log('fdshfsdfsd');
    }

    displayScreenWhenAnswerRight() {
        this.sprite.inputEnabled = false;
        this.answerText.addColor('#01c66a', 0);
    }

    displayScreenWhenAnswerWrong() {
        this.sprite.inputEnabled = false;
        this.answerText.addColor('#ff0000', 0);
    }

    displayScreenWhenAnswerNotChoosed() {
        this.answerText.addColor("#ffffff", 0);
        this.sprite.inputEnabled = false;
        this.sprite.alpha = 0.15;
    }

    addTextToTabAnswer() {
        // console.log('addTextToTabAnswer');
        // console.log(this.configs.questions);
        this.answerText = new Phaser.Text(game, 0, 0, `${this.configs.questions[this.configs.countQuiz].answers[this.configs.index]}`, {
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
        this.sprite.value = this.configs.index + 1;
        this.sprite.addChild(this.answerText);
    }

    hide() {
        this.answerText.addColor("#ffffff", 0);
        this.sprite.alpha = 0.15;
        this.sprite.inputEnabled = false;
    }

    activeInput() {
        this.sprite.inputEnabled = true;
    }

    destroy() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        super.destroy();
    }
}