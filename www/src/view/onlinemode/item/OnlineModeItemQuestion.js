import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import Language from "../../../model/Language.js";

export default class OnlineModeItemQuestion extends BaseView {
    constructor() {
        super(game, null);
    }
    afterCreate() {
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.txtQuestion = new TextBase(this.positionCreateRoom.text_question_playroom, "");
        this.txtQuestion.x = 0;
        this.txtQuestion.y = 3 * MainData.instance().scale;
        this.txtQuestion.setTextBounds(0, 0, game.width, 33 * MainData.instance().scale);
        this.addChild(this.txtQuestion);

        this.playerChoose = new TextBase(this.positionCreateRoom.text_question_playroom, "");
        this.playerChoose.x = 0;
        this.playerChoose.y = 30 * MainData.instance().scale;
        this.playerChoose.setTextBounds(0, 0, game.width, 33 * MainData.instance().scale);
        this.addChild(this.playerChoose);
    }

    get width() {
        return game.width;
    }

    get height() {
        return this.txtQuestion.height;
    }

    set alpha(_alpha) {
        if (this.children) {
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].alpha = _alpha;
            }
        }
    }

    setText(question_type) {
        let strQuestion = "";
        if (question_type == "SONG") {
            strQuestion = Language.instance().getData("22");
        }
        if (question_type == "SINGER") {
            strQuestion = Language.instance().getData("23");
        }
        LogConsole.log("strQuestion :" + strQuestion);


        this.txtQuestion.setText(strQuestion);

        /*
        this.alpha = 0.3;

        game.add.tween(this).to({
            alpha: 1
        }, 1000, Phaser.Easing.Power1, true);*/
    }
    setPlayerChoose(username) {
        if (username === "") {
            this.playerChoose.clearColors();
            this.playerChoose.text = Language.instance().getData("50");
        } else {
            this.playerChoose.text = Language.instance().getData("51") + " " + username;
            this.playerChoose.addColor("#FFA238", Language.instance().getData("51").length);
        }
    }

    destroy() {
        this.txtQuestion.destroy();
        super.destroy();
    }
}