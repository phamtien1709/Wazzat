import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";
import EventGame from "../../../controller/EventGame.js";
import Language from "../../../model/Language.js";

export default class RankingItemHeader extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal(),
            help: new Phaser.Signal()
        }

        this.positionRanking = MainData.instance().positionRanking;

        this.bg = new SpriteBase(this.positionRanking.header_bg);
        this.addChild(this.bg);

        this.txtTitle = new TextBase(this.positionRanking.header_text_title, Language.instance().getData("125"));
        this.txtTitle.setTextBounds(0, 0, game.width, 31 * MainData.instance().scale);
        this.addChild(this.txtTitle);

        this.btnBack = new ButtonBase(this.positionRanking.header_button_back, this.chooseBack, this);
        this.addChild(this.btnBack);

        this.btnHelp = new ButtonBase(this.positionRanking.header_button_help, this.chooseHelp, this);
        this.addChild(this.btnHelp);

        this.addEvent();
    }

    addEvent() {
        EventGame.instance().event.backButton.add(this.chooseBack, this);
    }

    removeEvent() {
        EventGame.instance().event.backButton.remove(this.chooseBack, this);
    }

    chooseBack() {
        //console.log('HERE HERE HERE');
        this.btnBack.inputEnabled = false;
        this.event.back.dispatch();
    }

    chooseHelp() {
        this.event.help.dispatch();
    }

    destroy() {
        this.removeEvent();
        super.destroy();
    }
}