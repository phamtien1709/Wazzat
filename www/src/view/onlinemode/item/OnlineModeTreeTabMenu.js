import BaseView from "../../BaseView.js";
import OnlineModeButtonMenuGenres from "./OnlineModeButtonMenuGenres.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import Language from "../../../model/Language.js";
import MainData from "../../../model/MainData.js";

export default class OnlineModeTreeTabMenu extends BaseView {
    static TREE_BET() {
        return "TREE_BET";
    }
    static TREE_PLAYLIST() {
        return "TREE_PLAYLIST";
    }

    constructor(type, local = "", genres = "") {
        super(game, null);

        this.event = {
            backBet: new Phaser.Signal(),
            backGenres: new Phaser.Signal()
        }
        this.positionCreateRoom = MainData.instance().positionCreateRoom;

        this.bgTree = new OnlineModeButtonMenuGenres("");
        this.bgTree.setActiveBet();
        this.addChild(this.bgTree);

        this.lbBackGennes = new TextBase(this.positionCreateRoom.quickplay_txt_button_back_menu_visilbe, local);
        this.lbBackGennes.x = 33 * MainData.instance().scale;
        this.lbBackGennes.y = 39 * MainData.instance().scale;
        this.lbBackGennes.setButton(this.backToGenres, this);
        this.addChild(this.lbBackGennes);

        this.iconArraow = new SpriteBase(this.positionCreateRoom.quickplay_arrow_back_menu); //
        this.iconArraow.x = this.lbBackGennes.x + this.lbBackGennes.width + 12 * MainData.instance().scale;
        this.iconArraow.y = this.lbBackGennes.y + (this.lbBackGennes.height - this.iconArraow.height) / 2;
        this.addChild(this.iconArraow);

        if (type === OnlineModeTreeTabMenu.TREE_BET) {
            this.lbGennes = new TextBase(this.positionCreateRoom.quickplay_txt_button_back_menu, genres);
        } else {
            this.lbGennes = new TextBase(this.positionCreateRoom.quickplay_txt_button_back_menu_visilbe, genres);
            this.lbGennes.setButton(this.backToBets, this);
        }
        this.lbGennes.y = this.lbBackGennes.y;
        this.lbGennes.x = this.iconArraow.x + this.iconArraow.width + 12 * MainData.instance().scale;
        this.addChild(this.lbGennes);

        if (type === OnlineModeTreeTabMenu.TREE_PLAYLIST) {
            this.iconArraow1 = new SpriteBase(this.positionCreateRoom.quickplay_arrow_back_menu); //
            this.iconArraow1.x = this.lbGennes.x + this.lbGennes.width + 12 * MainData.instance().scale;
            this.iconArraow1.y = this.lbGennes.y + (this.lbGennes.height - this.iconArraow1.height) / 2;
            this.addChild(this.iconArraow1);

            this.lbPlayerList = new TextBase(this.positionCreateRoom.quickplay_txt_button_back_menu, Language.instance().getData("54"));
            this.lbPlayerList.y = this.lbBackGennes.y;
            this.lbPlayerList.x = this.iconArraow1.x + this.iconArraow1.width + 12 * MainData.instance().scale;
            this.addChild(this.lbPlayerList);
        }
    }

    backToGenres() {
        this.event.backGenres.dispatch();
    }

    backToBets() {
        LogConsole.log("backToBets")
        this.event.backBet.dispatch();
    }
}