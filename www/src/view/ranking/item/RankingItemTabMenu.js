import BaseView from "../../BaseView.js";
import TextBase from "../../component/TextBase.js";
import SpriteBase from "../../component/SpriteBase.js";
import ButtonBase from "../../component/ButtonBase.js";
import MainData from "../../../model/MainData.js";

export default class RankingItemTabMenu extends BaseView {
    constructor(content, idx) {
        super(game, null);
        this.event = {
            choose_item: new Phaser.Signal()
        }
        this.idx = idx;
        this.positionRanking = MainData.instance().positionRanking;

        this.bg = new ButtonBase(this.positionRanking.menu_item_active, this.chooseButton, this);
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.alpha = 0;
        this.bg.height = 100 * MainData.instance().scale;
        this.addChild(this.bg);

        this.txtContent = new TextBase(this.positionRanking.menu_item_text_content, content);
        this.bg.width = this.txtContent.width + 71 * MainData.instance().scale;
        this.txtContent.x = (this.bg.width - this.txtContent.width) / 2;
        this.txtContent.y = (this.bg.height - this.txtContent.height) / 2;
        this.addChild(this.txtContent);

        this.lineActive = new SpriteBase(this.positionRanking.menu_item_active);
        this.lineActive.width = this.bg.width;
        this.addChild(this.lineActive);

        this.lineDoc = new SpriteBase(this.positionRanking.menu_item_line_doc);
        this.lineDoc.x = this.bg.width - this.lineDoc.width;
        this.lineDoc.y = (this.bg.height - this.lineDoc.height) / 2;
        this.addChild(this.lineDoc);
    }



    hideLineDoc() {
        this.lineDoc.visible = false;
    }
    active() {
        this.lineActive.visible = true;
        this.txtContent.changeStyle({
            fill: "#ffffff"
        })

    }
    deactive() {
        this.lineActive.visible = false;
        this.txtContent.changeStyle({
            fill: "#695782"
        })
    }

    chooseButton() {

        this.event.choose_item.dispatch(this.idx);

    }

    getIdx() {
        return this.idx;
    }

    get width() {
        return this.bg.width;
    }

    get height() {
        return this.bg.height;
    }
}