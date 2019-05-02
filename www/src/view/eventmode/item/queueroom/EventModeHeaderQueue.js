import BaseView from "../../../BaseView.js";
import ButtonBase from "../../../component/ButtonBase.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";
import KeyBoard from "../../../component/KeyBoard.js";

export default class EventModeHeaderQueue extends BaseView {
    constructor() {
        super(game, null);
        this.event = {
            back: new Phaser.Signal(),
            trophy: new Phaser.Signal()
        }

        this.positionEventMode = MainData.instance().positionEventMode;

        this.bg = new ButtonBase(this.positionEventMode.header_bg_queue);
        this.addChild(this.bg);

        this.iconTrophy = new ButtonBase(this.positionEventMode.header_icon_trophy, this.chooseTrophy, this);
        this.addChild(this.iconTrophy);

        let animBtnRank = new Phaser.Sprite(game, 0, 0, 'btnRankAnim');
        animBtnRank.width = 51;
        animBtnRank.height = 50;
        animBtnRank.x = -12;
        animBtnRank.y = -10;

        animBtnRank.animations.add('run_rank');
        animBtnRank.animations.play('run_rank', 26, true);
        this.iconTrophy.addChild(animBtnRank);


        this.btnBack = new ButtonBase(this.positionEventMode.header_buttom_back, this.chooseBack, this);
        this.btnBack.width = 50 * MainData.instance().scale;
        this.btnBack.height = 50 * MainData.instance().scale
        this.btnBack.x = 10 * MainData.instance().scale;
        this.btnBack.y = 10 * MainData.instance().scale;
        this.addChild(this.btnBack);

        this.txtTitle = new TextBase(this.positionEventMode.header_queue_text_title, "");
        this.txtTitle.setTextBounds(0, 0, this.bg.width, this.bg.height);
        this.addChild(this.txtTitle);
    }

    setTitle(_content) {
        this.txtTitle.text = _content;
    }

    setHideBack() {
        this.btnBack.visible = false;
    }
    setHideTrophy() {
        this.iconTrophy.visible = false;
    }

    chooseTrophy() {
        LogConsole.log("chooseTrophy");
        KeyBoard.instance().hide();
        this.btnBack.inputEnabled = false;
        this.event.trophy.dispatch();
    }

    chooseBack() {
        LogConsole.log("chooseBack");
        KeyBoard.instance().hide();
        this.btnBack.inputEnabled = false;
        this.event.back.dispatch();
    }
}