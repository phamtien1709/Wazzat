import BaseView from "../../BaseView.js";


export default class ItemPage extends BaseView {
    constructor() {
        super(game, null);
    }

    init() {

    }

    afterCreate() {
        this.columnNumber = 0;
        this.rowNumber = 0;
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.leftDistance = 0;
        this.distanceBetweenColumns = 0;
        this.distanceBetweenRows = 0;
    }

    setViewList(viewList) {
        for (let i = 0; i < viewList.length; i++) {
            if (i % this.columnNumber === 0)
                viewList[i].x = this.leftDistance;
            else
                viewList[i].x = viewList[i - 1].x + viewList[i - 1].width + this.distanceBetweenColumns;

            let rowIndex = Math.floor(i / this.columnNumber);
            if (rowIndex === 0)
                viewList[i].y = 0;
            else
                viewList[i].y = viewList[i - this.columnNumber].y + viewList[i - this.columnNumber].height + this.distanceBetweenRows;
            this.addChild(viewList[i]);
        }
    }

    get height() {
        return this.viewHeight;
    }

    get width() {
        return this.viewWidth;
    }

    destroy() {
        console.log("destroy- ItemPage-----------");
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }
    }
}