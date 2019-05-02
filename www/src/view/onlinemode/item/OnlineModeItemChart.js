import BaseView from "../../BaseView.js";
import SpriteBase from "../../component/SpriteBase.js";

export default class OnlineModeItemChart extends BaseView {
    constructor() {
        super(game, null);
        this.chart = null;
    }

    addChart(isMe) {
        this.removeChart();

        let nameSprite = "";
        if (isMe) {
            nameSprite = "Light_You";
        } else {
            nameSprite = "Light_Other";
        }
        let objData = {
            x: 0,
            y: 0,
            nameAtlas: "createroom",
            nameSprite: nameSprite
        }

        this.chart = new SpriteBase(objData);
        this.addChild(this.chart);
    }

    set height(_height) {
        this.chart.height = _height;
    }

    removeChart() {
        if (this.chart !== null) {
            this.removeChild(this.chart);
            this.chart.destroy();
            this.chart = null;
        }
    }
}