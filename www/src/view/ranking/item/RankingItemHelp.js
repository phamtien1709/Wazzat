import BaseView from "../../BaseView.js";
import SpriteScale9Base from "../../component/SpriteScale9Base.js";
import TextBase from "../../component/TextBase.js";
import MainData from "../../../model/MainData.js";

export default class RankingItemHelp extends BaseView {
    constructor(content) {
        super(game, null);
        this.positionRanking = MainData.instance().positionPopup;

        this.bg = new SpriteScale9Base(this.positionRanking.ranking_bg_help);
        this.addChild(this.bg);

        this.txtContent = new TextBase(this.positionRanking.ranking_text_help, content);
        this.txtContent.x = 35 * MainData.instance().scale;
        this.addChild(this.txtContent);
        this.bg.width = this.txtContent.x + this.txtContent.width + 24 * MainData.instance().scale;
        this.bg.height = this.txtContent.y + this.txtContent.height + 25 * MainData.instance().scale;
    }

    setWidthHeight() {
        this.bg.width = this.txtContent.x + this.txtContent.width + 24 * MainData.instance().scale;
        this.bg.height = this.txtContent.y + this.txtContent.height + 25 * MainData.instance().scale;
    }

    get width() {
        return this.bg.width;
    }
    get height() {
        return this.bg.height;
    }
}