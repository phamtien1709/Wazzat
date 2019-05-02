import BaseView from "../../../BaseView.js";
import SpriteBase from "../../../component/SpriteBase.js";
import MainData from "../../../../model/MainData.js";

export default class EventModeQueueRoomLine extends BaseView {
    constructor() {
        super(game, null);
        this.arrCircle = [];
        this.positionEventMode = MainData.instance().positionEventMode;

        this.circleFist = new SpriteBase(this.positionEventMode.queueroom_map_circle)
        this.circleFist.y = 85 * MainData.instance().scale;

        this.lineDocFist = new SpriteBase(this.positionEventMode.queueroom_map_line_doc);
        this.lineDocFist.x = (this.circleFist.width - this.lineDocFist.width) / 2;
        this.addChild(this.lineDocFist);


        let line = new SpriteBase(this.positionEventMode.queueroom_map_line_ngang);

        line.x = this.circleFist.width / 2;
        line.y = this.circleFist.y + (this.circleFist.height - line.height) / 2;
        this.addChild(line);

        this.addChild(this.circleFist);

        this.circleEnd = new SpriteBase(this.positionEventMode.queueroom_map_circle);
        this.circleEnd.x = line.x + line.width - this.circleEnd.width / 2;
        this.circleEnd.y = this.circleFist.y;

        this.lineDocEnd = new SpriteBase(this.positionEventMode.queueroom_map_line_doc);
        this.lineDocEnd.x = this.circleEnd.x + (this.circleFist.width - this.lineDocEnd.width) / 2;
        this.addChild(this.lineDocEnd);

        this.addChild(this.circleEnd);

        let kc = line.width / 5;

        for (let i = 0; i < 4; i++) {
            let circleSmall = new SpriteBase(this.positionEventMode.queueroom_map_circle_small);
            circleSmall.x = kc * (i + 1);
            circleSmall.y = this.circleFist.y + (this.circleFist.height - circleSmall.height) / 2;
            this.addChild(circleSmall);
            this.arrCircle.push(circleSmall);
        }
    }

    addLineRanking() {
        this.cup = new SpriteBase(this.positionEventMode.queueroom_trophy_big);
        this.addChild(this.cup);

        for (let i = 0; i < this.arrCircle.length; i++) {
            this.arrCircle[i].visible = false;
        }

        this.circleFist.visible = false;
    }

    setIdxBegin(idx) {
        this.idx = idx;
        if (idx < 2) {
            this.setIdx(idx);
        } else {
            this.setHideLine();
        }
    }

    setLine() {
        this.setIdx(this.idx);
    }

    setHideLine() {
        this.lineDocEnd.visible = false;
        this.lineDocFist.visible = false;
    }

    setIdx(idx) {
        this.idx = idx;
        if (idx % 2 === 0) {
            this.lineDocEnd.visible = true;
            this.lineDocFist.visible = false;
        } else {
            this.lineDocEnd.visible = false;
            this.lineDocFist.visible = true;
        }
    }
}