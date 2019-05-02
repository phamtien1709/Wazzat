import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import TextBase from "../../../component/TextBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeQueueCountUser extends BaseView {
    constructor() {
        super(game, null);
        this.positionEventMode = MainData.instance().positionEventMode;

        this.icon = new SpriteBase(this.positionEventMode.queueroom_count_user_map);
        this.addChild(this.icon);

        this.txtCount = new TextBase(this.positionEventMode.queueroom_count_user_text, "(99)");
        this.txtCount.setTextBounds(0, 0, this.constWidth, this.constHeigth);
        this.addChild(this.txtCount);
    }

    get constWidth() {
        return 35 * MainData.instance().scale;
    }

    get constHeigth() {
        return 22 * MainData.instance().scale;
    }

    setLeft(count) {
        this.txtCount.changeStyle({
            align: "right",
            boundsAlignH: "right",
            boundsAlignV: "middle"
        })

        this.txtCount.x = -this.constWidth - 3 * MainData.instance().scale;
        this.txtCount.y = (this.icon.height - this.constHeigth) / 2 + 3 * MainData.instance().scale;
        this.txtCount.text = "(" + count + ")";
    }
    setRight(count) {
        this.txtCount.changeStyle({
            align: "left",
            boundsAlignH: "left",
            boundsAlignV: "middle"
        })
        this.txtCount.x = this.icon.width + 3;
        this.txtCount.y = (this.icon.height - this.constHeigth) / 2 + 3 * MainData.instance().scale;
        this.txtCount.text = "(" + count + ")";
    }
    setTop(count) {
        this.txtCount.changeStyle({
            align: "center",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        })
        this.txtCount.x = (this.icon.width - this.constWidth) / 2;
        this.txtCount.y = -this.constHeigth;
        this.txtCount.text = "(" + count + ")";
    }
    setBottom(count) {
        this.txtCount.changeStyle({
            align: "center",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        })
        this.txtCount.x = (this.icon.width - this.constWidth) / 2;
        this.txtCount.y = this.icon.height + 3;
        this.txtCount.text = "(" + count + ")";
    }
}