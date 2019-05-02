import MainData from "../../../model/MainData.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import TextBase from "../../component/TextBase.js";
import AvatarPlayer from "../../base/AvatarPlayer.js";
import SocketController from "../../../controller/SocketController.js";
import ControllSoundFx from "../../../controller/ControllSoundFx.js";


export default class OnlineModeItemAnswer extends Phaser.Button {
    constructor(callback, callbackContext) {
        super(game, 0, 0, null, callback, callbackContext);
        this.idx = -1;
        this.afterCreate();
    }

    afterCreate() {
        this.ktSetAva = true;

        this.positionOnlineMode = MainData.instance().positionDefaultSource;

        this.noChoose = false;
        this.bg = new SpriteScale9Base(this.positionOnlineMode.bg_answer_question);
        this.addChild(this.bg);

        this.bgNoChoose = new SpriteScale9Base(this.positionOnlineMode.bg_answer_question_nochoose);
        this.bgNoChoose.visible = false;
        this.addChild(this.bgNoChoose);

        this.txtAnswer = new TextBase(this.positionOnlineMode.text_answer_question);
        this.addChild(this.txtAnswer);

        this.ava = new AvatarPlayer();
        this.ava.setSize(36 * MainData.instance().scale, 36 * MainData.instance().scale);
        this.ava.x = 9 * MainData.instance().scale;
        this.ava.y = (this.bg.height - this.ava.height) / 2;
        this.addChild(this.ava);

        this.setAva(SocketController.instance().dataMySeft.avatar);
    }

    setNoChoose() {
        this.noChoose = true;
    }

    setAva(url) {
        if (this.ktSetAva) {
            this.ktSetAva = false;
            this.ava.setAvatar(url, 1);
        }
    }

    get width() {
        return this.bg.width;
    }

    get height() {
        return this.bg.height;
    }

    setTextNoChoose() {
        LogConsole.log("setTextNoChoose : " + this.idx);
        this.bgNoChoose.visible = true;
        this.bg.visible = false;
        this.txtAnswer.changeStyle({
            fill: "#807d8d"
        });
        //this.alpha = 0.5;
    }
    setDefaultText() {
        LogConsole.log("setDefaultText" + this.idx);
        this.bgNoChoose.visible = false;
        this.bg.visible = true;
        this.ava.visible = false;
        this.txtAnswer.changeStyle({
            fill: "black"
        });
        // this.alpha = 1;
    }

    setTrueText() {
        LogConsole.log("setTrueText" + this.idx);
        this.bgNoChoose.visible = false;
        this.bg.visible = true;
        this.txtAnswer.changeStyle({
            fill: "#30FF77"
        });
        // this.alpha = 1;
    }
    setFailText() {
        LogConsole.log("setFailText" + this.idx);
        this.bgNoChoose.visible = false;
        this.bg.visible = true;
        this.txtAnswer.changeStyle({
            fill: "#ff0000"
        });
        //this.alpha = 1;
    }

    setChooseAnswer() {
        this.ava.visible = true;
    }

    setConstX(_constX) {
        this.constX = _constX;
    }

    setData(answer, idx) {
        //LogConsole.log("answer------ : " + answer);
        this.noChoose = false;
        this.idx = idx;
        this.txtAnswer.setText(answer);
        this.txtAnswer.x = (this.bg.width - this.txtAnswer.width) / 2;
        this.txtAnswer.y = (this.bg.height - this.txtAnswer.height) / 2;
        this.setDefaultText();

        this.x = game.width;

        game.add.tween(this).to({
            x: this.constX
        }, 300, Phaser.Easing.Power1, true, 500 + 200 * idx);
    }

    onInputDownHandler() {
        LogConsole.log("onInputDownHandler------------");
        super.onInputDownHandler();
        ControllSoundFx.instance().playSound(ControllSoundFx.buttonclick);
    }

    getIdx() {
        return this.idx;
    }

    hideAnswer(idx) {
        this.x = this.constX;
        game.add.tween(this).to({
            x: -this.width - 100
        }, 300, Phaser.Easing.Power1, true, 100 * idx);
    }
}