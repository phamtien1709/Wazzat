import TextScroller from "./component/TextScroller.js";
import ControllDialog from "./ControllDialog.js";

export default class ControllTextScroller {
    constructor() {
        this.arrNotify = [];
        this.isShow = false;
        this.textScroll = null;
        this.idDelayTime = null;
    }

    static instance() {
        if (this.controllTextScroller) {

        } else {
            this.controllTextScroller = new ControllTextScroller();
        }
        return this.controllTextScroller;
    }


    addNotify(data) {

        let objData = {
            message: "",
            show_times: 0,
            pending_time_in_second: 0
        };

        objData.message = data.getUtfString("message");
        objData.show_times = data.getInt("show_times");
        objData.pending_time_in_second = data.getInt("pending_time_in_second");

        this.arrNotify.push(objData);

        if (this.isShow === false) {
            this.showNotify();
        }
    }

    showNotify() {
        if (this.arrNotify.length > 0) {
            this.addTextScroll(this.arrNotify[0].message);
        }
    }

    checkShowNotify() {
        if (this.arrNotify.length > 0) {
            this.arrNotify[0].show_times = this.arrNotify[0].show_times - 1;
            if (this.arrNotify[0].show_times < 1) {
                this.arrNotify.shift();
                if (this.arrNotify.length > 0) {
                    this.showNotify();
                } else {
                    this.removeTextScroll();
                    this.isShow = false;
                }
            } else {
                this.removeTextScroll();
                this.removeDelaytime();
                this.idDelayTime = game.time.events.add(Phaser.Timer.SECOND * this.arrNotify[0].pending_time_in_second, this.showNotify, this);
            }

        } else {
            this.removeTextScroll();
            this.isShow = false;
        }
    }

    removeDelaytime() {
        if (this.idDelayTime !== null) {
            game.time.events.remove(this.idDelayTime);
            this.idDelayTime = null;
        }
    }


    addTextScroll(str) {
        this.isShow = true;
        this.removeTextScroll();
        this.textScroll = new TextScroller(str);
        this.textScroll.event.complete.add(this.checkShowNotify, this);
        ControllDialog.instance().addChild(this.textScroll);
    }

    removeTextScroll() {
        if (this.textScroll !== null) {
            ControllDialog.instance().removeChild(this.textScroll);
            this.textScroll.destroy();
            this.textScroll = null;
        }
    }

}