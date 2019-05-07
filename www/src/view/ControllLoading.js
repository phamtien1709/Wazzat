import LoadingAnim from "./component/LoadingAnim.js";
import MainData from "../model/MainData.js";

export default class ControllLoading extends Phaser.Group {
    constructor() {
        super(game)
        this.idShowResult = null;
        this.bg = null;
        this.loading = null;
    }

    static instance() {
        if (this.controllLoading) {

        } else {
            this.controllLoading = new ControllLoading();
        }

        return this.controllLoading;
    }

    showLoading() {
        // console.log("showLoading------------------");
        this.removeAllItem();

        this.bg = new Phaser.Button(game, 0, 0, "screen-dim2", this.chooseBgLoading, this);
        this.addChild(this.bg);

        this.loading = new LoadingAnim();
        this.addChild(this.loading);
        //
        MainData.instance().isShowLoading = true;

        this.removeShowResult();
        this.idShowResult = game.time.events.add(Phaser.Timer.SECOND * 20, this.hideLoading, this);

    }

    chooseBgLoading() {
        // console.log("chooseBgLoading--------------");
    }

    removeShowResult() {
        if (this.idShowResult !== null) {
            game.time.events.remove(this.idShowResult);
            this.idShowResult = null;
        }
    }

    hideLoading() {
        MainData.instance().isShowLoading = false;
        this.removeAllItem();
        this.removeShowResult();
    }


    removeAllItem() {
        while (this.children.length > 0) {
            let item = this.children[0];
            this.removeChild(item);
            item.destroy();
            item = null;
        }

        this.bg = null;
        this.loading = null;
    }

}