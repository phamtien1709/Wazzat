import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import PlayingLogic from "../../../controller/PlayingLogic.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeActionPhase extends BaseView {
    constructor() {
        super(game, null);

        this.tween = null;
        this.countTween = 0;
        this.scaleMin = 0.8;

        this.arrStr = [
            Language.instance().getData("32"),
            Language.instance().getData("33"),
            Language.instance().getData("34"),
            Language.instance().getData("35"),
            Language.instance().getData("36"),
            Language.instance().getData("37"),
            Language.instance().getData("38"),
            Language.instance().getData("39"),
            Language.instance().getData("40")
        ];
        this.arrColor = ["#0cdb69", "#fff222", "#0ff5f8"];
        this.arrSpriteStreak = ["actionphaseanswer1", "actionphaseanswer2", "actionphaseanswer3"];
        this.arrSize = [70, 70, 65, 70, 70, 65, 70, 60, 70];

        this.action = null;

        this.lbText = new TextBase(MainData.instance().positionCreateRoom.text_action_phase_true_answer, "");
        this.lbText.anchor.set(0.5);
        this.lbText.x = this.getWidth() / 2;
        this.lbText.y = this.getHeight() / 2;
        this.addChild(this.lbText);
    }

    addStreak() {
        this.removeStreak();

        ControllSoundFx.instance().playSound(ControllSoundFx.streakanswer);

        this.action = new Phaser.Sprite(game, 0, 0, this.arrSpriteStreak[PlayingLogic.instance().randomNumber(0, 2)]);
        this.action.animations.add("actionphaseanswer");
        this.action.animations.play("actionphaseanswer", 30);
        this.action.x = (this.getWidth() - this.action.width) / 2;
        this.action.y = (this.getHeight() - this.action.height) / 2;
        this.addChildAt(this.action, 0);
    }

    removeStreak() {
        if (this.action !== null) {
            this.removeChild(this.action);
            this.action.destroy();
            this.action = null;
        }
    }


    getWidth() {
        return 280;
    }

    getHeight() {
        return 280;
    }

    setStreak(streak) {
        streak = streak - 1;
        if (streak < 0) {
            streak = 0;
        }
        if (streak > this.arrStr.length - 1) {
            streak = this.arrStr.length - 1;
        }
        this.countTween = 0;
        this.scaleMin = 0.8;

        // console.log("setStreak : " + streak);
        //streak = 7;

        this.addStreak();


        let style = {
            fontSize: this.arrSize[streak],
            fill: this.arrColor[PlayingLogic.instance().randomNumber(0, 2)]
        }

        this.bounces = 100;

        this.lbText.scale.set(0);
        this.lbText.changeStyle(style);
        this.lbText.text = this.arrStr[streak].toUpperCase();


        this.beginTween();

        this.removeIdTime();
        this.idTime = game.time.events.add(Phaser.Timer.SECOND * 1.5, this.setDefault, this);
    }

    beginTween() {
        this.removeTween();
        this.countTween++;
        if (this.countTween === 1) {
            this.tween = game.add.tween(this.lbText.scale).to({ x: 1, y: 1 }, 150, Phaser.Easing.Sinusoidal.InOut, true);
        } else {
            this.tween = game.add.tween(this.lbText.scale).to({ x: 1, y: 1 }, this.bounces, Phaser.Easing.Sinusoidal.InOut, true);
        }
        this.tween.onComplete.add(this.onCompleteTween, this);
        this.bounces += 50;
    }

    onCompleteTween() {
        this.removeTween();
        if (this.countTween < 2) {
            this.tween = game.add.tween(this.lbText.scale).to({ x: this.scaleMin, y: this.scaleMin }, this.bounces, Phaser.Easing.Sinusoidal.InOut, true);
            this.tween.onComplete.add(this.beginTween, this);
            this.bounces += 50;
            this.scaleMin += 0.1;
        }
    }

    removeTween() {
        if (this.tween !== null) {
            game.tweens.remove(this.tween);
            this.tween = null;
        }
    }


    removeIdTime() {
        if (this.idTime !== null) {
            game.time.events.remove(this.idTime);
        }
    }

    setDefault() {
        this.removeIdTime();
        this.removeStreak();
        this.lbText.text = "";
    }

    get width() {
        return this.getWidth();
    }

    destroy() {

        this.arrStr.length = 0;
        this.arrColor.length = 0;
        this.arrSpriteStreak.length = 0;
        this.arrSize.length = 0;

        this.setDefault();
        super.destroy();
    }
}