import BaseView from "../../../BaseView.js";
import TextBase from "../../../component/TextBase.js";
import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventGameRoomMode extends BaseView {
    constructor(title) {
        super(game, null);
        this.title = title;
        this.positionEventMode = MainData.instance().positionEventMode;

        this.txtDes = new TextBase(this.positionEventMode.queueroom_txt_title_event, title);
        this.addChild(this.txtDes);

        this.line = new SpriteBase(this.positionEventMode.queueroom_line_select_event);
        this.addChild(this.line);
    }

    setCount(count) {

        this.txtDes.text = this.title + " (" + count + ")";
    }

    get height() {
        return 53 * MainData.instance().scale;
    }
    get width() {
        return game.width;
    }
}