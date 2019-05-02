import BaseView from "../../BaseView.js";
import ListView from "../../../../libs/listview/list_view.js";
import ItemPage from "./ItemPage.js";

export default class ScrollView extends BaseView {
    constructor(obj) {
        super(game, null);

        this.event = {
            changeIndex: new Phaser.Signal()
        }

        if (obj) {
            this.columnNumber = obj.column;
            this.viewWidth = obj.width;
            this.viewHeight = obj.height;
            this.rowHeight = obj.rowHeight;
            this.leftDistance = obj.leftDistance;
            this.direction = obj.direction;
            this.distanceBetweenColumns = obj.distanceBetweenColumns;
            this.distanceBetweenRows = obj.distanceBetweenRows;
        }
        this.idDelay = null;
        this.idx = 0;
        this.countItem = 0;
        this.list = [];

        let group = new Phaser.Group(game);
        let rect = new Phaser.Rectangle(0, 0, this.viewWidth, this.viewHeight);
        this.scroll = new ListView(this.game, group, rect, {
            direction: this.direction,
            searchForClicks: true,
            padding: this.distanceBetweenRows
        });
        this.scroll.events.changeIndex.add(this.changeIndex, this);
        this.addChild(group);
    }

    changeIndex() {
        this.event.changeIndex.dispatch(this.scroll.getIdx())
    }


    set viewList(list) {
        this.scroll.reset();
        this.scroll.removeAll();
        this.idx = 0;
        this.countItem = 0;
        this.list = list;

        if (this.list.length > 0) {
            // this.buildListItem();
            this.removeDelayBuild();
            this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 0.3, this.buildListItem, this);
        }
    }

    buildListItem() {
        let page;
        for (let i = this.idx; i < this.list.length; i++) {
            let itemPerPage = this.columnNumber;
            if (i % itemPerPage === 0)
                page = [];
            page.push(this.list[i]);
            this.idx++;
            if (page.length === this.columnNumber || i === this.list.length - 1) {
                let itemPage = new ItemPage();
                itemPage.columnNumber = this.columnNumber;
                itemPage.rowNumber = 1;
                itemPage.viewWidth = this.viewWidth;
                itemPage.viewHeight = this.rowHeight;
                itemPage.leftDistance = this.leftDistance;
                itemPage.distanceBetweenColumns = this.distanceBetweenColumns;
                itemPage.distanceBetweenRows = this.distanceBetweenRows;

                itemPage.setViewList(page);
                this.countItem++;
                this.scroll.add(itemPage);

                /*
                if (this.countItem % 3 === 0) {
                    if (this.idx < this.list.length) {
                        this.removeDelayBuild();
                        this.idDelay = game.time.events.add(Phaser.Timer.SECOND * 1, this.buildListItem, this);
                    }
                    break;
                }*/
            }
        }
    }

    addItem(list) {
        let itemPage = new ItemPage();
        itemPage.columnNumber = this.columnNumber;
        itemPage.rowNumber = 1;
        itemPage.viewWidth = this.viewWidth;
        itemPage.viewHeight = this.rowHeight;
        itemPage.leftDistance = this.leftDistance;
        itemPage.distanceBetweenColumns = this.distanceBetweenColumns;
        itemPage.distanceBetweenRows = this.distanceBetweenRows;
        itemPage.setViewList(list);

        this.scroll.add(itemPage);
    }

    removeDelayBuild() {
        if (this.idDelay !== null) {
            game.time.events.remove(this.idDelay);
            this.idDelay = null;
        }
    }

    destroy() {
        this.removeDelayBuild();

        this.scroll.removeAll();
        this.scroll.destroy();

        this.removeAllItem();

        if (this.parent) {
            let item = this;
            this.parent.removeChild(item);
            item.destroy();
            item = null;
        }
        super.destroy();
    }
}