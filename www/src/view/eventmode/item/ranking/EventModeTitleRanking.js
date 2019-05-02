import BaseView from "../../../BaseView.js";
import SpriteScale9Base from "../../../component/SpriteScale9Base.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import EventModeRoomWinItem from "../selectroom/EventModeRoomWinItem.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeTitleRanking extends BaseView {
    constructor(title, data = null) {
        super(game, null);
        this.positionEventMode = MainData.instance().positionEventMode;
        this.bg = new SpriteScale9Base(this.positionEventMode.ranking_bg_title);
        this.addChild(this.bg);

        let tropphy = new SpriteBase(this.positionEventMode.ranking_trophy410);
        this.addChild(tropphy);

        this.txtTitle = new TextBase(this.positionEventMode.ranking_text_title, title);
        this.addChild(this.txtTitle);

        if (data === null) {

        } else {
            this.dataWin = new EventModeRoomWinItem(data, true);
            this.dataWin.hideBg();
            this.dataWin.x = this.bg.width - this.dataWin.width - 35 * MainData.instance().scale;
            this.dataWin.y = (this.bg.height - this.dataWin.height) / 2;
            this.addChild(this.dataWin);
        }

        this.line = new SpriteBase(this.positionEventMode.queueroom_line_select_event);
        this.line.y = 72 * MainData.instance().scale;
        this.addChild(this.line);
    }

    get width() {
        return this.bg.width;
    }
    get height() {
        return this.bg.height;
    }
}